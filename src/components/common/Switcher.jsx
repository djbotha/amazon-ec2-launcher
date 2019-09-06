import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const AntSwitch = withStyles(theme => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex'
  },
  switchBase: {
    padding: 2,
    color: theme.palette.common.white,
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
      }
    }
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none'
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.primary.main
  },
  checked: {}
}))(Switch);

const NoSelect = styled.div`
  user-select: none;
`;

function BasicSwitch({ options }) {
  return (
    <Typography component="div">
      <NoSelect>{options[0]}</NoSelect>
    </Typography>
  );
}

function RockerSwitch({ options }) {
  const [checked, setChecked] = React.useState(true);

  const handleChange = event => {
    setChecked(event.target.checked);
  };

  return (
    <FormGroup>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <NoSelect>{options[0]}</NoSelect>
          </Grid>
          <Grid item>
            <AntSwitch checked={checked} onChange={handleChange} value="checked" />
          </Grid>
          <Grid item>
            <NoSelect>{options[1]}</NoSelect>
          </Grid>
        </Grid>
      </Typography>
    </FormGroup>
  );
}

export default function CustomizedSwitch({ options }) {
  return options.length === 2 ? <RockerSwitch options={options} /> : <BasicSwitch options={options} />;
}
