import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  CircularProgress,
} from '@material-ui/core';

// Define component styles
const useStyles = makeStyles( (theme) => ({
  root: {
    flexGrow: 1,
  },
  spinner: {
    padding: theme.spacing(2),
    alignItems: 'center',
    textAlign: 'center',
  },
  message: {
    marginTop: 6,
    fontSize: 10,
    color: theme.palette.text.secondary,
  },
}));

const Feedback = (props) => {
  // Bind styling
  const classes = useStyles();

  // Return spinner with message
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12}>
            <Grid container className={classes.spinner} spacing={2}>
              <Grid item xs={12}>
                {props.complete === true ?
                (
                  <CircularProgress variant="static" value={100} />
                ):
                (
                  <CircularProgress />
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.message}>
                  {props.message}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

Feedback.propTypes = {
  message: PropTypes.string,
  complete: PropTypes.bool,
};

export default Feedback;
