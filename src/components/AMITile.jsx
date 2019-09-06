import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Box, Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Typography, Tooltip } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { AddCircle, ExpandMore } from '@material-ui/icons';
import styled from 'styled-components';

import RadioButtons from './common/RadioButtonGroup';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: '100%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

const FreeTier = styled(Box)({
  backgroundColor: '#ccff90',
  textAlign: 'center',
  padding: '0.33rem 0',
  userSelect: 'none'
});

export default function AMICard({ ami, expandAll }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(expandAll);
  const { title, desc, cpu, cpus, root, virtualizationType, enaEnabled, img, free } = ami;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  return (
    <Card className={classes.card}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'h5' }} subheader={cpu} subheaderTypographyProps={{ variant: 'caption' }} />
      <CardMedia className={classes.media} image={img || '/static/img/default_ami.png'} title={title} />
      {free && <FreeTier>Free Tier Elligible</FreeTier>}
      <CardContent>
        <Typography variant="caption">{`Root device type: ${root} | Virtualization Type: ${virtualizationType} | ENA ${enaEnabled ? 'En' : 'Dis'}abled`}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <RadioButtons options={cpus} />
        <Tooltip title="Select" placement="top">
          <IconButton aria-label="select">
            <AddCircle color="primary" />
          </IconButton>
        </Tooltip>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {desc}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
