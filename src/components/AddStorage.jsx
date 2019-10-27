import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';

import STORAGES from '../static/storage.JSON';

const Panels = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2rem;
  width: 40%;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const HBox = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1rem;
  text-align: center;
`;

const Label = styled.p`
  margin: 0 auto;
`;

export default function AddStorage() {
  const [storages, setStorages] = useState(STORAGES);
  const [form, setForm] = useState(0);

  const handleChange = (e, field) => {
    setStorages(oldForm =>
      oldForm.map(f => {
        if (f.id - 1 === form) {
          return {
            ...f,
            [field]: e.target.value
          };
        }
        return f;
      })
    );
  };

  const handleRowClick = index => {
    setForm(index);
  };
  return (
    <Box>
      <p>
        Your instance will be launched with the following storage device settings. You can attach additional EBS volumes and instance store volumes to your instance, or edit the
        settings of the root volume. You can also attach additional EBS volumes after launching an instance, but not instance store volumes.
        <a href="https://docs.aws.amazon.com/console/ec2/launchinstance/storage"> Learn more </a>
        about storage options in Amazon EC2. Free tier eligible customers can get up to 30 GB of EBS General Purpose (SSD) or Magnetic storage.
        <a href="https://aws.amazon.com/free/"> Learn more </a>
        about free usage tier eligibility and usage restrictions.
      </p>

      <Panels>
        <LeftPanel>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Your Storage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storages.map(storage => (
                <TableRow key={storage.id} onClick={() => handleRowClick(storage.id - 1)} selected={form === storage.id - 1}>
                  <TableCell align="left">{storage.id}</TableCell>
                  <TableCell align="left">{storage.rootEBS}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </LeftPanel>

        <RightPanel>
          <HBox>
            <Label>Root/EBS:</Label>
            <Typography>{storages[form].rootEBS}</Typography>
          </HBox>

          <HBox>
            <Label>Device:</Label>
            {form !== 0 && (
              <FormControl>
                <InputLabel>Device</InputLabel>
                <Select value={storages[form].device} onChange={e => handleChange(e, 'Device')}>
                  <MenuItem value="/dev/sdb">/dev/sdb</MenuItem>
                  <MenuItem value="/dev/sdc">/dev/sdc</MenuItem>
                  <MenuItem value="/dev/sdd">/dev/sdd</MenuItem>
                  <MenuItem value="/dev/sde">/dev/sde</MenuItem>
                  <MenuItem value="/dev/sdf">/dev/sdf</MenuItem>
                  <MenuItem value="/dev/sdg">/dev/sdg</MenuItem>
                  <MenuItem value="/dev/sdh">/dev/sdh</MenuItem>
                  <MenuItem value="/dev/sdi">/dev/sdi</MenuItem>
                  <MenuItem value="/dev/sdj">/dev/sdj</MenuItem>
                  <MenuItem value="/dev/sdk">/dev/sdk</MenuItem>
                  <MenuItem value="/dev/sdl">/dev/sdl</MenuItem>
                </Select>
              </FormControl>
            )}
            {form === 0 && <Typography>/dev/xvda</Typography>}
          </HBox>

          <HBox>
            <Label>Snapshot:</Label>
            <Typography>{storages[form].Snapshot}</Typography>
          </HBox>

          <HBox>
            <Label>Size:</Label>
            <TextField value={storages[form].Size} onChange={e => handleChange(e, 'Size')} type="number" />
          </HBox>

          <HBox>
            <Label>Volume Type:</Label>
            <FormControl>
              <InputLabel>Volume Type</InputLabel>
              <Select value={storages[form].VolumeType} onChange={e => handleChange(e, 'VolumeType')}>
                <MenuItem value="General Purpose SSD (gp2)">General Purpose SSD (gp2)</MenuItem>
                <MenuItem value="Provisional IOPS SSD (io1)">Provisioned IOPS SSD (io1)</MenuItem>
                <MenuItem value="Magnetic (standard)">Magnetic (standard)</MenuItem>
                <MenuItem value="Cold HDD (sc1)">Cold HDD (sc1)</MenuItem>
                <MenuItem value="Throughput Optimized HDD (st1)">Throughput Optimized HDD (st1)</MenuItem>
              </Select>
            </FormControl>
          </HBox>

          <HBox>
            <Label>IOPS:</Label>
            <Typography>{storages[form].IOPS}</Typography>
          </HBox>

          <HBox>
            <Label>Throughput:</Label>
            <Typography>{storages[form].Throughput}</Typography>
          </HBox>

          <HBox>
            <Label>Delete on termination:</Label>
            <Checkbox checked={storages[form].DeleteOnTermination} onChange={e => handleChange(e, 'DeleteOnTermination')} value={storages[form].DeleteOnTermination} />
          </HBox>

          <HBox>
            <Label>Encryption:</Label>
            <FormControl>
              <InputLabel>Encryption</InputLabel>
              <Select value={storages[form].Encryption} onChange={e => handleChange(e, 'Encryption')}>
                <MenuItem value="Not Encrypted">Not Encrypted</MenuItem>
                <MenuItem value="(default) aws/ebs">(default) aws/ebs</MenuItem>
              </Select>
            </FormControl>
          </HBox>
        </RightPanel>
      </Panels>
    </Box>
  );
}
