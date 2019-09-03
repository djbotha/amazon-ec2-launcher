import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function ConfigureSecurityGroup() {
  return (
    <Box>
      <Typography>Here you can configure your security group</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Protocol</TableCell>
            <TableCell align="right">Port Range</TableCell>
            <TableCell align="right">Source</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="right">sg-9d0f99c7</TableCell>
            <TableCell align="right">default</TableCell>
            <TableCell align="right">default VPC security group</TableCell>
            <TableCell align="right">TCP</TableCell>
            <TableCell align="right">22</TableCell>
            <TableCell align="right">0.0.0.0</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
