import React from 'react';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import MyTabs from '../components/MyTabs';

const Padding = styled(Typography)({ padding: '2rem 0' });

export default function Index() {
  return (
    <Container maxWidth="lg">
      <Padding variant="h3">Amazon EC2 launch wizard</Padding>
      <MyTabs />
    </Container>
  );
}
