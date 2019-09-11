import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

// export default function ConfigureSecurityGroup() {
//   return (
//     <Box>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell align="right">ID</TableCell>
//             <TableCell align="right">Name</TableCell>
//             <TableCell align="right">Description</TableCell>
//             <TableCell align="right">Protocol</TableCell>
//             <TableCell align="right">Port Range</TableCell>
//             <TableCell align="right">Source</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           <TableRow>
//             <TableCell align="right">sg-9d0f99c7</TableCell>
//             <TableCell align="right">default</TableCell>
//             <TableCell align="right">default VPC security group</TableCell>
//             <TableCell align="right">TCP</TableCell>
//             <TableCell align="right">22</TableCell>
//             <TableCell align="right">0.0.0.0</TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </Box>
//   );
// }

import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%'
  },
  centered: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing(1)
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

function NewGroup() {
  return (
    <Box>
      <Typography>Create new group</Typography>
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
  const [activeStep, setActiveStep] = useState(0);
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
        <div>
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
