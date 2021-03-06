import React, { useState, useEffect } from 'react';
import { IconButton, MenuItem, Table, TableHead, TableBody, TableRow, TableCell, Tooltip, TextField, Box } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Error from './common/Error';
import Loading from './common/Loading';
import useAPI from '../hooks/useAPI';
import ICMP_TYPES from '../static/icmp_types';
import { useInstance } from '../context/InstanceContext';

const TYPES = [
  {
    key: 'All',
    val: 'all'
  },
  {
    key: 'TCP',
    val: 'tcp'
  },
  {
    key: 'UPD',
    val: 'udp'
  },
  {
    key: 'ICMP',
    val: 'icmp'
  }
];

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
      <Button variant="contained" color="primary" className={classes.button} onClick={handleExisting}>
        Select Existing Group
      </Button>
      <Button variant="contained" color="primary" className={classes.button} onClick={handleNew}>
        New Security Group
      </Button>
    </Box>
  );
}

function newRule(id) {
  return {
    id,
    protocol: 'all',
    portRange: '',
    icmpType: '',
    cidrIp: '',
    description: ''
  };
}

function NewGroup() {
  const { state, dispatch } = useInstance();
  const [securityGroup, setSecurityGroup] = useState({
    name: (state && state.securityGroup && state.securityGroup.name) || 'launch-wizard-1',
    description: (state && state.securityGroup && state.securityGroup.description) || `launch-wizard-1 created ${new Date(Date.now()).toString()}`
  });
  const [rules, setRules] = useState((state && state.securityGroup && state.securityGroup.rules.length > 0 && state.securityGroup.rules) || [newRule(0)]);

  const classes = useStyles();

  const handleFieldChange = (e, key) => {
    setSecurityGroup({ ...securityGroup, [key]: e.target.value });
  };

  const handleRuleChange = (e, key, idx) => {
    const oldRules = rules;
    oldRules[idx][key] = e.target.value;
    setRules([...oldRules]);
  };

  const handleSaveSG = () => {
    dispatch({ type: 'SECURITY_GROUP', payload: { securityGroup: { ...securityGroup, rules } } });
  };

  return (
    <Box className={classes.left}>
      <TextField className={classes.textField} required label="Name" margin="normal" value={securityGroup.name} onChange={e => handleFieldChange(e, 'name')} />
      <TextField className={classes.textField} required label="Description" margin="normal" value={securityGroup.description} onChange={e => handleFieldChange(e, 'description')} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Tooltip
                title="The protocol to open to network traffic. You can choose a common protocol, such as SSH (for a Linux instance), RDP (for a Windows instance), and HTTP and HTTPS to allow Internet traffic to reach your instance. You can also manually enter a custom port or port ranges."
                placement="top"
              >
                <Typography>Protocol</Typography>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip title="The type of protocol, for example TCP or UDP. Provides an additional selection for ICMP." placement="top">
                <Typography>Type</Typography>
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
          {rules.map((entry, idx) => (
            <TableRow key={`${entry.portRange}${entry.protocol}${entry.cidrIp}`}>
              <TableCell>
                <TextField
                  select
                  value={entry.protocol}
                  onChange={e => handleRuleChange(e, 'protocol', idx)}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  {TYPES.map(({ key, val }) => (
                    <MenuItem key={val} value={val}>
                      {key}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell>
                {entry.protocol === 'icmp' ? (
                  <TextField
                    select
                    value={entry.icmpType}
                    onChange={e => handleRuleChange(e, 'icmpType', idx)}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                    margin="normal"
                  >
                    {ICMP_TYPES.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                {entry.protocol !== 'icmp' ? (
                  <TextField required margin="normal" value={entry.portRange} onChange={e => handleRuleChange(e, 'portRange', idx)} placeholder="0-65535" />
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                <TextField required margin="normal" value={entry.cidrIp} onChange={e => handleRuleChange(e, 'cidrIp', idx)} placeholder="0.0.0.0/0" />
              </TableCell>
              <TableCell>
                <TextField required margin="normal" value={entry.description} onChange={e => handleRuleChange(e, 'description', idx)} placeholder="e.g. SSH for Admin Desktop" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" className={classes.addButton} onClick={() => setRules([...rules, newRule(rules.length)])}>
        Add Row
      </Button>
      <Button variant="contained" color="primary" className={classes.addButton} onClick={handleSaveSG}>
        Save Security Group
      </Button>
    </Box>
  );
}

function SelectGroup({ handleNext }) {
  const { dispatch } = useInstance();
  const [{ data, error, loading }] = useAPI('/securityGroups');
  const [{ data: detailedSG }, fetchSG] = useAPI(
    {
      url: '/securityGroups/idx',
      method: 'GET'
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    if (detailedSG && detailedSG.data) {
      dispatch({ type: 'SECURITY_GROUP', payload: { securityGroup: detailedSG.data } });
      handleNext();
    }
  }, [detailedSG, dispatch, handleNext]);

  if (loading) return <Loading />;
  if (error && error.message) return <Error error={error.message} />;

  const sgs = (data && data.data) || [];

  const selectSecurityGroup = idx => {
    fetchSG({ url: `/securityGroups/${idx}` });
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography>ID</Typography>
          </TableCell>
          <TableCell>
            <Typography>Name</Typography>
          </TableCell>
          <TableCell>
            <Typography>Description</Typography>
          </TableCell>
          <TableCell>
            <Typography>Select</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sgs.map(sg => (
          <TableRow hover key={sg.id}>
            <TableCell>{sg.id}</TableCell>
            <TableCell>{sg.name}</TableCell>
            <TableCell>{sg.description}</TableCell>
            <TableCell>
              <IconButton color="primary" onClick={() => selectSecurityGroup(sg.id)}>
                <AddCircleIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getStep(index, handleExisting, handleNew, handleNext) {
  switch (index) {
    case 0:
      return <SelectOrNewGroup handleExisting={handleExisting} handleNew={handleNew} />;
    case 1:
      return <SelectGroup handleNext={handleNext} />;
    case 2:
      return <NewGroup />;
    default:
      return null;
  }
}

export default function ConfigureSecurityGroup() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [lastStep, setLastStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const steps = ['New Or Existing Group', 'Select Security Group', 'Create Security Group'];

  const handleNext = () => {
    setLastStep(activeStep);
    setActiveStep(step => step + 1);
  };

  const handleBack = () => {
    setActiveStep(lastStep);
    setLastStep(oldLastStep => (oldLastStep < activeStep ? oldLastStep - 1 : oldLastStep + 1));
  };

  const handleExisting = () => {
    setLastStep(0);
    setActiveStep(1);
    setSkipped(new Set());
  };

  const handleNew = () => {
    setLastStep(0);
    setActiveStep(2);
    setSkipped(() => {
      const newSkipped = new Set();
      newSkipped.add(1);
      return newSkipped;
    });
  };

  return (
    <div className={classes.root}>
      <p>
        A security group is a set of firewall rules that control the traffic for your instance. On this page, you can add rules to allow specific traffic to reach your instance.
        For example, if you want to set up a web server and allow Internet traffic to reach your instance, add rules that allow unrestricted access to the HTTP and HTTPS ports. You
        can create a new security group or select from an existing one below.
        <a href="https://docs.aws.amazon.com/console/ec2/security-groups"> Learn more </a>
        about Amazon EC2 security groups.
      </p>
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
        {getStep(activeStep, handleExisting, handleNew, handleNext)}
        <div className={classes.nav}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext} disabled={activeStep === steps.length - 1}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
