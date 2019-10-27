import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 1200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function SimpleModal({ isShowing, instance }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(isShowing);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Open Modal
      </button>
      <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right">Family</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">ECUs</TableCell>
                <TableCell align="right">vCPUs</TableCell>
                <TableCell align="right">Physical Processor</TableCell>
                <TableCell align="right">Clock Speed</TableCell>
                <TableCell align="right">Memory</TableCell>
                <TableCell align="right">Instance Storage</TableCell>
                <TableCell align="right">Network Performance</TableCell>
                <TableCell align="right">Processor Architecture</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">{instance.family}</TableCell>
                <TableCell align="right">{instance.type}</TableCell>
                <TableCell align="right">{instance.ECUs}</TableCell>
                <TableCell align="right">{instance.vCPUs}</TableCell>
                <TableCell align="right">{instance.physicalProcessor}</TableCell>
                <TableCell align="right">{`${instance.clockSpeed} GHz`}</TableCell>
                <TableCell align="right">{instance.memory}</TableCell>
                <TableCell align="right">{instance.instanceStorage}</TableCell>
                <TableCell align="right">{instance.networkPerformance}</TableCell>
                <TableCell align="right">{instance.processorArchitecture}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <SimpleModal instance={instance} />
        </div>
      </Modal>
    </div>
  );
}
