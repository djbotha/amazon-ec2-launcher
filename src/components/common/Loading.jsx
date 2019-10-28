import React from 'react';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const Centered = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  text-align: center;

  div {
    margin-right: 1rem;
  }
`;

function Loading() {
  return (
    <Centered>
      <div>Loading...</div>
      <CircularProgress />
    </Centered>
  );
}
export default Loading;
