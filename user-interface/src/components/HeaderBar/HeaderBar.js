import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';


// Define component styling
const useStyles = makeStyles( (theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    flexGrow: 1,
  },
  closeButton: {
    fontSize: 'large',
  },
}),
);

// Application header bar component with title
const HeaderBar = (props) => {
  // Bind styling
  const classes = useStyles();

  // Instantiate Host connection
  const host = props.host;

  // Interact with Host application to navigate user away
  const closeApplication = async () => {
    // Await Host connection resolution
    const proxy = await host;

    // Invoke Host close method to navigate user away
    const close = await proxy.close();

    return close;
  };

  return (
    <AppBar position="absolute" color="default" className={classes.appBar}>
      <Toolbar>
        <Typography
          variant='h6'
          color='inherit'
          className={classes.title}
          noWrap
        >
          {props.title}
        </Typography>
        <IconButton className={classes.closeButton} onClick={closeApplication}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

HeaderBar.propTypes = {
  host: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default HeaderBar;
