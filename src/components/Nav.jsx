import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import useAPI from '../hooks/useAPI';
import { useInstance } from '../context/InstanceContext';
import Sidebar from './Sidebar';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

export default function DenseAppBar() {
  const [{ data, error, loading }, launchInstanceCall] = useAPI(
    {
      url: '/launchInstance',
      method: 'POST'
    },
    { manual: true }
  );

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { state } = useInstance();

  const numKeys = Object.keys(state).length;

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
    <div className={classes.root}>
      <Sidebar open={open} setOpen={setOpen} />
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton onClick={() => setOpen(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            {numKeys ? (
              <Badge badgeContent={numKeys} color="secondary">
                <MenuIcon />
              </Badge>
            ) : (
              <MenuIcon />
            )}
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.root}>
            Amazon EC2 Launch Wizard
          </Typography>
          <Button color="inherit" endIcon={<CheckCircleIcon />} onClick={launchInstance}>
            Launch Instance
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
