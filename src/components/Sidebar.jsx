import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useInstance } from '../context/InstanceContext';

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
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
    const { state } = useInstance();

    const fields = Object.keys(state);

    return (
      <div className={classes.list} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
        <List>
          {fields.map(key => (
            <ListItem button key={key}>
              <ListItemText primary={`${key} : ${JSON.stringify(state[key])}`} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <SideList />
    </Drawer>
  );
}
