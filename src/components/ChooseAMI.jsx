import React, { useState } from 'react';
import { FormControlLabel, Box, Grid, Switch } from '@material-ui/core';
import AMITile from './AMITile';

import AMIS from '../static/ami';

export default function ChooseAMI() {
  const [expandAll, setExpandAll] = useState(false);

  const handleExpand = e => {
    setExpandAll(e.target.checked);
  };

  return (
    <Box>
      <FormControlLabel control={<Switch checked={expandAll} onChange={handleExpand} value="expandAll" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Expand All" />
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
