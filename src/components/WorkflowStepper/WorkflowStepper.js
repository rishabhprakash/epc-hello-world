import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Stepper,
    Step,
    StepLabel,
} from '@material-ui/core';

// Define component styling
const useStyles = makeStyles(theme => ({
    stepper: {
      padding: theme.spacing(3, 0, 5),
    },
  })
);

// Component that represent the order workflow current/completed/following steps
const WorkflowStepper = (props) => {

    // Bind styling
    const classes = useStyles();

    return (
        <Stepper activeStep={props.activeStep} className={classes.stepper}>
            {props.steps.map(label => (
            <Step key={label}>
                <StepLabel>{label}</StepLabel>
            </Step>
            ))}
        </Stepper>
    )
}

export default WorkflowStepper