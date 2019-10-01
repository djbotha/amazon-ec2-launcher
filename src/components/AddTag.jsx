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
import { Checkbox } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
}));

export default function AddTag() {
  const [key, setKey] = useState('');
  const [val, setVal] = useState('');
  const [tags, setTags] = useState([]);
  const classes = useStyles();

  const updateTag = e => {
    setKey(e.target.value);
  };

  const updateVal = e => {
    setVal(e.target.value);
  };

  function showTag() {
    setTags([...tags, { id: tags.length, key, val }]);
    setKey('');
    setVal('');
  }
  function removeTag() {
    setTags(tags.slice(0, tags.length - 1));
  }

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <form noValidate autoComplete="off">
                <TextField id="outlined-search" label="Key" type="search" className={classes.textField} margin="normal" value={key} variant="outlined" onChange={updateTag} />
              </form>
            </TableCell>
            <TableCell>
              <form noValidate autoComplete="off">
                <TextField id="outlined-search" label="Value" type="search" className={classes.textField} margin="normal" value={val} variant="outlined" onChange={updateVal} />
              </form>
            </TableCell>
            <TableCell>
              <Button variant="contained" className={classes.button} onClick={showTag}>
                Add Tag
              </Button>
            </TableCell>
            <TableCell>
              <Button variant="contained" className={classes.button} onClick={removeTag}>
                Delete Tag
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Instances</TableCell>
            <TableCell align="right">Volumes</TableCell>
          </TableRow>
          {tags.map(tag => (
            <TableRow key={tag.id}>
              <TableCell>
                <Typography>{tag.key}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">{tag.val}</Typography>
              </TableCell>
              <TableCell align="right">
                <Checkbox />
              </TableCell>
              <TableCell align="right">
                <Checkbox />
              </TableCell>
            </TableRow>
          ))}
        </TableHead>
        <TableBody />
      </Table>
    </Box>
  );
}
