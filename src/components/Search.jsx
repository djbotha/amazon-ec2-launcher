import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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

export default function Search() {
  const [amis, setAmis] = useState(AMIS);
  const [search, setSearch] = useState('');
  const classes = useStyles();

  const filterAMIs = e => {
    setSearch(e.target.value);
    console.log(search);
    const filtered = AMIS.filter(ami => {
      return ami.title.indexOf(e.target.value) !== -1;
    });

    setAmis(filtered);
    console.log(filtered);
    console.log(amis);
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField id="outlined-search" label="Search for AMI" type="search" className={classes.textField} margin="normal" value={search} variant="outlined" onChange={filterAMIs} />
    </form>
  );
}
