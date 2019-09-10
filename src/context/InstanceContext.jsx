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
      const { ami } = action.payload;
      const newState = {
        ...state,
        ami
      };
      console.log(newState);
      return newState;
    }
    default:
      return state;
  }
}

/**
 * Middelware for InstanceContext.Provider in order to inject reducer state and dispatch
 *
 * @param {object} props Additional props that are passed to this funciton
 */
function InstanceProvider(props) {
  const [state, dispatch] = useReducer(reducer, {});
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
