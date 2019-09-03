import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AMITile from './AMITile';

export default function ChooseAMI() {
  return (
    <Box>
      <Typography>Here you choose your AMI</Typography>
      <AMITile />
    </Box>
  );
}
