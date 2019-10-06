require('dotenv').config();
const next = require('next');
const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const clientPort = 8080;
const serverPort = 8081;

process.stdout.write('Starting EC2 Launch Wizard...\n');

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

const pricing = new AWS.Pricing({ region: 'us-east-1' }); // Pricing available at 'us-east-1', not 'eu-west-2'.

// Recursively retrieve all pages of products
function getAllProducts(service, filters = [], _nextToken) {
  const pricingFilters = Object.keys(filters).map(f => {
    return { Field: f, Type: 'TERM_MATCH', Value: filters[f] };
  });
  let allProducts = [];

  return new Promise(resolve => {
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
      });
  });
}

// Recursively retrieve all pages of attribute values
function getAllAttributeValues(serviceCode, attributeName, _nextToken) {
  let allAttributeValues = [];
  return new Promise(resolve => {
    pricing
      .getAttributeValues({ ServiceCode: serviceCode, AttributeName: attributeName, NextToken: _nextToken })
      .promise()
      .then(data => {
        allAttributeValues = allAttributeValues.concat(data.AttributeValues);

        if (data.NextToken) {
          getAllAttributeValues(serviceCode, attributeName, data.NextToken).then(dataRec => resolve(dataRec));
        } else {
          resolve(allAttributeValues);
        }
      });
  });
}

// Get list of all raw instance types
// eg. http://localhost:8081/instanceTypes
apiApp.get('/instanceTypes', (req, res) => {
  getAllAttributeValues('AmazonEC2', 'instanceType')
    .then(data => {
      const instanceTypes = [];
      data.forEach(x => instanceTypes.push(x.Value));
      res.status(200).json({
        instanceTypes
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Get data on a particular instance type
// eg. http://localhost:8081/instanceTypes/t3.nano
apiApp.get('/instanceTypes/:instanceType', (req, res) => {
  getAllProducts('AmazonEC2', {
    instanceType: req.params.instanceType,
    location: 'EU (London)',
    capacitystatus: 'Used',
    operation: 'RunInstances' // https://stackoverflow.com/questions/47441719/what-does-runinstancessv00-under-lineitem-operation-mean-in-aws-billing-report
    // operatingSystem: 'Linux'
  })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Get list of all locations
// eg. http://localhost:8081/locations
apiApp.get('/locations', (req, res) => {
  getAllAttributeValues('AmazonEC2', 'location')
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Get details for a specific service
// eg. http://localhost:8081/services/AmazonEC2
apiApp.get('/services/:service', (req, res) => {
  pricing
    .describeServices({ ServiceCode: req.params.service })
    .promise()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// retrieve products for a specific service
// eg. http://localhost:8081/services/AmazonEC2/products?location=EU%20(London)&instanceType=t3.nano
apiApp.get('/services/:service/products', (req, res) => {
  getAllProducts(req.params.service, req.query)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// retrieve a list of acceptable values for a specific service and attribute
// eg. http://localhost:8081/services/AmazonEC2/attributeValues/location
apiApp.get('/services/:service/attributeValues/:attribute', (req, res) => {
  getAllAttributeValues(req.params.service, req.params.attribute)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// status
apiApp.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

// Open API server
apiApp.listen(serverPort, '0.0.0.0', err => {
  if (err) throw err;

  process.stdout.write(`API server listening on port ${serverPort}.\n`);
});
