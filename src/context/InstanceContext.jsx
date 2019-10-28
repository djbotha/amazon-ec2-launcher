import React, { createContext, useContext, useReducer } from 'react';

const InstanceContext = createContext();

// eslint-disable-next-line
const defaultState = {
  instanceType: 't2.micro',
  imageId: 'ami-00a1270ce1e007c27',
  keypairName: 'EC2_keypair',
  securityGroup: {
    name: 'new-instance-security-group',
    description: 'Test of API',
    rules: [
      {
        protocol: 'icmp',
        icmpType: 'Destination unreachable',
        cidrIp: '0.0.0.0/0',
        description: 'ICMP Destination unreachable test'
      },
      {
        protocol: 'icmp',
        icmpType: 'Echo reply',
        cidrIp: '0.0.0.0/0',
        description: 'ICMP Echo Reply test'
      },
      {
        protocol: 'all_traffic',
        cidrIp: '0.0.0.0/0',
        description: 'Allow all traffic'
      },
      {
        protocol: 'udp',
        portRange: '25565',
        cidrIp: '3.9.1.19/32',
        description: 'Minecraft only for single IP'
      },
      {
        protocol: 'tcp',
        portRange: '80-84',
        cidrIp: '0.0.0.0/0',
        description: 'HTTP on ports 80 to 84 open to the world'
      },
      {
        protocol: 'tcp',
        portRange: '443',
        cidrIp: '0.0.0.0/0',
        description: 'HTTPS on port 443'
      },
      {
        protocol: 'icmp',
        icmpType: 'Echo',
        cidrIp: '0.0.0.0/0',
        description: 'ICMP Echo Request test'
      }
    ]
  },
  instanceTags: [
    {
      key: 'Name',
      value: 'joseph'
    },
    {
      key: 'Department',
      value: 'compsci'
    }
  ],
  volumeTags: [
    {
      key: 'Category',
      value: 'general'
    },
    {
      key: 'Food',
      value: 'pizza'
    }
  ],
  volumes: [
    {
      deviceName: '/dev/xvda',
      size: 12,
      type: 'gp2',
      deleteOnTermination: true
    }
  ]
};

const Titles = {
  imageId: 'Image ID',
  instanceType: 'Instance Type',
  keypairName: 'Key Pair',
  securityGroup: 'Security Group',
  instanceTags: 'Instance Tags',
  volumeTags: 'Volume Tags',
  volumes: 'Volumes'
};

const Fields = {
  instanceType: '',
  imageId: '',
  keypairName: '',
  securityGroup: ['name', 'description'],
  instanceTags: ['key', 'value'],
  volumeTags: ['key', 'value'],
  volumes: ['deviceName', 'size', 'type', 'deleteOnTermination']
};

/**
 * Reducer function used to update our state
 *
 * @param {object} state our current state
 * @param {object} action contains 1. the type of action to execute, and 2. the payload to add to state.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'AMI': {
      const { imageId } = action.payload;
      const newState = {
        ...state,
        imageId
      };
      console.log(newState);
      return newState;
    }
    case 'INSTANCE_TYPE': {
      const { instanceType } = action.payload;
      return {
        ...state,
        instanceType
      };
    }
    case 'KEY_PAIR': {
      const { keypairName } = action.payload;
      return {
        ...state,
        keypairName
      };
    }
    case 'SECURITY_GROUP': {
      const { securityGroup } = action.payload;
      const newState = {
        ...state,
        securityGroup
      };
      console.log(newState);
      return newState;
    }
    case 'INSTANCE_TAGS': {
      const { instanceTags } = action.payload;
      return {
        ...state,
        instanceTags
      };
    }
    case 'VOLUME_TAGS': {
      const { volumeTags } = action.payload;
      return {
        ...state,
        volumeTags
      };
    }
    case 'VOLUMES': {
      const { volumes } = action.payload;
      return {
        ...state,
        volumes
      };
    }
    case 'REMOVE': {
      const { key } = action.payload;
      const newState = state;
      delete newState[key];
      return {
        ...newState
      };
    }
    default:
      return state;
  }
}

/**
 * Middleware for InstanceContext.Provider in order to inject reducer state and dispatch
 *
 * @param {object} props Additional props that are passed to this funciton
 */
function InstanceProvider(props) {
  const [state, dispatch] = useReducer(reducer, {}); // Our default selected values go in this empty object in the second parameter.
  return <InstanceContext.Provider value={{ state, dispatch }} {...props} />;
}

/**
 * Helper Hook to check if our context is null. This makes it easier to call `useContext` where we need it.
 */
function useInstance() {
  const context = useContext(InstanceContext);
  if (context === undefined) {
    throw Error(`useInstance must be used within a InstanceProvider`);
  }
  return context;
}

export { Titles, Fields, InstanceProvider, useInstance };
