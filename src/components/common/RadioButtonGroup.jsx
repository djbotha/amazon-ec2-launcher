import React from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import styled from 'styled-components';

const Label = styled(FormControlLabel)({
  'span.MuiFormControlLabel-label': {
    fontSize: `12px`
  }
});

export default function RadioButtonGroup({ options }) {
  const [selected, setSelected] = React.useState(options[0]);

  const handleChange = event => {
    setSelected(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup aria-label="architecture" name="architecture" value={selected} onChange={handleChange} row>
        {options.map(opt => (
          <Label value={opt} control={<Radio />} label={opt} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
