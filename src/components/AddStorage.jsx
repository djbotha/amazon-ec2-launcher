import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useInstance } from '../context/InstanceContext';

import STORAGES from '../static/storage.JSON';

const Panels = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2rem;
  flex: 1;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
`;

const HBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 1rem;
  align-items: center;
  text-align: left;
`;

const Label = styled.p`
  flex: 1;
`;

export default function AddStorage() {
  const [storages, setStorages] = useState(STORAGES);
  const [form, setForm] = useState(0);
  const { dispatch } = useInstance();
  const [volumes, setVolumes] = useState([{}]);

  const handleUpdate = () => {
    setVolumes(storages);
    dispatch({ type: 'VOLUMES', payload: { volumes } });
  };

  const handleChange = (e, field) => {
    setStorages(oldForm =>
      oldForm.map(f => {
        if (f.id - 1 === form && field === 'DeleteOnTermination') {
          return {
            ...f,
            [field]: e.target.checked
          };
        }
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

  const handleRemove = tid => {
    setStorages(oldStorages => {
      setForm(0);
      return oldStorages.filter(f => f.id !== tid);
    });
    console.log(storages);
    console.log(form);
    setForm(0);
  };

  const newState = () => ({
    id: storages.length + 1,
    rootEBS: 'EBS',
    deviceName: '',
    Snapshot: '',
    size: '8',
    type: 'General Purpose SSD (gp2)',
    IOPS: '100/3000',
    Throughput: 'N/A',
    deleteOnTermination: false,
    Encryption: 'Not Encrypted'
  });

  const handleAdd = () => {
    setStorages([...storages, newState()]);
    setForm(storages.length);
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
                <TableRow key={storage.id} selected={form === storage.id - 1}>
                  <TableCell align="left">
                    {storage.id}
                    {storage.rootEBS}
                    {storage.id > 1 && (
                      <IconButton onClick={() => handleRemove(storage.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleRowClick(storage.id - 1)}>
                      <ArrowForwardIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={() => handleAdd()}>Add New Volume</Button>
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
                <Select value={storages[form].deviceName} onChange={e => handleChange(e, 'deviceName')}>
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
            <TextField value={storages[form].size || 0} onChange={e => handleChange(e, 'size')} type="number" />
          </HBox>

          <HBox>
            <Label>Volume Type:</Label>
            <FormControl>
              <InputLabel>Volume Type</InputLabel>
              <Select value={storages[form].type} onChange={e => handleChange(e, 'type')}>
                <MenuItem value="gp2">General Purpose SSD (gp2)</MenuItem>
                <MenuItem value="io1">Provisioned IOPS SSD (io1)</MenuItem>
                <MenuItem value="standard">Magnetic (standard)</MenuItem>
                <MenuItem value="sc1">Cold HDD (sc1)</MenuItem>
                <MenuItem value="st1">Throughput Optimized HDD (st1)</MenuItem>
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
            <Checkbox onChange={e => handleChange(e, 'deleteOnTermination')} value={!!storages[form].deleteOnTermination} checked={!!storages[form].deleteOnTermination} />
          </HBox>

          <HBox>
            <Label>Encryption:</Label>
            <FormControl>
              <InputLabel>Encryption</InputLabel>
              <Select value={storages[form].Encryption} onChange={e => handleChange(e, 'Encryption')}>
                <MenuItem value="Not Encrypted">Not Encrypted</MenuItem>
                <MenuItem value="alias/aws/ebs">(default) aws/ebs</MenuItem>
              </Select>
            </FormControl>
          </HBox>
          <Button variant="contained" color="primary" size="large" onClick={() => handleUpdate()}>
            Update
          </Button>
        </RightPanel>
      </Panels>
    </Box>
  );
}
