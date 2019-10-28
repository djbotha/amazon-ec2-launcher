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
import styled from 'styled-components';
import CheckIcon from '@material-ui/icons/Check';
import { green } from '@material-ui/core/colors';
import WarningIcon from '@material-ui/icons/Warning';
import { startCase } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';

import useAPI from '../hooks/useAPI';
import { Titles, Fields, useInstance } from '../context/InstanceContext';

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
  },
  progress: {
    color: green[500]
  }
});

const Left = styled.div`
  flex: 1;
`;

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

function RowItem({ handleClick, name, value }) {
  let items = null;

  if (Fields[name] === '') {
    items = <ListItemText primary={value} />;
  } else if (Array.isArray(value)) {
    items = value.map(val => Fields[name].map(field => <ListItemText primary={`${val[field]}`} secondary={startCase(field)} />));
  } else {
    items = Fields[name].map(field => <ListItemText primary={`${value[field]}`} secondary={startCase(field)} />);
  }

  return (
    <ListItem button>
      <Left>
        <Title>{Titles[name]}</Title>
        {items}
      </Left>
      <IconButton onClick={handleClick}>
        <DeleteIcon color="error" />
      </IconButton>
    </ListItem>
  );
}

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

    const endIcon = (
      <>
        {loading && <CircularProgress size={68} className={classes.progress} />}
        {data && data.success && <CheckIcon className={classes.progress} />}
        {error && error.message && <WarningIcon color="error" />}
        {!loading && !data && !error && <CheckCircleIcon />}
      </>
    );

    return (
      <div className={classes.list} role="presentation" onKeyDown={toggleDrawer(false)}>
        <List className={classes.grow}>
          {fields.map(key => (
            <RowItem key={key} handleClick={() => removeElement(key)} name={key} value={state[key]} />
          ))}
        </List>
        <Divider />
        <Button color="inherit" endIcon={endIcon} onClick={launchInstance} className={classes.launch}>
          {`Launch${data && data.success ? 'ed' : ''} Instance`}
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
