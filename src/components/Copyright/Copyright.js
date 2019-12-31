import React from 'react';
import {
  Link,
  Typography,
} from '@material-ui/core';

// Copyright component
const Copyright = () => {
  return (
    <React.Fragment>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://partnerconnect.elliemae.com/">
            Ellie Mae
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </React.Fragment>
  );
};

export default Copyright;


