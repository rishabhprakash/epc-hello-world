import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {navigate} from '@reach/router';

import {makeStyles} from '@material-ui/core/styles';
import {CssBaseline, Paper, Button, Typography} from '@material-ui/core';

import HeaderBar from '../HeaderBar/HeaderBar';
import Copyright from '../Copyright/Copyright';
import BorrowerInformation from '../BorrowerInformation/BorrowerInformation';
import LoanInformation from '../LoanInformation/LoanInformation';
import VerifyZipcode from '../VerifyZipcode/VerifyZipcode';
import WorkflowStepper from '../WorkflowStepper/WorkflowStepper';

import OriginService from '../../services/OriginService/OriginService';
import StatusService from '../../services/StatusService/StatusService';

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
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const NewOrderPage = (props) => {
  // Bind styling
  const classes = useStyles();

  // Initialize state variables
  const [activeStep, setActiveStep] = useState(0);
  const [
    initializationInformation,
    setInitializationInformation,
  ] = React.useState(null);
  const [orderStatus, setOrderStatus] = useState(0);

  // Initialize connection to Host JavaScript API
  const host = props.host;

  // Initializor function to update application state with origin data
  const initializeOriginInformation = async () => {
    // Access origin context
    const proxy = await host;
    const originContext = await proxy.getTransactionOrigin();
    const originId = originContext.id;
    const partnerAccessToken = originContext.partnerAccessToken;

    // Initialize application state with origin information
    const origin = OriginService(originId, partnerAccessToken);
    const originLoanData = await origin.getOriginLoanData();
    setInitializationInformation(originLoanData);
  };

  // Kick off origin data initializor on initial page render
  useEffect(() => {
    initializeOriginInformation();

    // eslint-disable-next-line
  }, []);

  // New Order navigation steps
  const steps = ['Borrower Information', 'Loan Information', 'Verify Zipcode'];

  // Handler to render component relevant to current workflow step
  const getStepContent = (step, initializationInformation) => {
    switch (step) {
      case 0:
        return <BorrowerInformation loan={initializationInformation} />;
      case 1:
        return <LoanInformation loan={initializationInformation} />;
      case 2:
        return <VerifyZipcode submit={false} />;
      default:
        throw new Error('Unknown step');
    }
  };

  // Status code to text resolver
  const getStatusText = () => {
    if (orderStatus === 0) {
      return 'Verifying Zipcode...';
    } else if (orderStatus === 1) {
      return 'Zipcode Verified!';
    } else {
      throw new Error('Unknown status');
    }
  };

  // Step navigation functions
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Order placement function
  const placeOrder = async () => {
    // Increment active step
    handleNext();

    // Create new transaction
    const proxy = await host;
    const transactionResponse = await proxy.createTransaction({
      request: {
        options: {
          // Canonical option - requestType
          requestType: 'VALIDATE_ZIPCODE',

          // Custom options
          customStringOption: 'test',
          customNumericOption: 100,
          customBooleanOption: true,
          customObjectOption: {
            customStringOption: 'test',
            customNumericOption: 100,
            customBooleanOption: true,
          },
        },
      },
    });

    // Poll for status of transaction processing once created
    const transactionId = transactionResponse.id;
    const statusTracker = StatusService(transactionId);

    try {
      await statusTracker.pollStatus();
      setOrderStatus(1);

      // Wait a couple seconds before navigating to order details page
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate(`details/${transactionId}`);
    } catch (err) {
      console.log(err);
    }
  };

  // Render main view
  return (
    <React.Fragment>
      <CssBaseline />

      <HeaderBar title='ZipRight' host={host} />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            New Order
          </Typography>

          <WorkflowStepper activeStep={activeStep} steps={steps} />

          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <VerifyZipcode
                  submit={true}
                  message={getStatusText()}
                  complete={orderStatus === 0 ? false : true}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, initializationInformation)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant='contained'
                    color='primary'
                    className={classes.button}
                    onClick={
                      activeStep === steps.length - 1 ? placeOrder : handleNext
                    }
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
};

NewOrderPage.propTypes = {
  host: PropTypes.object.isRequired,
};

export default NewOrderPage;
