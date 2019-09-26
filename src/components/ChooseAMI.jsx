import React, { useEffect, useState } from 'react';
import { FormControlLabel, Box, Grid, Switch } from '@material-ui/core';
import AMITile from './AMITile';

import AMIS from '../static/ami';
import Search from './Search';

export default function ChooseAMI() {
  const [amis, setAmis] = useState(AMIS);
  const [expandAll, setExpandAll] = useState(false);
  const [freeTierOnly, setFreeTierOnly] = useState(false);

  const handleExpand = e => {
    setExpandAll(e.target.checked);
  };

  const handleFreeTier = e => {
    setFreeTierOnly(e.target.checked);
  };

  useEffect(() => {
    setAmis(AMIS.filter(ami => (freeTierOnly ? ami.free && ami : ami)));
  }, [freeTierOnly]);

  return (
    <Box width="100%">
      <Search />
      <FormControlLabel control={<Switch checked={expandAll} onChange={handleExpand} value="expandAll" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Expand All" />
      <FormControlLabel
        control={<Switch checked={freeTierOnly} onChange={handleFreeTier} value="freeTierOnly" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
        label="Free Tier Only"
      />
      <Grid container spacing={3}>
        {amis.map(ami => (
          <Grid item xs={4} key={ami.id}>
            <AMITile ami={ami} expandAll={expandAll} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
