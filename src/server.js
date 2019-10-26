require('dotenv').config();
const fs = require('fs');
const next = require('next');
const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
const glob = require('glob');
const Fuse = require('fuse.js');
const sort = require('fast-sort');

const clientPort = 8080;
const serverPort = 8081;

process.stdout.write('Starting EC2 Launch Wizard...\n');

// Load all community and quickstart AMIs from JSON files into memory
process.stdout.write('Loading AMIs into memory...\n');

let communityAmis = [];
const communityAmiFiles = glob.sync('src/static/amis/community*.json');
communityAmiFiles.forEach(fileName => {
  const fileData = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  communityAmis = communityAmis.concat(fileData.matchingAmis);
});
// Remove unnecessary fields
communityAmis = communityAmis.map(result => ({
  name: result.name,
  imageId: result.imageId64 || result.imageId,
  description: result.description || '',
  freeTier: false,
  architecture: result.architecture,
  platform: result.platform,
  rootDeviceType: result.rootDeviceType,
  rootDeviceName: result.rootDeviceName,
  virtualizationType: result.virtualizationType,
  enaSupport: result.enaSupport,
  imageOwnerAlias: result.imageOwnerAlias,
  imageLocation: result.imageLocation
}));

// Load quickstart AMIs
let quickstartAmis = JSON.parse(fs.readFileSync('src/static/amis/quickstart.json', 'utf8')).amiList;

// The quickstart AMIs have limited fields, so extract more fields
// for each particular AMI from the more detailed community AMIs object.
// Also, update the freeTier field in the community APIs with actual quickstart freeTier data.
quickstartAmis = quickstartAmis.map(quickstartAmi => {
  const imageId = quickstartAmi.imageId64 || quickstartAmi.imageId;
  const communityAmiRef = communityAmis.filter(ami => ami.imageId === imageId)[0];
  communityAmiRef.freeTier = quickstartAmi.freeTier;
  return communityAmiRef;
});

// Create Fuse searcher instance for community APIs
const fuseSearcher = new Fuse(communityAmis, {
  keys: ['name', 'description', 'imageId'],
  shouldSort: false,
  caseSensitive: false,
  threshold: 0.1
});

process.stdout.write(`Loaded ${communityAmis.length} community AMIs.\n`);

const nextApp = next({ dir: __dirname, dev: true });
const handle = nextApp.getRequestHandler();

// Start Next.js server
nextApp
  .prepare()
  .then(() => {
    const server = express();

    server.get('*', (req, res) => handle(req, res));

    server.listen(clientPort, '0.0.0.0', err => {
      if (err) throw err;

      process.stdout.write(`Next.js server listening on http://localhost:${clientPort}.\n`);
    });
  })
  .catch(ex => {
    process.stderr.write(ex.stack);
    process.exit(1);
  });

// Start API server
if (!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are not configured. Ensure the .env file is defined in the project root.');
}

const apiApp = express();

apiApp.use(cors());
apiApp.use(bodyParser.json());
apiApp.use(bodyParser.urlencoded({ extended: true }));

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'eu-west-2'
});

const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
const pricing = new AWS.Pricing({ region: 'us-east-1' }); // Pricing available at 'us-east-1', not 'eu-west-2'.

// Recursively retrieve all pages of products
function getAllProducts(service, filters = [], _nextToken) {
  const pricingFilters = Object.keys(filters).map(f => {
    return { Field: f, Type: 'TERM_MATCH', Value: filters[f] };
  });
  let allProducts = [];
  return new Promise((resolve, reject) => {
    pricing
      .getProducts({ ServiceCode: service, NextToken: _nextToken, Filters: pricingFilters })
      .promise()
      .then(data => {
        allProducts = allProducts.concat(data.PriceList);

        if (data.NextToken) {
          getAllProducts(service, filters, data.NextToken).then(dataRec => resolve(dataRec));
        } else {
          resolve(allProducts);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

// Recursively retrieve all pages of attribute values
function getAllAttributeValues(serviceCode, attributeName, _allAttributeValues = [], _nextToken) {
  let allAttributeValues = _allAttributeValues;
  return new Promise((resolve, reject) => {
    pricing
      .getAttributeValues({ ServiceCode: serviceCode, AttributeName: attributeName, NextToken: _nextToken })
      .promise()
      .then(data => {
        allAttributeValues = allAttributeValues.concat(data.AttributeValues);

        if (data.NextToken) {
          getAllAttributeValues(serviceCode, attributeName, allAttributeValues, data.NextToken).then(dataRec => resolve(dataRec));
        } else {
          resolve(allAttributeValues);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

// Recursively retrieve all pages of security groups
function getAllSecurityGroups(_results = [], _nextToken) {
  let results = _results;
  return new Promise((resolve, reject) => {
    ec2
      .describeSecurityGroups({ NextToken: _nextToken })
      .promise()
      .then(data => {
        results = results.concat(data.SecurityGroups);

        if (data.NextToken) {
          getAllAttributeValues(results, data.NextToken).then(dataRec => resolve(dataRec));
        } else {
          resolve(results);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

// Invert an object's keys<->values, assuming the values
// are able to be used as indices
function invertKeyValObj(data) {
  const inverted = {};
  Object.keys(data).forEach(key => {
    inverted[data[key]] = key;
  });
  return inverted;
}

// Get list of all security groups
// eg. http://localhost:8081/securityGroups
apiApp.get('/securityGroups', (req, res) => {
  getAllSecurityGroups()
    .then(securityGroupsData => {
      if (securityGroupsData) {
        const securityGroups = [];
        securityGroupsData.forEach(securityGroup => {
          securityGroups.push({
            name: securityGroup.GroupName,
            id: securityGroup.GroupId,
            description: securityGroup.Description || ''
          });
        });
        res.status(200).json({
          success: true,
          data: securityGroups
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: `Unable to load security groups.`
      });
    });
});

// Map EC2 `ToPort` ICMP types to names defined in RFC1700
const icmpTypesLookupTable = {
  '-1': 'All',
  '0': 'Echo reply',
  '3': 'Destination unreachable',
  '4': 'Source quench',
  '5': 'Redirect',
  '8': 'Echo',
  '9': 'Router advertisement',
  '10': 'Router selection',
  '11': 'Time exceeded',
  '12': 'Parameter problem',
  '13': 'Timestamp',
  '14': 'Timestamp reply',
  '15': 'Information request',
  '16': 'Information reply',
  '17': 'Address mask request',
  '18': 'Address mask reply',
  '30': 'Traceroute'
};

// Get detailed information on a specific security group id
// eg. http://localhost:8081/securityGroups/sg-01234567890123456
apiApp.get('/securityGroups/:groupId', (req, res) => {
  const params = { GroupIds: [req.params.groupId] };
  ec2
    .describeSecurityGroups(params)
    .promise()
    .then(data => {
      if (data.SecurityGroups && data.SecurityGroups.length && data.SecurityGroups.length > 0) {
        const securityGroup = data.SecurityGroups[0];
        const rules = [];
        if (securityGroup.IpPermissions) {
          securityGroup.IpPermissions.forEach(rule => {
            if (rule.IpRanges) {
              rule.IpRanges.forEach(range => {
                // TCP/UDP/ICMP
                if (['tcp', 'udp', 'icmp'].includes(rule.IpProtocol)) {
                  const isIcmp = rule.IpProtocol === 'icmp';
                  let portRange;
                  let icmpType;
                  if (!isIcmp) {
                    // Format port range, or a single port if both ports are the same
                    portRange = rule.FromPort === rule.ToPort ? `${rule.FromPort}` : `${rule.FromPort}-${rule.ToPort}`;
                  } else {
                    // ICMP codes
                    icmpType = icmpTypesLookupTable[`${rule.FromPort}`] || null;
                    if (!icmpType) return; // Skip other ICMP types we haven't accounted for in the lookup table
                  }
                  rules.push({
                    protocol: rule.IpProtocol,
                    [isIcmp ? 'icmpType' : 'portRange']: isIcmp ? icmpType : portRange,
                    cidrIp: range.CidrIp,
                    description: range.Description || ''
                  });
                }
                // All traffic
                else if (rule.IpProtocol === '-1') {
                  rules.push({
                    protocol: 'all_traffic',
                    cidrIp: range.CidrIp,
                    description: range.Description || ''
                  });
                }
              });
            }
          });
        }
        res.status(200).json({
          success: true,
          data: {
            name: securityGroup.GroupName,
            id: securityGroup.GroupId,
            description: securityGroup.Description || '',
            rules
          }
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: `Unable to load security group ID \`${req.params.groupId}\`.`
      });
    });
});

// Get full list of basic "quickstart" AMIs
// eg. http://localhost:8081/amis/quickstart
apiApp.get('/amis/quickstart', (req, res) => {
  res.status(200).json({
    success: true,
    numResults: quickstartAmis.length,
    data: quickstartAmis
  });
});

// Get AMIs that match a fuzzy search query, with optional pagination
// eg. http://localhost:8081/amis/search/windows%20server?offset=0&limit=10
apiApp.get('/amis/search/:searchQuery', (req, res) => {
  let results = fuseSearcher.search(req.params.searchQuery);
  const origResultsLength = results.length;

  // If `limit` and `offset` are specified for pagination, paginate
  if (req.query.offset !== undefined && req.query.limit !== undefined) {
    results = results.splice(+req.query.offset, +req.query.limit);
    res.status(200).json({
      success: true,
      numResults: origResultsLength,
      offset: +req.query.offset,
      limit: results.length,
      data: results
    });
  }
  // Show up to 100 results if no pagination query params specified
  else {
    results = results.splice(0, 100);
    res.status(200).json({
      success: true,
      numResults: origResultsLength,
      offset: 0,
      limit: results.length,
      data: results
    });
  }
});

// Get list of key pairs
// eg. http://localhost:8081/keyPairs
apiApp.get('/keyPairs', (req, res) => {
  ec2
    .describeKeyPairs()
    .promise()
    .then(data => {
      res.status(200).json({
        success: true,
        data: data.KeyPairs ? data.KeyPairs.map(x => x.KeyName) : []
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: `Unable to load key pairs.`
      });
    });
});

// Launch an instance
apiApp.post('/launchInstance', async (req, res) => {
  const { body } = req;
  try {
    // Get the default VPC ID
    const vpcsData = await ec2.describeVpcs().promise();
    if (!vpcsData || !vpcsData.Vpcs || !vpcsData.Vpcs[0] || !vpcsData.Vpcs[0].VpcId) throw new Error('Unable to get default VPC ID.');
    const defaultVpcId = vpcsData.Vpcs[0].VpcId;

    // Create the security group and get its ID
    const securityGroup = await ec2
      .createSecurityGroup({
        DryRun: true,
        GroupName: body.securityGroup.name,
        Description: body.securityGroup.description,
        VpcId: defaultVpcId
      })
      .promise();
    if (!securityGroup || !securityGroup.GroupId) throw new Error('Unable to get new security group ID.');
    const securityGroupId = securityGroup.GroupId;

    // Authorize ingress (i.e. add the new inbound rules to the security group)
    if (body.securityGroup.rules && body.securityGroup.rules.length > 0) {
      const invertedIcmpTypesLookupTable = invertKeyValObj(icmpTypesLookupTable);
      // Map rules to specific format required
      const ipPermissions = body.securityGroup.rules.map(rule => {
        const output = {
          IpProtocol: rule.protocol,
          IpRanges: [{ CidrIp: rule.cidrIp, Description: rule.description || '' }]
        };
        if (rule.protocol === 'tcp' || rule.protocol === 'udp') {
          const rulePorts = rule.portRange.replace(/ /g, '').split('-');
          output.FromPort = +rulePorts[0];
          output.ToPort = +(rulePorts[1] !== undefined ? rulePorts[1] : rulePorts[0]);
        } else if (rule.protocol === 'icmp') {
          output.FromPort = +invertedIcmpTypesLookupTable[rule.icmpType];
          output.ToPort = -1;
        } else if (rule.protocol === 'all_traffic') {
          output.IpProtocol = '-1';
        }
        return output;
      });

      await ec2
        .authorizeSecurityGroupIngress({
          GroupId: securityGroupId,
          IpPermissions: ipPermissions
        })
        .promise();
    }

    // Gather all the required instance launch parameters
    const instanceLaunchParams = {
      ImageId: body.imageId,
      InstanceType: body.instanceType,
      KeyName: body.keypairName,
      TagSpecifications: [],
      SecurityGroupIds: [securityGroupId],
      MaxCount: 1,
      MinCount: 1
    };

    // Include any volumes
    if (body.volumes !== undefined && body.volumes.length > 0) {
      instanceLaunchParams.BlockDeviceMappings = body.volumes.map(volume => ({
        DeviceName: volume.deviceName,
        Ebs: {
          VolumeSize: volume.size,
          DeleteOnTermination: volume.deleteOnTermination !== undefined ? volume.deleteOnTermination : true
        }
      }));
    }

    // Include any instance/volume tags
    if (body.instanceTags !== undefined && body.instanceTags.length > 0) {
      instanceLaunchParams.TagSpecifications.push({
        ResourceType: 'instance',
        Tags: body.instanceTags.map(tag => ({ Key: tag.key, Value: tag.value }))
      });
    }
    if (body.volumeTags !== undefined && body.volumeTags.length > 0) {
      instanceLaunchParams.TagSpecifications.push({
        ResourceType: 'volume',
        Tags: body.volumeTags.map(tag => ({ Key: tag.key, Value: tag.value }))
      });
    }

    // Launch the instance
    await ec2.runInstances(instanceLaunchParams).promise();

    res.status(200).json({
      success: true
    });
  } catch (err) {
    process.stdout.write('An error occured whilst launching an instance:\n');
    process.stdout.write(JSON.stringify(err || null));
    res.status(500).json({
      success: false,
      message: 'Unable to launch instance.',
      err
    });
  }
});

// Get detailed list of all instance types, pre-generated by the collector script
// eg. http://localhost:8081/instanceTypesDetailed
apiApp.get('/instanceTypesDetailed', (req, res) => {
  const instanceTypesDetailed = JSON.parse(fs.readFileSync('src/static/instance-types.json', 'utf8')).instanceTypes;
  // Sort from lowest to highest hourly price
  sort(instanceTypesDetailed).asc(x => +x.onDemandHourlyPrice.value);
  res.status(200).json({
    success: true,
    numResults: instanceTypesDetailed.length,
    data: instanceTypesDetailed
  });
});

// Get list of all raw instance types; used by the collector script
// eg. http://localhost:8081/instanceTypes
apiApp.get('/instanceTypes', (req, res) => {
  getAllAttributeValues('AmazonEC2', 'instanceType')
    .then(data => {
      res.status(200).json({
        success: true,
        numResults: data.length,
        data: data.map(x => x.Value)
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: `Unable to get instance types.`
      });
    });
});

// Get data on a particular instance type; used by the collector script
// eg. http://localhost:8081/instanceTypes/t3.nano
apiApp.get('/instanceTypes/:instanceType', (req, res) => {
  // See https://stackoverflow.com/questions/47441719/what-does-runinstancessv00-under-lineitem-operation-mean-in-aws-billing-report
  getAllProducts('AmazonEC2', {
    instanceType: req.params.instanceType,
    location: 'EU (London)',
    capacitystatus: 'Used',
    operation: 'RunInstances'
    // operatingSystem: 'Linux'
  })
    .then(data => {
      res.status(200).json({
        success: true,
        data: data || []
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: `Unable to get instance type \`${req.params.instanceType}\`.`
      });
    });
});

// Status page
apiApp.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Open API server
apiApp.listen(serverPort, '0.0.0.0', err => {
  if (err) throw err;

  process.stdout.write(`API server listening on port ${serverPort}.\n`);
});
