import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import useAPI from '../hooks/useAPI';
import { useInstance } from '../context/InstanceContext';

const useStyles = makeStyles({
  list: {
    width: 250,
    height: '100%'
  },
  fullList: {
    width: 'auto',
    height: '100%'
  },
  grow: {
    flexGrow: 1
  },
  launch: {
    textAlign: 'center',
    margin: '1rem auto',
    padding: '1rem',
    width: '100%'
  }
});

export default function TemporaryDrawer({ open, setOpen }) {
  const classes = useStyles();

  const toggleDrawer = state => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(state);
  };

  function SideList() {
    const { state, dispatch } = useInstance();
    const [{ data, error, loading }, launchInstanceCall] = useAPI(
      {
        url: '/launchInstance',
        method: 'POST'
      },
      { manual: true }
    );

    const fields = Object.keys(state);

    const removeElement = key => {
      dispatch({ type: 'REMOVE', payload: { key } });
    };

    const launchInstance = () => {
      launchInstanceCall({
        url: '/launchInstance',
        data: {
          ...state
        }
      });
    };

    // TODO: Remove
    useEffect(() => {
      console.log(data);
      console.log(error);
      console.log(loading);
    }, [data, error, loading]);

    return (
      <div className={classes.list} role="presentation" onKeyDown={toggleDrawer(false)}>
        <List className={classes.grow}>
          {fields.map(key => (
            <ListItem button key={key}>
              <ListItemText primary={`${key} : ${JSON.stringify(state[key])}`} className={classes.grow} />
              <IconButton onClick={() => removeElement(key)}>
                <DeleteIcon color="error" />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Button color="inherit" endIcon={<CheckCircleIcon color="secondary" />} onClick={launchInstance} className={classes.launch}>
          Launch Instance
        </Button>
      </div>
    );
  }

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <SideList />
    </Drawer>
  );
}
