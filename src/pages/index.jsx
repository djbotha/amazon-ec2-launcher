import React from 'react';

import Container from '@material-ui/core/Container';

import styled from 'styled-components';

import MyTabs from '../components/MyTabs';

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

export default function Index() {
  return (
    <Container maxWidth="lg">
      <Title>Amazon EC2 launch wizard</Title>
      <MyTabs />
    </Container>
  );
}
