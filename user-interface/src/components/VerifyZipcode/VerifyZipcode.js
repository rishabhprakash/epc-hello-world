import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';

import Feedback from '../Feedback/Feedback';

// Define component styling
const useStyles = makeStyles( (theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
  },
}));

// Component rendered while integration is processing zipcode validation request
const VerifyZipcode = (props) => {
  // Bind styling
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title}>
                    Let&apos;s verify the subject properties ZIP code!
                </Typography>
              </CardContent>
              {props.submit === true &&
              <CardContent>
                <Feedback message={props.message} complete={props.complete} />
              </CardContent>
              }
            </Card>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

VerifyZipcode.propTypes = {
  submit: PropTypes.bool.isRequired,
  message: PropTypes.string,
  complete: PropTypes.bool,
};

export default VerifyZipcode;
