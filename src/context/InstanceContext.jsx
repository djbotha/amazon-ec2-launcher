import React, { createContext, useContext, useReducer } from 'react';

const InstanceContext = createContext();

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

export { InstanceProvider, useInstance };
