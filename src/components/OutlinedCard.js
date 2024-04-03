import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HeatMap from './graphs/HeatMap';
import './components.css';

const card = (
  <React.Fragment>
    <CardContent>
    <div className="col-sm-6 mb-3 mb-sm-0 card text-center card-with-border">
      <div className="card-header">
        Intensity Heat-map
      </div>
      <div className="card-body">
        <HeatMap />
      </div>
    <div className="card-footer text-body-secondary">
      latest
    </div>
  </div>
  </CardContent>

  <CardContent>
  <div className="col-sm-6 mb-3 mb-sm-0 card text-center card-with-border">
      <div className="card-header">
        Relevance Heat-map
      </div>
      <div className="card-body">
        <HeatMap/>
      </div>
    <div className="card-footer text-body-secondary">
      latest
    </div>
  </div>
  </CardContent>

  <CardContent>
  <div className="col-sm-6 mb-3 mb-sm-0 card text-center card-with-border">
      <div className="card-header">
        Likelihood Heat-map
      </div>
      <div className="card-body">
        <HeatMap/>
      </div>
    <div className="card-footer text-body-secondary">
      latest
    </div>
  </div>
  </CardContent>

  </React.Fragment>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}

