import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';

export default function AddTag() {
  return (
    <Box>
      <Typography>Here you can add tags</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Instances</TableCell>
            <TableCell align="right">Volumes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    </Box>
  );
}
