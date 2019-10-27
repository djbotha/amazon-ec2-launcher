# API Gateway Documentation, Amazon EC2 Launch Wizard

We have designed our own API gateway server which is used by the React client and communicates via the AWS SDK.
The server is written in Node.js and runs on port 8081, in parallel with the React app on port 8080.

As described in the [README](README.md), an IAM user with appropriate roles is required to use the AWS APIs for the Launch Wizard.
The server makes use of the IAM user's access key and secret when making AWS API requests.

## APIs

### List all instance types

GET `/instanceTypesDetailed`

Lists all instance types, providing detailed information on each one including pricing.
Instance types are sorted by On Demand hourly price, from lowest to highest.

#### Example

Request: [http://localhost:8081/instanceTypesDetailed](http://localhost:8081/instanceTypesDetailed)

Response (excerpt, 133 others skipped):
```
{ 
    success:true,
    numResults:134,
    data:[ 
        { 
            instanceType:"t3a.nano",
            family:"Compute Instance",
            ecu:"Variable",
            vcpu:"2",
            physicalProcessor:"AMD EPYC 7571",
            memory:"0.5 GiB",
            storage:"EBS only",
            networkPerformance:"Low",
            processorArchitecture:"64-bit",
            onDemandHourlyPrice:{ 
                currency:"USD",
                value:"0.0053000000"
            }
        },
        <133 others skipped>
    ]
}
```

### List all Quickstart AMIs

GET `/amis/quickstart`

Gets a list of common "quickstart" AMIs, to be shown by default in the AMI list without a search query.

#### Example

Request: [http://localhost:8081/amis/quickstart](http://localhost:8081/amis/quickstart)

Response (excerpt, 38 other results skipped):
```
{ 
    success:true,
    numResults:39,
    data:[ 
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

GET `/amis/search/<SEARCHTERM>?offset=<OFFSET>&limit=<LIMIT>`

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
    data:[ 
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

GET `/securityGroups`

Gets a list of existing security groups along with basic information.

#### Example

Request: [http://localhost:8081/securityGroups](http://localhost:8081/securityGroups)

Response:
```
{ 
    success:true,
    data:[ 
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

### Get specific security group details

GET `/securityGroups/<GROUP_ID>`

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
    data:{ 
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

### List all key pairs

GET `/keyPairs`

Lists all of the user's key pair names, where one needs to be selected when launching an instance.

#### Example

Request: [http://localhost:8081/keyPairs](http://localhost:8081/keyPairs)

Response:
```
{ 
    success:true,
    data:[ 
        "Test_keypair",
        "EC2_keypair"
    ]
}
```

### Launch an instance

POST `/launchInstance` with JSON POST body sent as `application/json`.

Launches an instance, along with creating its security group and adding specified tags.

The security group is specified in exactly the same format as security groups returned by our security group API,
but with the exclusion of the security group ID (as this will be generated automatically when the security group is created).

It is mandatory to specify all fields except `volumes`, `instanceTags`, `volumeTags`.

As specified by the AMI APIs, each AMI listing has a default device name (eg. `/dev/xvda`), used for the primary OS.
If a volume is specified in the `volumes` section with this device name, it will override the default 8GiB volume that is
created automatically. If no `volumes` are specified, this default 8GiB volume will be created and used and is deleted
on termination.

For each volume volume, the `type` field can be:
- `gp2` (General Purpose SSD, default)
- `standard` (Magnetic)
- `st1` (Throughput Optimized HDD)
- `sc1` (Cold HDD)

#### Example

Request: [http://localhost:8081/launchInstance](http://localhost:8081/launchInstance)
POST Body (`application/json`):
```
{
    "instanceType": "t2.micro",
    "imageId": "ami-00a1270ce1e007c27",
    "keypairName": "EC2_keypair",
    "securityGroup": {
        "name": "new-instance-security-group",
        "description": "Test of API",
        "rules": [
            {
                "protocol": "icmp",
                "icmpType": "Destination unreachable",
                "cidrIp": "0.0.0.0/0",
                "description": "ICMP Destination unreachable test"
            },
            {
                "protocol": "icmp",
                "icmpType": "Echo reply",
                "cidrIp": "0.0.0.0/0",
                "description": "ICMP Echo Reply test"
            },
            {
                "protocol": "all_traffic",
                "cidrIp": "0.0.0.0/0",
                "description": "Allow all traffic"
            },
            {
                "protocol": "udp",
                "portRange": "25565",
                "cidrIp": "3.9.1.19/32",
                "description": "Minecraft only for single IP"
            },
            {
                "protocol": "tcp",
                "portRange": "80-84",
                "cidrIp": "0.0.0.0/0",
                "description": "HTTP on ports 80 to 84 open to the world"
            },
            {
                "protocol": "tcp",
                "portRange": "443",
                "cidrIp": "0.0.0.0/0",
                "description": "HTTPS on port 443"
            },
            {
                "protocol": "icmp",
                "icmpType": "Echo",
                "cidrIp": "0.0.0.0/0",
                "description": "ICMP Echo Request test"
            }
        ]
    },
    "instanceTags": [
        {
            "key": "Name",
            "value": "joseph"
        },
        {
            "key": "Department",
            "value": "compsci"
        }
    ],
    "volumeTags": [
        {
            "key": "Category",
            "value": "general"
        },
        {
            "key": "Food",
            "value": "pizza"
        }
    ],
    "volumes": [
        {
            "deviceName": "/dev/xvda",
            "size": 12,
            "type": "gp2",
            "deleteOnTermination": true
        }
    ]
}
```

Response:
```
{ 
    success:true
}
```