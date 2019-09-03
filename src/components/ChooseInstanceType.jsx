import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'

export default function ChooseInstanceType() {
    return (
        <Box>
        <Typography>Here you can choose an instance</Typography>
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
                    <TableCell align="right">EBS Optimized available</TableCell>
                    <TableCell align="right">Network Performance</TableCell>
                    <TableCell align="right">IPv6 Support</TableCell>
                    <TableCell align="right">Processor Architecture</TableCell>
                    <TableCell align="right">AES-NI</TableCell>
                    <TableCell align="right">AVX</TableCell>
                    <TableCell align="right">Turbo</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell align="right">General Purpose</TableCell>
                    <TableCell align="right">t2.micro</TableCell>
                    <TableCell align="right">Variable</TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">Intel Xeon Family</TableCell>
                    <TableCell align="right">2.5 GHz</TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">EBS Only</TableCell>
                    <TableCell align="right">-</TableCell>
                    <TableCell align="right">Low to Moderate</TableCell>
                    <TableCell align="right">Yes</TableCell>
                    <TableCell align="right">64-bit (x86), 32-bit (x86)</TableCell>
                    <TableCell align="right">Yes</TableCell>
                    <TableCell align="right">Yes</TableCell>
                    <TableCell align="right">Yes</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </Box>
    )
}