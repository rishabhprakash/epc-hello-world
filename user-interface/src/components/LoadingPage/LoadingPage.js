import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {
  CssBaseline,
  Paper,
  Grid,
} from '@material-ui/core';

import HeaderBar from '../HeaderBar/HeaderBar';
import Copyright from '../Copyright/Copyright';
import Feedback from '../Feedback/Feedback';
import {navigate} from '@reach/router';


// Define component styling
const useStyles = makeStyles( (theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}),
);

// Application loading component - routes to order/details page
const LoadingPage = (props) => {
  // Bind styling
  const classes = useStyles();

  // React to transaction ID update - navigate to corresponding page
  useEffect(() => {
    // If there is no transaction ID available in the origination context -
    // navigate to the "New Order" page
    if (props.transactionId === null) {
      navigate('/order');

    // Else if - there is a transactionId string available in the origination
    // context - retrieve the status information of that transaction and
    // navigate to the "View Order Details" page
    } else if (typeof(props.transactionId) === 'string') {
      // Navigate to details page - passing transaction ID as path param
      navigate(`/details/${props.transactionId}`);
    }
  }, [props.transactionId]);

  return (
    <React.Fragment>

      <CssBaseline />

      <HeaderBar title='ZipRight' />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '40vh'}}
          >
            <Grid item xs={3}>
              <Feedback message='Loading...' />
            </Grid>
          </Grid>
        </Paper>
        <Copyright />
      </main>

    </React.Fragment>
  );
};

LoadingPage.propTypes = {
  transactionId: PropTypes.string,
};

export default LoadingPage;
