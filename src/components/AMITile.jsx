import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function AMITile() {
    return (
        <Box>
            <Typography>Amazon Linux 2 AMI (HVM), SSD Volume Type</Typography>
            <Typography>
                Amazon Linux 2 comes with five years support. It 
                provides Linux kernel 4.14 tuned for optimal performance
                on Amazon EC2, systemd 219, GCC 7.3, Glibc 2.26, Binutils
                2.29.1, and the latest software packages through extras.
            </Typography>
            <Typography>Root device type: ebs</Typography>
            <Typography>Virtualization type: hvm</Typography>
            <Typography>ENA Enabled: Yes</Typography>
        </Box>
    )
}