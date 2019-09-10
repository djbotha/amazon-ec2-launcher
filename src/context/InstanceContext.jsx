import React, { createContext, useContext, useReducer } from 'react';

const InstanceContext = createContext();

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

function InstanceProvider(props) {
  const [state, dispatch] = useReducer(reducer, {});
  return <InstanceContext.Provider value={{ state, dispatch }} {...props} />;
}

function useInstance() {
  const context = useContext(InstanceContext);
  if (context === undefined) {
    throw Error(`useInstance must be used within a InstanceProvider`);
  }
  return context;
}

export { InstanceProvider, useInstance };
