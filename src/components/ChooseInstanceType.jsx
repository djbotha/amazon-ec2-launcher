import React, { useState, useEffect } from 'react';
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

import INSTANCES from "../static/instance"

export default function ChooseInstanceType() {
  const [instances, setInstances] = useState(INSTANCES)
  const [filters, setFilters] = useState({
    freeTier: false,
    turbo: false,
    avx: false,
    aesni: false,
    IPv6: false,
    EBSOptimized: false,
    family: "All"
  });

  const handleToggle = key => {
    setFilters({ ...filters, [key]: !filters[key]});
  }

  const handleFamily = (e) => {
    setFilters({ ...filters, family: e.target.value});
  }

  const filterFamily = (instance) => {
    if (family === "All") {
      return true
    } 
    if (family === instance.family) {
      return true
    }
    return false
  }

  useEffect(() => {
    setInstances(INSTANCES)
    // setInstances(oldInstances => oldInstances.filter(instance => filters.freeTier === instance.freeTier))
    // setInstances(oldInstances => oldInstances.filter(instance => turbo === instance.turbo))
    // setInstances(oldInstances => oldInstances.filter(instance => avx === instance.avx))
    // setInstances(oldInstances => oldInstances.filter(instance => aesni === instance.aesni))
    // setInstances(oldInstances => oldInstances.filter(instance => IPv6 === instance.IPv6))
    // setInstances(oldInstances => oldInstances.filter(instance => EBSOptimized === instance.EBSoptimized))
    // setInstances(oldInstances => oldInstances.filter(instance => filterFamily(instance)))
    console.log(instances)
    ;}, [filters])

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
        control={
          <Switch checked={filters.freeTier} onChange={() => handleToggle('freeTier')} size="small" value="freeTier" color="primary" />
        }
        label="Free Tier Only"
      />
      
      <FormControlLabel
        control={
          <Switch checked={filters.turbo} onChange={() => handleToggle('turbo')} size="small" value="turbo" color="primary" />
        }
        label="Turbo"
      />
      
      <FormControlLabel
        control={
          <Switch checked={filters.avx} onChange={() => handleToggle('avx')} size="small" value="avx" color="primary" />
        }
        label="AVX"
      />
      
      <FormControlLabel
        control={
          <Switch checked={filters.aesni} onChange={() => handleToggle('aesni')} size="small" value="aesni" color="primary" />
        }
        label="AES-NI"
      />
      
      <FormControlLabel
        control={
          <Switch checked={filters.IPv6} onChange={() => handleToggle('IPv6')} size="small" value="IPv6" color="primary" />
        }
        label="IPv6 support"
      />

      <FormControlLabel
        control={
          <Switch checked={filters.EBSOptimized} onChange={() => handleToggle('EBSOptimized')} size="small" value="EBSOptimized" color="primary" />
        }
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
          <TableRow>
          <TableCell align="right">{instance.family}</TableCell>
          <TableCell align="right">{instance.type}</TableCell>
          <TableCell align="right">{instance.ECUs}</TableCell>
          <TableCell align="right">{instance.vCPUs}</TableCell>
          <TableCell align="right">{instance.physicalProcessor}</TableCell>
          <TableCell align="right">{instance.clockSpeed} GHz</TableCell>
          <TableCell align="right">{instance.memory}</TableCell>
          <TableCell align="right">{instance.instanceStorage}</TableCell>
          <TableCell align="right">{instance.networkPerformance}</TableCell>
          <TableCell align="right">{instance.processorArchitecture}</TableCell>
        </TableRow>
        ))}
        </TableBody>
      </Table>
    </Box>
  );
}
