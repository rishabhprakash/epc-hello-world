import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import HouseIcon from '@material-ui/icons/House';
import ReceiptIcon from '@material-ui/icons/Receipt';

import Feedback from '../Feedback/Feedback';

// Define component styling
const useStyles = makeStyles( (theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'left',
  },
  title: {
    fontSize: 18,
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
  icon: {
    marginLeft: 6,
  },
}));

// Component that displays originating loan/property information
const LoanInformation = (props) => {
  // Bind styling
  const classes = useStyles();

  // Initialized component bound to state data
  const InitializedLoanInformation = (props) => {
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                  >
                    <Typography className={classes.title}>
                      Loan Information
                    </Typography>
                    <ReceiptIcon className={classes.icon} />
                  </Grid>
                  <Typography className={classes.property}>
                    Loan Number
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.loanNumber}
                  </Typography>
                  <Typography className={classes.property}>
                    Purpose
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.property.loanPurposeType}
                  </Typography>
                  <Typography className={classes.property}>
                    Type
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.mortgageType}
                  </Typography>
                  <Typography className={classes.property}>
                    Occupancy
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.applications[0].propertyUsageType}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                  >
                    <Typography className={classes.title}>
                      Property Information
                    </Typography>
                    <HouseIcon className={classes.icon} />
                  </Grid>
                  <Typography className={classes.property}>
                    County
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.property.county}
                  </Typography>
                  <Typography className={classes.property}>
                      Purchase Price
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.purchasePriceAmount}
                  </Typography>
                  <Typography className={classes.property}>
                    Type
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.loanProductData.gsePropertyType}
                  </Typography>
                  <Typography className={classes.property}>
                    Rights
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.loanProductData.lienPriorityType}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  };

  // Interface definition for initialized component
  InitializedLoanInformation.propTypes = {
    loan: PropTypes.object.isRequired,
  };

  // Unitialized component rendering feedback spinner
  const UninitializedLoanInformation = () => {
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                  >
                    <Typography className={classes.title}>
                        Loan Information
                    </Typography>
                    <ReceiptIcon className={classes.icon} />
                  </Grid>
                </CardContent>
                <CardContent>
                  <Feedback message='Loading Loan information...' />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                  >
                    <Typography className={classes.title}>
                        Property Information
                    </Typography>
                    <HouseIcon className={classes.icon} />
                  </Grid>
                </CardContent>
                <CardContent>
                  <Feedback message='Loading Property information...' />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  };

  // Handler to render the relative component - uninitialized or initialized
  const RenderLoanInformation = (props) => {
    // If origin loan data is present in state
    if (props.loan) {
      // Render initialized component
      return <InitializedLoanInformation loan={props.loan} />;
    } else {
      // If origin loan data is empty/null - render uninitialized component
      return <UninitializedLoanInformation />;
    }
  };

  // Interface for conditional rendering component
  RenderLoanInformation.propTypes = {
    loan: PropTypes.object,
  };

  return (
    <RenderLoanInformation loan={props.loan} />
  );
};

// Interface for Loan/Property information component
LoanInformation.propTypes = {
  loan: PropTypes.object,
};

export default LoanInformation;
