import React, { useEffect, useState } from 'react';
import { FormControlLabel, Box, Grid, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import useAPI from '../hooks/useAPI';
import AMITile from './AMITile';

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
    marginTop: theme.spacing(1)
  },
  menu: {
    width: 200
  }
}));

export default function ChooseAMI() {
  const [amis, setAmis] = useState([]);
  const [{ data: quickstartData }] = useAPI('/amis/quickstart');
  const [{ data: searchedData }, refetch] = useAPI(
    {
      url: '/amis/search',
      method: 'GET'
    },
    { manual: true }
  );

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

  const searchForAMIs = e => {
    e.preventDefault();

    if (search.trim() === '') {
      return;
    }

    refetch({
      url: `http://localhost:8081/amis/search/${search}`,
      params: {
        limit: 10,
        offset: 0
      }
    });
  };

  useEffect(() => {
    if (searchedData && searchedData.data && search.trim() !== '') {
      setAmis(searchedData.data);
    } else if (quickstartData && quickstartData.data) {
      setAmis(quickstartData.data);
    }
  }, [quickstartData, search, searchedData]);
  return (
    <Box width="100%">
      <form className={classes.container} noValidate autoComplete="off">
        <form onSubmit={searchForAMIs}>
          <TextField
            id="outlined-search"
            label="Search for AMI"
            type="search"
            className={classes.textField}
            margin="normal"
            value={search}
            variant="outlined"
            onChange={e => setSearch(e.target.value)}
          />
        </form>
      </form>
      <FormControlLabel control={<Switch checked={expandAll} onChange={handleExpand} value="expandAll" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Expand All" />
      <FormControlLabel
        control={<Switch checked={freeTierOnly} onChange={handleFreeTier} value="freeTierOnly" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
        label="Free Tier Only"
      />
      <Grid container spacing={3}>
        {amis.map(ami => (
          <Grid item xs={4} key={ami.imageId}>
            <AMITile ami={ami} expandAll={expandAll} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
