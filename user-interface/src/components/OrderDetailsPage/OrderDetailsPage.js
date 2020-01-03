import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {navigate} from '@reach/router';

import {makeStyles} from '@material-ui/core/styles';
import {
  CssBaseline,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';

import PageFeedback from './../PageFeedback/PageFeedback';
import HeaderBar from '../HeaderBar/HeaderBar';
import Copyright from '../Copyright/Copyright';
import Feedback from '../Feedback/Feedback';

import StatusService from '../../services/StatusService/StatusService';

// Define component styling
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
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
  card: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  property: {
    marginTop: 6,
    fontSize: 16,
  },
  value: {
    marginTop: 6,
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const OrderDetailsPage = (props) => {
  // Bind styling
  const classes = useStyles();

  // Initialize Order Details Page state variables
  const [fullPageLoad, setFullPageLoad] = useState(false);
  const [orderInformation, setOrderInformation] = useState(null);

  // Initialize connection to Host JavaScript API
  const host = props.host;

  // Function that asynchronously initializes order information
  const initializeOrderInformation = async (transactionId) => {
    // Get order status information based on available transaction ID
    const statusTracker = StatusService(transactionId);
    const response = await statusTracker.getStatus();

    // Initialize component state with order information
    setOrderInformation(response);
  };

  // Invoke order information initialization on initial render
  useEffect(() => {
    initializeOrderInformation(props.transactionId);

    // eslint-disable-next-line
  }, []);

  // Order status to user-friendly status resolver
  const getStatusText = () => {
    const currentStatus = orderInformation.status;

    if (currentStatus === 'DOCUMENT_UPLOADED') {
      return `Verification Completed`;
    } else {
      // TODO: Handle other statuses
    }
  };

  // Function to invoke Host application to launch report in new tab
  const viewReport = async () => {
    // Show full page spinner
    setFullPageLoad(true);

    // Await host connection resolution
    const proxy = await host;

    // Invoke host method to open report in new tab - passing report resource ID
    try {
      await proxy.openResourceInModal({
        target: {
          entityId: orderInformation.resource_id,
          entityType: 'urn:elli:skydrive',
        },
      });
    } catch (err) {
      console.logg(err);
    }

    // Hide full page spinner
    setFullPageLoad(false);
  };

  return (
    <React.Fragment>
      {fullPageLoad === true && (
        <PageFeedback open={fullPageLoad} message='Loading...' />
      )}

      <CssBaseline />

      <HeaderBar title='ZipRight' host={host} />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            View Order Details
          </Typography>
          <Card className={classes.card}>
            <CardContent>
              <React.Fragment>
                {orderInformation === null ? (
                  <Feedback message='Loading order details...' />
                ) : (
                  <React.Fragment>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Grid container justify='center'>
                          <Typography className={classes.property}>
                            Order Status
                          </Typography>
                        </Grid>
                        <Grid container justify='center'>
                          <Typography className={classes.value}>
                            {getStatusText()}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container justify='center'>
                          <Typography className={classes.property}>
                            Order Number
                          </Typography>
                        </Grid>
                        <Grid container justify='center'>
                          <Typography className={classes.value}>
                            {props.transactionId}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justify='center'>
                          <Button
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            onClick={viewReport}
                          >
                            View Verification Report
                          </Button>
                        </Grid>
                        <Grid container justify='center'>
                          <Button
                            variant='contained'
                            className={classes.button}
                            onClick={() => {
                              navigate('/order');
                            }}
                          >
                            Re-verify Zipcode
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                )}
              </React.Fragment>
            </CardContent>
          </Card>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
};

// Interface definition for Order Details page
OrderDetailsPage.propTypes = {
  host: PropTypes.object.isRequired,
  transactionId: PropTypes.string.isRequired,
};

export default OrderDetailsPage;
