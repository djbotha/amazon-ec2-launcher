import React from 'react';

import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';

import ChooseAMI from './ChooseAMI';
import ChooseInstanceType from './ChooseInstanceType';

export default function DisplayBeginner() {
  return (
    <Container maxWidth="lg">
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="AMI">
          <Typography>Choose AMI</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ChooseAMI />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="Instance">
          <Typography>Choose Instance Type</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ChooseInstanceType />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container>
  );
}
