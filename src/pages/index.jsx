import React from 'react';
import Container from '@material-ui/core/Container';

import Nav from '../components/Nav';
import { InstanceProvider } from '../context/InstanceContext';
import MyTabs from '../components/MyTabs';

export default function Index() {
  return (
    <InstanceProvider>
      <Nav />
      <Container maxWidth="lg">
        <MyTabs />
      </Container>
    </InstanceProvider>
  );
}
