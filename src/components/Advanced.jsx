import React from 'react';

import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';

import AddStorage from '../components/AddStorage';
import AddTag from '../components/AddTag';
import ChooseAMI from '../components/ChooseAMI';
import ChooseInstanceType from '../components/ChooseInstanceType';
import ConfigureSecurityGroup from '../components/ConfigureSecurityGroup';

export default function Index() {
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

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="Security">
          <Typography>Configure Security Group</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ConfigureSecurityGroup />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="Storage">
          <Typography>Add Storage</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AddStorage />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="Tags">
          <Typography>Add Tags</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AddTag />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container>
  );
}
