import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {
  CssBaseline,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';

import HeaderBar from '../HeaderBar/HeaderBar';
import Copyright from '../Copyright/Copyright';
import Feedback from '../Feedback/Feedback';

import StatusService from '../../services/StatusService/StatusService';

const useStyles = makeStyles( (theme) => ({
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
    padding: theme.spacing(2),
    justifyContent: 'center',
  },
  property: {
    marginTop: 24,
    fontSize: 12,
  },
  value: {
    marginTop: 6,
    fontSize: 10,
    color: theme.palette.text.secondary,
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const OrderDetailsPage = (props) => {
  // Bind styling
  const classes = useStyles();

  // Initialize state variables
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
  useEffect( () => {
    initializeOrderInformation(props.transactionId);
  }, []);

  // Function to invoke Host application to launch report in new tab
  const viewReport = async () => {
    // Await host connection resolution
    const proxy = await host;

    // Invoke host method to open report in new tab - passing report resource ID
    const openResourceInModalResponse = await proxy.openResource({
      target: {
        entityId: orderInformation.resource_id,
        entityType: 'urn:elli:skydrive',
      },
    });

    return openResourceInModalResponse;
  };

  return (
    <React.Fragment>

      <CssBaseline />

      <HeaderBar title='ZipRight' host={host} />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            View Order Details
          </Typography>
          <Card className={classes.card}>
            <CardContent>
              <React.Fragment>
                {orderInformation === null ?
                  (
                    <Feedback message="Loading order details..." />
                  ):
                  (
                    <React.Fragment>
                      <Typography className={classes.property}>
                        Order Status:
                      </Typography>
                      <Typography className={classes.value}>
                        Completed
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={viewReport}
                      >
                        View Verification Report
                      </Button>
                    </React.Fragment>
                  )
                }
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
