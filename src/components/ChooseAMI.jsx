import React, { useEffect, useState } from 'react';
import { FormControlLabel, Box, Grid, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { debounce } from 'lodash';
import Pagination from 'material-ui-flat-pagination';

import useAPI from '../hooks/useAPI';
import AMITile from './AMITile';
import Loading from './common/Loading';

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
  },
  pagination: {
    width: '100%',
    textAlign: 'center',
    margin: '0 auto 1rem'
  }
}));

export default function ChooseAMI() {
  const [pagination, setPagination] = useState({
    limit: 9,
    offset: 0,
    freeTierOnly: false
  });
  const [amis, setAmis] = useState([]);
  const [{ data: quickstartData }, refetchQuickstart] = useAPI('/amis/quickstart');
  const [{ data: searchedData, loading }, refetch] = useAPI(
    {
      url: '/amis/search',
      method: 'GET'
    },
    { manual: true }
  );

  const [numResults, setNumResults] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [search, setSearch] = useState('');
  const classes = useStyles();

  const handleExpand = e => {
    setExpandAll(e.target.checked);
  };

  const handleFreeTier = e => {
    setPagination({ ...pagination, freeTierOnly: e.target.checked });
  };

  useEffect(
    debounce(
      () => {
        if (pagination.freeTierOnly && search.trim() === '') {
          refetchQuickstart({
            url: `/amis/quickstart`,
            params: pagination
          });
          return;
        }

        if (search.trim() === '' && quickstartData && quickstartData.data) {
          setAmis(quickstartData.data);
          setNumResults(quickstartData.data.length);
          return;
        }

        if (search.trim() !== '') {
          refetch({
            url: `/amis/search/${search}`,
            params: pagination
          });
        }
      },
      200,
      { maxWait: 300 }
    ),
    [search, pagination]
  );

  useEffect(() => {
    if (searchedData && searchedData.data) {
      setAmis(searchedData.data);
      setNumResults(searchedData.numResults);
    } else if (quickstartData && quickstartData.data) {
      setAmis(quickstartData.data);
      setNumResults(quickstartData.data.length);
    }
  }, [quickstartData, search, searchedData]);

  return (
    <Box width="100%">
      <p>
        An AMI is a template that contains the software configuration (operating system, application server, and applications) required to launch your instance. You can select an
        AMI provided by AWS, our user community, or the AWS Marketplace; or you can select one of your own AMIs.
      </p>
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
        control={<Switch checked={pagination.freeTierOnly} onChange={handleFreeTier} value="freeTierOnly" inputProps={{ 'aria-label': 'secondary checkbox' }} />}
        label="Free Tier Only"
      />

      {amis.length > 0 && (
        <Pagination
          className={classes.pagination}
          reduced
          limit={pagination.limit}
          offset={pagination.offset}
          total={Math.ceil(numResults / pagination.limit)}
          onClick={(e, offset) => setPagination({ ...pagination, offset })}
        />
      )}
      {amis.length === 0 && <div className={classes.pagination}>No matches found.</div>}
      {loading && <Loading />}
      <Grid container>
        {amis.map(ami => (
          <Grid item xs={4} key={ami.imageId}>
            <AMITile ami={ami} expandAll={expandAll} />
          </Grid>
        ))}
      </Grid>
      {amis.length > 0 && (
        <Pagination
          className={classes.pagination}
          reduced
          limit={pagination.limit}
          offset={pagination.offset}
          total={Math.ceil(numResults / pagination.limit)}
          onClick={(e, offset) => setPagination({ ...pagination, offset })}
        />
      )}
    </Box>
  );
}
