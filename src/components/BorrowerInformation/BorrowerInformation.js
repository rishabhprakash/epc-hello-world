import React from 'react';
import PropTypes from 'prop-types';

// Material UI imports
import {makeStyles} from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

// Component imports
import Feedback from '../Feedback/Feedback';

// Define component styles
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

// Component that displays originating borrower/co-borrower information
const BorrowerInformation = (props) => {
  // Bind styling
  const classes = useStyles();

  // Initialized component bound to state data
  const InitializedBorrowerInformation = (props) => {
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Typography className={classes.title}>
                      Borrower
                    </Typography>
                    <PersonIcon className={classes.icon} />
                  </Grid>
                  <Typography className={classes.property}>
                    First Name
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.applications[0].borrower.firstName}
                  </Typography>
                  <Typography className={classes.property}>
                    Middle Name
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.applications[0].borrower.middleName}
                  </Typography>
                  <Typography className={classes.property}>
                    Last Name
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.applications[0].borrower.lastName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Typography className={classes.title}>
                        Co-Borrower
                    </Typography>
                    <PersonOutlineIcon className={classes.icon} />
                  </Grid>
                  <Typography className={classes.property}>
                    First Name
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.applications[0].coborrower.firstName}
                  </Typography>
                  <Typography className={classes.property}>
                    Middle Name
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.applications[0].coborrower.middleName}
                  </Typography>
                  <Typography className={classes.property}>
                    Last Name
                  </Typography>
                  <Typography className={classes.value}>
                    {props.loan.applications[0].coborrower.lastName}
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
  InitializedBorrowerInformation.propTypes = {
    loan: PropTypes.object.isRequired,
  };

  // Unitialized component rendering feedback spinner
  const UninitializedBorrowerInformation = () => {
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Typography className={classes.title}>
                        Borrower
                    </Typography>
                    <PersonIcon className={classes.icon} />
                  </Grid>
                </CardContent>
                <CardContent>
                  <Feedback message='Loading Borrower information...' />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Typography className={classes.title}>
                        Co-Borrower
                    </Typography>
                    <PersonOutlineIcon className={classes.icon} />
                  </Grid>
                </CardContent>
                <CardContent>
                  <Feedback message='Loading Co-Borrower information...' />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  };

  // Handler to render the relative component - uninitialized or initialized
  const RenderBorrowerInformation = (props) => {
    // If origin loan data is present in state
    if (props.loan) {
      // Render initialized component
      return <InitializedBorrowerInformation loan={props.loan} />;
    } else {
      // // If origin loan data is empty/null - render uninitialized component
      return <UninitializedBorrowerInformation />;
    }
  };

  // Interface for conditional rendering component
  RenderBorrowerInformation.propTypes = {
    loan: PropTypes.object,
  };

  return (
    <RenderBorrowerInformation loan={props.loan} />
  );
};

// Interface for Borrower/Co-Borrower information component
BorrowerInformation.propTypes = {
  loan: PropTypes.object,
};

export default BorrowerInformation;
