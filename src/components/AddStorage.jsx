import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

export default function AddStorage() {
  return (
    <Box>
      <Typography>Here you can add Storage</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Root/EBS</TableCell>
            <TableCell align="right">Device</TableCell>
            <TableCell align="right">Snapshot</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Volume Type</TableCell>
            <TableCell align="right">IOPS</TableCell>
            <TableCell align="right">Throughput</TableCell>
            <TableCell align="right">Delete on termination</TableCell>
            <TableCell align="right">Encryption</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Root</TableCell>
            <TableCell align="right">/dev/xvda</TableCell>
            <TableCell align="right">snap-08091107f3acb12b2</TableCell>
            <TableCell align="right">8</TableCell>
            <TableCell align="right">General Purpose SSD (gp2)</TableCell>
            <TableCell align="right">100/3000</TableCell>
            <TableCell align="right">N/A</TableCell>
            <TableCell align="right">
              <Checkbox
                checked={false}
                value="true"
                inputProps={{
                  'aria-label': 'primary checkbox'
                }}
              />
            </TableCell>
            <TableCell align="right">Not Encrypted</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
