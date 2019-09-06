import React, { useState } from 'react';
import { Box, Grid, Switch } from '@material-ui/core';
import AMITile from './AMITile';

import AMIS from '../static/ami';

export default function ChooseAMI() {
  const [expandAll, setExpandAll] = useState(false);

  const handleExpand = e => {
    setExpandAll(e.target.checked);
  };

  return (
    <Box>
      <Switch checked={expandAll} onChange={handleExpand} value="expandAll" inputProps={{ 'aria-label': 'secondary checkbox' }} />
      <Grid container spacing={3}>
        {AMIS.map(ami => (
          <Grid item xs={4}>
            <AMITile ami={ami} expandAll={expandAll} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
