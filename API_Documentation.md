# API Gateway Documentation, Amazon EC2 Launch Wizard

We have designed our own API gateway server which is used by the React client and communicates via the AWS SDK.
The server is written in Node.js and runs on port 8081, in parallel with the React app on port 8080.

As described in the [README](README.md), an IAM user with appropriate roles is required to use the AWS APIs for the Launch Wizard.
We will use the user's access key and secret when making API requests.

## APIs

### List all instance types

#### Example request
List all instance types, with details on each: [http://localhost:8081/instanceTypesDetailed](http://localhost:8081/instanceTypesDetailed)

### List all Quickstart AMIs
Gets a list of common "quickstart" AMIs, to be shown by default in the AMI list without a search query.

#### Example
Request: [http://localhost:8081/amis/quickstart](http://localhost:8081/amis/quickstart)

Response (excerpt, 38 other results skipped):
```
{ 
    success:true,
    numResults:39,
    results:[ 
        { 
            name:"amzn2-ami-hvm-2.0.20190823.1-x86_64-gp2",
            imageId:"ami-00a1270ce1e007c27",
            description:"Amazon Linux 2 AMI 2.0.20190823.1 x86_64 HVM gp2",
            freeTier:true,
            architecture:"x86_64",
            platform:"Amazon Linux",
            rootDeviceType:"ebs",
            rootDeviceName:"/dev/xvda",
            virtualizationType:"hvm",
            enaSupport:true,
            imageOwnerAlias:"amazon",
            imageLocation:"amazon/amzn2-ami-hvm-2.0.20190823.1-x86_64-gp2"
        },
        <38 others skipped>
    ]
}
```

### Search AMIs
Returns AMIs for a particular search query. A fuzzy search takes place on the AMI name, description and ID fields, and pagination can be used by specifying `offset` and `limit` query parameters.

#### Examples
- List all AMIs with search query `ubuntu 18.04` (Note the URL encoding!): [http://localhost:8081/amis/search/ubuntu%2018.04](http://localhost:8081/amis/search/ubuntu%2018.04)
- List first `10` AMIs with search query `windows server`: [http://localhost:8081/amis/search/windows%20server?offset=0&limit=10](http://localhost:8081/amis/search/windows%20server?offset=0&limit=10)
- List `50` AMIs with search query `windows server`, starting at index `100`: [http://localhost:8081/amis/search/windows%20server?offset=100&limit=50](http://localhost:8081/amis/search/windows%20server?offset=100&limit=50)


Sample response from `http://localhost:8081/amis/search/ubuntu?offset=0&limit=2`:
```
{ 
    success:true,
    numResults:8831,
    offset:0,
    limit:2,
    results:[ 
        { 
            name:"ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-20191002",
            imageId:"ami-0be057a22c63962cb",
            description:"Canonical, Ubuntu, 18.04 LTS, amd64 bionic image build on 2019-10-02",
            freeTier:true,
            architecture:"x86_64",
            platform:"Ubuntu",
            rootDeviceType:"ebs",
            rootDeviceName:"/dev/sda1",
            virtualizationType:"hvm",
            enaSupport:true,
            imageLocation:"099720109477/ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-20191002"
        },
        { 
            name:"ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-20190913",
            imageId:"ami-0fab23d0250b9a47e",
            description:"Canonical, Ubuntu, 16.04 LTS, amd64 xenial image build on 2019-09-13",
            freeTier:true,
            architecture:"x86_64",
            platform:"Ubuntu",
            rootDeviceType:"ebs",
            rootDeviceName:"/dev/sda1",
            virtualizationType:"hvm",
            enaSupport:true,
            imageLocation:"099720109477/ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-20190913"
        }
    ]
}
```

### List all security groups
Gets a list of existing security groups along with basic information.

#### Example
Request: [http://localhost:8081/securityGroups](http://localhost:8081/securityGroups)

Response:
```
{ 
    success:true,
    securityGroups:[ 
        { 
            name:"ec2-launch-wizard",
            id:"sg-01801d64d07ad5547",
            description:"EC2 Launch Wizard university project"
        },
        { 
            name:"ec2-test-group",
            id:"sg-08517873a6232f4fa",
            description:"Launch wizard advanced test group"
        },
        { 
            name:"default",
            id:"sg-813b4ae8",
            description:"default VPC security group"
        },
        { 
            name:"launch-wizard-1",
            id:"sg-bffbbbd6",
            description:"launch-wizard-1 created 2017-07-07T13:30:35.850+02:00"
        }
    ]
}
```

### Get security group details
Gets get detailed information on a specific security group ID, including all the rules associated with it.

#### Specifications for security group rules:
Fields available for each rule in a security group:
- `protocol`: Either `tcp`, `udp`, `icmp`, or `all_traffic`. If the protocol is `all_traffic`, the fields `portRange` and `icmpType` are not provided as they are redundant.
- `cidrIp`: The IP range to allow connections from, in CIDR notation. The range `0.0.0.0/0` allows all inbound connections, and ranges ending with `/32` specify a single IP address.
- `portRange`: Present if protocol is TCP or UDP. It contains either a single port or two ports separated by a single hyphen. Examples: `80`, `443`, `80-81`, `8000-9000`.
- `icmpType`: Present if protocol is ICMP. It contains the name of the ICMP message type as defined in [RFC1700](https://tools.ietf.org/html/rfc1700). We support the following subset at present:
   - `Echo reply`
   - `Destination unreachable`
   - `Source quench`
   - `Redirect`
   - `Echo`
   - `Router advertisement`
   - `Router selection`
   - `Time exceeded`
   - `Parameter problem`
   - `Timestamp`
   - `Timestamp reply`
   - `Information request`
   - `Information reply`
   - `Address mask request`
   - `Address mask reply`
   - `Traceroute`

#### Example
Request to get further info and rules on a security group with ID `sg-08517873a6232f4fa`:
[http://localhost:8081/securityGroups/sg-08517873a6232f4fa](http://localhost:8081/securityGroups/sg-08517873a6232f4fa)

Response:
```
{ 
    success:true,
    securityGroup:{ 
        name:"ec2-test-group",
        id:"sg-08517873a6232f4fa",
        description:"Launch wizard advanced test group",
        rules:[ 
            { 
                protocol:"tcp",
                portRange:"80-84",
                cidrIp:"0.0.0.0/0",
                description:"HTTP on ports 80 to 84 open to the world"
            },
            { 
                protocol:"udp",
                portRange:"25565",
                cidrIp:"41.185.60.57/32",
                description:"Minecraft server open only to a single IP"
            },
            { 
                protocol:"tcp",
                portRange:"443",
                cidrIp:"0.0.0.0/0",
                description:"HTTPS"
            },
            { 
                protocol:"icmp",
                icmpType:"Echo",
                cidrIp:"0.0.0.0/0",
                description:"ICMP Echo test"
            },
            { 
                protocol:"icmp",
                icmpType:"Destination unreachable",
                cidrIp:"0.0.0.0/0",
                description:"ICMP Destination unreachable test"
            },
            { 
                protocol:"icmp",
                icmpType:"Echo reply",
                cidrIp:"0.0.0.0/0",
                description:"ICMP Echo Reply test"
            },
            { 
                protocol:"all_traffic",
                cidrIp:"0.0.0.0/0",
                description:"Allow all traffic from everyone"
            }
        ]
    }
}
```