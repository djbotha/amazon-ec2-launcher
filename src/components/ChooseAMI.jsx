import React, { useEffect, useState } from 'react';
import { FormControlLabel, Box, Grid, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import AMITile from './AMITile';

import AMIS from '../static/ami';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  }
}));

export default function ChooseAMI() {
  const [amis, setAmis] = useState(AMIS);
  const [expandAll, setExpandAll] = useState(false);
  const [freeTierOnly, setFreeTierOnly] = useState(false);
  const [search, setSearch] = useState('');
  const classes = useStyles();

  const handleExpand = e => {
    setExpandAll(e.target.checked);
  };

  const handleFreeTier = e => {
    setFreeTierOnly(e.target.checked);
  };

  useEffect(() => {
    setAmis(AMIS.filter(ami => (freeTierOnly ? ami.free && ami : ami) && ami.title.indexOf(search) !== -1));
  }, [freeTierOnly, search]);

  const filterAMIs = e => {
    setSearch(e.target.value);
  };

  return (
    <Box width="100%">
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="outlined-search"
          label="Search for AMI"
          type="search"
          className={classes.textField}
          margin="normal"
          value={search}
          variant="outlined"
          onChange={filterAMIs}
        />
      </form>
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
