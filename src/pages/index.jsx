import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import Link from '../components/Link';

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Title>Home Page Title with styled-components</Title>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js v4-beta example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
      </Box>
    </Container>
  );
}
