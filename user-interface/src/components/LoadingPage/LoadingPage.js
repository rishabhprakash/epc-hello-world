import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {CssBaseline, Paper, Grid} from '@material-ui/core';

import HeaderBar from '../HeaderBar/HeaderBar';
import Copyright from '../Copyright/Copyright';
import Feedback from '../Feedback/Feedback';
import {navigate} from '@reach/router';

// Define component styling
const useStyles = makeStyles((theme) => ({
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
}));

// Application loading component - routes to order/details page
const LoadingPage = (props) => {
  // Bind styling
  const classes = useStyles();

  // Instantiate constant with Host API connection
  const host = props.host;

  // Function to instantiate application state with origination context
  const setOriginationContext = async () => {
    // Instantiate instance of host application interface
    // and invoke access to origination context
    const proxy = await host;
    const originationData = await proxy.getTransactionOrigin();
    console.log(originationData);

    // Access and instantiate application state with originating context
    const currentTransactionId = originationData.transactionId;

    if (currentTransactionId) {
      // If in context of existing transaction - navigate to details view
      navigate(`/details/${currentTransactionId}`);
    } else {
      // Else - navigate to new order view
      navigate('/order');
    }
  };

  // Use Effect hook to initialize origination context at first page render
  useEffect(() => {
    setOriginationContext();

    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />

      <HeaderBar title='ZipRight' />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justify='center'
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
  host: PropTypes.object.isRequired,
  transactionId: PropTypes.string,
};

export default LoadingPage;
