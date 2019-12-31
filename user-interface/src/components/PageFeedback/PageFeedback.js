import React from 'react';
import PropTypes from 'prop-types';

import Backdrop from '@material-ui/core/Backdrop';
import {Typography, Grid, CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

// Define component styling
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  spinner: {
    padding: theme.spacing(2),
    alignItems: 'center',
    textAlign: 'center',
  },
  message: {
    fontSize: 10,
  },
}));

const PageFeedback = (props) => {
  // Bind component styling
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={props.open}>
      <Grid
        container
        spacing={2}
        direction='column'
        alignItems='center'
        justify='center'
      >
        <Grid item xs={12}>
          <Grid container className={classes.spinner} spacing={2}>
            <Grid item xs={12}>
              <CircularProgress color='inherit' />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.message} color='inherit'>
                {props.message}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

// Page Feedback component interface definition
PageFeedback.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

export default PageFeedback;
