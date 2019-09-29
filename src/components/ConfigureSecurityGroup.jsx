import React, { useState } from 'react';
import { MenuItem, Table, TableHead, TableBody, TableRow, TableCell, Tooltip, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const TYPES = ['Custom TCP Rule', 'Custom UPD Rule', 'Custom ICMP Rule - IPv4'];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  centered: {
    textAlign: 'center'
  },
  left: {
    textAlign: 'left'
  },
  button: {
    margin: `${theme.spacing(1)}px !important`
  },
  nav: {
    marginTop: theme.spacing(2)
  },
  textField: {
    width: '60%'
  },
  menu: {
    width: '100%'
  },
  addButton: {
    marginTop: `${theme.spacing(2)}px !important`,
    marginRight: `${theme.spacing(2)}px !important`
  },
  table: {
    fontSize: '0.75rem !important'
  }
}));

function SelectOrNewGroup({ handleExisting, handleNew }) {
  const classes = useStyles();
  return (
    <Box>
      <Button variant="contained" color="primary" className={classes.button} onClick={handleNew}>
        New Security Group
      </Button>
      <Button variant="contained" color="primary" className={classes.button} onClick={handleExisting}>
        Select Existing Group
      </Button>
    </Box>
  );
}

function newEntry(id) {
  return {
    id,
    type: '',
    protocol: 'All',
    portRange: '0-65535',
    sourceType: 'Custom',
    ip: '0.0.0.0/0',
    description: 'e.g. SSH for Admin Desktop'
  };
}

function NewGroup() {
  const [state, setState] = useState({
    name: 'launch-wizard-1',
    description: `launch-wizard-1 created ${new Date(Date.now()).toString()}`
  });
  const [entries, setEntries] = useState([newEntry(0)]);

  const classes = useStyles();

  const handleFieldChange = (e, key) => {
    setState({ ...state, [key]: e.target.value });
  };

  const handleEntryChange = (e, key, idx) => {
    const oldEntries = entries;
    oldEntries[idx][key] = e.target.value;
    setEntries([...oldEntries]);
  };

  const handleSaveSG = () => {
    console.log(entries);
  };

  return (
    <Box className={classes.left}>
      <TextField className={classes.textField} required label="Name" margin="normal" value={state.name} onChange={e => handleFieldChange(e, 'name')} />
      <TextField className={classes.textField} required label="Description" margin="normal" value={state.description} onChange={e => handleFieldChange(e, 'description')} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Tooltip
                title="The protocol to open to network traffic. You can choose a common protocol, such as SSH (for a Linux instance), RDP (for a Windows instance), and HTTP and HTTPS to allow Internet traffic to reach your instance. You can also manually enter a custom port or port ranges."
                placement="top"
              >
                <Typography>Type</Typography>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip title="The type of protocol, for example TCP or UDP. Provides an additional selection for ICMP." placement="top">
                <Typography>Protocol</Typography>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip title="For custom rules and protocols, you can manually enter a port number or a port range." placement="top">
                <Typography>Port Range</Typography>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip
                title="Determines the traffic that can reach your instance. Specify a single IP address, or an IP address range in CIDR notation (for example, 203.0.113.5/32). If connecting from behind a firewall, you'll need the IP address range used by the client computers. You can specify the name or ID of another security group in the same region. To specify a security group in another AWS account (EC2-Classic only), prefix it with the account ID and a forward slash, for example: 111122223333/OtherSecurityGroup."
                placement="top"
              >
                <Typography>Source</Typography>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip title="A description for a security group rule." placement="top">
                <Typography>Description</Typography>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry, idx) => (
            <TableRow key={entry.id}>
              <TableCell>
                <TextField
                  select
                  value={entry.type}
                  onChange={e => handleEntryChange(e, 'type', idx)}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  {TYPES.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell>{entry.protocol}</TableCell>
              <TableCell>
                <TextField required margin="normal" value={entry.portRange} onChange={e => handleEntryChange(e, 'portRange', idx)} />
              </TableCell>
              <TableCell>
                <TextField
                  select
                  value={entry.sourceType}
                  onChange={e => handleEntryChange(e, 'sourceType', idx)}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  {['Custom', 'Anywhere', 'My IP'].map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField required margin="normal" value={entry.ip} onChange={e => handleEntryChange(e, 'ip', idx)} />
              </TableCell>
              <TableCell>
                <TextField required margin="normal" value={entry.description} onChange={e => handleEntryChange(e, 'description', idx)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" className={classes.addButton} onClick={() => setEntries([...entries, newEntry(entries.length)])}>
        Add Row
      </Button>
      <Button variant="contained" color="primary" className={classes.addButton} onClick={handleSaveSG}>
        Save Security Group
      </Button>
    </Box>
  );
}

function SelectGroup() {
  return (
    <Box>
      <Typography>Select Group</Typography>
    </Box>
  );
}

function getStep(index, handleExisting, handleNew) {
  switch (index) {
    case 0:
      return <SelectOrNewGroup handleExisting={handleExisting} handleNew={handleNew} />;
    case 1:
      return <NewGroup />;
    case 2:
      return <SelectGroup />;
    default:
      return null;
  }
}

export default function ConfigureSecurityGroup() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const [lastStep, setLastStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const steps = ['New Or Existing Group', 'Create Security Group', 'Select Security Group'];

  const handleNext = () => {
    setLastStep(activeStep);
    setActiveStep(step => step + 1);
  };

  const handleBack = () => {
    setActiveStep(lastStep);
    setLastStep(oldLastStep => (oldLastStep < activeStep ? oldLastStep - 1 : oldLastStep + 1));
  };

  const handleNew = () => {
    setLastStep(0);
    setActiveStep(1);
    setSkipped(new Set());
  };

  const handleExisting = () => {
    setLastStep(0);
    setActiveStep(2);
    setSkipped(() => {
      const newSkipped = new Set();
      newSkipped.add(1);
      console.log(newSkipped);
      return newSkipped;
    });
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, idx) => {
          const stepProps = {};
          const labelProps = {};
          if (idx === 1) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }

          if (skipped.has(idx)) {
            stepProps.completed = skipped.has(idx) ? false : null;
          }

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className={classes.centered}>
        {getStep(activeStep, handleExisting, handleNew)}
        <div className={classes.nav}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
