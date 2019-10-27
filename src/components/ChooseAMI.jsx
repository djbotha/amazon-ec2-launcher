import React, { useEffect, useState } from 'react';
import { FormControlLabel, Box, Grid, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { debounce } from 'lodash';

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
  const [{ data: quickstartData }] = useAPI({
    url: '/amis/quickstart',
    params: {
      offset: 0,
      limit: 50
    }
  });
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

  useEffect(
    debounce(
      () => {
        if (search.trim() === '' && quickstartData && quickstartData.data) {
          setAmis(quickstartData.data);
          return;
        }

        if (search.trim() !== '') {
          refetch({
            url: `/amis/search/${search}`,
            params: {
              limit: 9,
              offset: 0
            }
          });
        }
      },
      200,
      { maxWait: 300 }
    ),
    [search]
  );

  useEffect(() => {
    if (searchedData && searchedData.data && search.trim() !== '') {
      setAmis(searchedData.data);
    } else if (quickstartData && quickstartData.data) {
      setAmis(quickstartData.data);
    }
  }, [quickstartData, search, searchedData]);

  return (
    <Box width="100%">
      <form className={classes.container} noValidate autoComplete="off" onSubmit={e => e.preventDefault()}>
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
      <FormControlLabel control={<Switch checked={expandAll} onChange={handleExpand} value="expandAll" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Expand All" />
      <FormControlLabel
        control={<Switch checked={freeTierOnly} onChange={handleFreeTier} value="freeTierOnly" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
        label="Free Tier Only"
      />
      <Grid container>
        {amis.map(ami => (
          <Grid item xs={4} key={ami.imageId}>
            <AMITile ami={ami} expandAll={expandAll} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
