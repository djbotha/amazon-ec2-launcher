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

export default function ConfigureSecurityGroup() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['New Or Existing Group', 'Create Security Group', 'Select Security Group'];
  function handleNext() {
    setActiveStep(step => step + 1);
  }

  function handleBack() {
    setActiveStep(step => step - 1);
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map(label => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className={classes.centered}>
        {activeStep === 0 && <SelectOrNewGroup handleExisting={() => setActiveStep(2)} handleNew={() => setActiveStep(1)} />}
        {activeStep === 1 && <NewGroup />}
        {activeStep === 2 && <SelectGroup />}
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
