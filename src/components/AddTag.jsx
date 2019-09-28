import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
}));

export default function AddTag() {
  const [tag, setTag] = useState('');
  const classes = useStyles();

  const updateTag = e => {
    setTag(e.target.value);
    console.log(e.target.value);
  };

  return (
    <Box>
      <Typography>Here you can add tags</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Instances</TableCell>
            <TableCell align="right">Volumes</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <form className={classes.container} noValidate autoComplete="off">
                <TextField id="outlined-search" label="Add Tag" type="search" className={classes.textField} margin="normal" value={tag} variant="outlined" onChange={updateTag} />
              </form>
            </TableCell>
            <TableCell>
              <Button variant="contained" className={classes.button}>
                Add Tag
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>{tag}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    </Box>
  );
}
