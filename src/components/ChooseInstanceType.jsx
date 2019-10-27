import React, { useState, useEffect, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import INSTANCES from '../static/instance';
import Modal from './Modal';
import useModal from './useModal';

export default function ChooseInstanceType() {
  const [instances, setInstances] = useState(INSTANCES);
  const { isShowing, toggle } = useModal();
  const [filters, setFilters] = useState({
    freeTier: false,
    turbo: false,
    AVX: false,
    AESNI: false,
    IPv6: false,
    EBSOptimizedAvailable: false,
    family: 'All'
  });

  const handleToggle = key => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const handleFamily = e => {
    setFilters({ ...filters, family: e.target.value });
  };

  const filterFamily = useCallback(
    instance => {
      if (filters.family === 'All') {
        return true;
      }
      if (filters.family === instance.family) {
        return true;
      }
      return false;
    },
    [filters]
  );

  useEffect(() => {
    setInstances(() => {
      let allInstances = INSTANCES;
      allInstances = allInstances.filter(instance => (filters.freeTier ? filters.freeTier === instance.freeTier : true));
      allInstances = allInstances.filter(instance => (filters.turbo ? filters.turbo === instance.turbo : true));
      allInstances = allInstances.filter(instance => (filters.AVX ? filters.AVX === instance.AVX : true));
      allInstances = allInstances.filter(instance => (filters.AESNI ? filters.AESNI === instance.AESNI : true));
      allInstances = allInstances.filter(instance => (filters.IPv6 ? filters.IPv6 === instance.IPv6 : true));
      allInstances = allInstances.filter(instance => (filters.EBSOptimizedAvailable ? filters.EBSOptimizedAvailable === instance.EBSOptimizedAvailable : true));
      allInstances = allInstances.filter(instance => (filters.family !== 'All' ? filterFamily(instance) : true));
      return allInstances;
    });
  }, [filterFamily, filters]);

  return (
    <Box>
      <Select value={filters.family} onChange={handleFamily} name="family">
        <MenuItem value="All">All instance families</MenuItem>
        <MenuItem value="Micro">Micro instances</MenuItem>
        <MenuItem value="General">General Purpose</MenuItem>
        <MenuItem value="Compute">Compute optimized</MenuItem>
        <MenuItem value="FPGA">FPGA instances</MenuItem>
        <MenuItem value="GPU">GPU instances</MenuItem>
        <MenuItem value="Memory">Memory optimized</MenuItem>
        <MenuItem value="Storage">Storage optimized</MenuItem>
      </Select>

      <FormControlLabel
        control={<Switch checked={filters.freeTier} onChange={() => handleToggle('freeTier')} size="small" value="freeTier" color="primary" />}
        label="Free Tier Only"
      />

      <FormControlLabel control={<Switch checked={filters.turbo} onChange={() => handleToggle('turbo')} size="small" value="turbo" color="primary" />} label="Turbo" />

      <FormControlLabel control={<Switch checked={filters.avx} onChange={() => handleToggle('avx')} size="small" value="avx" color="primary" />} label="AVX" />

      <FormControlLabel control={<Switch checked={filters.aesni} onChange={() => handleToggle('aesni')} size="small" value="aesni" color="primary" />} label="AES-NI" />

      <FormControlLabel control={<Switch checked={filters.IPv6} onChange={() => handleToggle('IPv6')} size="small" value="IPv6" color="primary" />} label="IPv6 support" />

      <FormControlLabel
        control={<Switch checked={filters.EBSOptimized} onChange={() => handleToggle('EBSOptimized')} size="small" value="EBSOptimized" color="primary" />}
        label="EBS Optimized Available"
      />

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
          {instances.map(instance => (
            <TableRow onClick={toggle}>
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
              <Modal isShowing={isShowing} hide={toggle} instance={instance} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
