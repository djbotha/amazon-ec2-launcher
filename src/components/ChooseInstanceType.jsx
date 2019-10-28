import React, { useState, useEffect, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Error from './common/Error';
import Loading from './common/Loading';

import useAPI from '../hooks/useAPI';
import { useInstance } from '../context/InstanceContext';

export default function ChooseInstanceType() {
  const { dispatch } = useInstance();
  const [instances, setInstances] = useState([]);
  const [{ data, error, loading }] = useAPI('/instanceTypesDetailed');

  const [family, setFamily] = useState('All');

  const filterFamily = useCallback(
    instance => {
      if (family === instance.family) {
        return true;
      }
      return false;
    },
    [family]
  );

  useEffect(() => {
    setInstances(() => {
      let allInstances = (data && data.data) || [];
      allInstances = allInstances.filter(instance => family === 'All' || filterFamily(instance));
      return allInstances;
    });
  }, [data, family, filterFamily]);

  useEffect(() => {
    if (data && data.data) {
      setInstances(data.data);
    }
  }, [data]);

  const selectInstanceType = instanceType => {
    dispatch({ type: 'INSTANCE_TYPE', payload: { instanceType } });
  };

  if (error && error.message) return <Error error={error.message} />;

  if (loading) return <Loading />;
  return (
    <Box>
      <Select value={family} onChange={e => setFamily(e.target.value)} name="family">
        <MenuItem value="All">All instance families</MenuItem>
        <MenuItem value="Compute Instance">Compute Instance</MenuItem>
        <MenuItem value="Compute Instance (bare metal)">Compute Instance (bare metal)</MenuItem>
      </Select>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Family</TableCell>
            <TableCell>ECUs</TableCell>
            <TableCell>vCPUs</TableCell>
            <TableCell>Physical Processor</TableCell>
            <TableCell>Memory</TableCell>
            <TableCell>Instance Storage</TableCell>
            <TableCell>Network Performance</TableCell>
            <TableCell>Processor Architecture</TableCell>
            <TableCell>On-Demand hourly Price</TableCell>
            <TableCell>Select</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instances.map(instance => (
            <TableRow key={instance.instanceType}>
              <TableCell>{instance.instanceType}</TableCell>
              <TableCell>{instance.family}</TableCell>
              <TableCell>{instance.ecu}</TableCell>
              <TableCell>{instance.vcpu}</TableCell>
              <TableCell>{instance.physicalProcessor}</TableCell>
              <TableCell>{instance.memory}</TableCell>
              <TableCell>{instance.storage}</TableCell>
              <TableCell>{instance.networkPerformance}</TableCell>
              <TableCell>{instance.processorArchitecture}</TableCell>
              <TableCell>{`${instance.onDemandHourlyPrice.currency} ${instance.onDemandHourlyPrice.value}`}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => selectInstanceType(instance.instanceType)}>
                  <AddCircleIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
