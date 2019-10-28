import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { useInstance } from '../context/InstanceContext';
import Sidebar from './Sidebar';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function DenseAppBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { state } = useInstance();

  const numKeys = Object.keys(state).length;

  return (
    <div className={classes.root}>
      <Sidebar open={open} setOpen={setOpen} />
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton onClick={() => setOpen(true)} edge="start" color="inherit" aria-label="menu">
            {numKeys ? (
              <Badge badgeContent={numKeys} color="secondary">
                <MenuIcon />
              </Badge>
            ) : (
              <MenuIcon />
            )}
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            Amazon EC2 Launch Wizard
          </Typography>
          <Button color="inherit" endIcon={<CheckCircleIcon />} onClick={() => setOpen(true)}>
            Launch Instance
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
