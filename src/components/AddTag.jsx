import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { useInstance } from '../context/InstanceContext';

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
  },
  fullWidth: {
    width: '100%'
  }
}));

const blankTag = () => ({
  key: '',
  value: '',
  instance: false,
  volume: false
});

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  * {
    flex: 1;
  }
`;

export default function AddTag() {
  const { dispatch } = useInstance();
  const [newTag, setNewTag] = useState(blankTag());
  const [tags, setTags] = useState([]);
  const classes = useStyles();

  const showTag = () => {
    setTags(oldTags => [...oldTags, newTag]);
    setNewTag(blankTag());
  };

  const handleChange = field => e => {
    setNewTag({ ...newTag, [field]: e.target.value });
  };

  const handleToggle = field => e => {
    setNewTag({ ...newTag, [field]: e.target.checked });
  };

  const removeTag = idx => {
    setTags(oldTags => oldTags.filter((_, id) => id !== idx));
  };

  const saveTags = () => {
    dispatch({
      type: 'INSTANCE_TAGS',
      payload: {
        instanceTags: tags
          .filter(t => t.instance)
          .map(({ key, value }) => ({
            key,
            value
          }))
      }
    });

    dispatch({
      type: 'VOLUME_TAGS',
      payload: {
        volumeTags: tags
          .filter(t => t.volume)
          .map(({ key, value }) => ({
            key,
            value
          }))
      }
    });
  };

  return (
    <Box className={classes.fullWidth}>
      <Row>
        <form noValidate autoComplete="off">
          <TextField
            id="outlined-search"
            label="Key"
            type="search"
            className={classes.textField}
            margin="normal"
            value={newTag.key}
            variant="outlined"
            onChange={handleChange('key')}
          />
        </form>

        <form noValidate autoComplete="off">
          <TextField
            id="outlined-search"
            label="Value"
            type="search"
            className={classes.textField}
            margin="normal"
            value={newTag.value}
            variant="outlined"
            onChange={handleChange('value')}
          />
        </form>

        <FormControlLabel control={<Checkbox checked={newTag.instance} onChange={handleToggle('instance')} />} label="Instances" />

        <FormControlLabel control={<Checkbox checked={newTag.volume} onChange={handleToggle('volume')} />} label="Volumes" />

        <Button variant="contained" className={classes.button} onClick={showTag}>
          Add Tag
        </Button>
      </Row>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Instances</TableCell>
            <TableCell>Volumes</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tags.map((tag, idx) => (
            <TableRow key={tag.key}>
              <TableCell>
                <Typography>{tag.key}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{tag.value}</Typography>
              </TableCell>
              <TableCell>
                <Checkbox checked={tag.instance} />
              </TableCell>
              <TableCell>
                <Checkbox checked={tag.volume} />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => removeTag(idx)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={saveTags} color="primary">
        Save Tags
      </Button>
    </Box>
  );
}
