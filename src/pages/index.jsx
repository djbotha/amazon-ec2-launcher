import React from 'react';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import MyTabs from '../components/MyTabs';

const Padding = styled.div`
  padding: 2rem 0;
`;

export default function Index() {
  return (
    <Container maxWidth="lg">
      <Padding>
        <Typography variant="h3">Amazon EC2 launch wizard</Typography>
      </Padding>
      <MyTabs />
    </Container>
  );
}
