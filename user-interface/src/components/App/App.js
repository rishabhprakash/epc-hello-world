import React from 'react';
import PropTypes from 'prop-types';
import {Router} from '@reach/router';

import Host from '../../services/HostConnectionService/HostConnectionService';

import NewOrderPage from './../NewOrderPage/NewOrderPage';
import OrderDetailsPage from '../OrderDetailsPage/OrderDetailsPage';
import LoadingPage from '../LoadingPage/LoadingPage';

const App = () => {
  // Initialize connection with Host Application
  const host = Host();

  return <PageRouter host={host} />;
};

const PageRouter = (props) => {
  return (
    <React.Fragment>
      <Router>
        <Loading path='/' host={props.host} />
        <NewOrder path='order' host={props.host} />
        <OrderDetails
          path='details/:transactionId'
          host={props.host}
          transactionId={props.transactionId}
        />
      </Router>
    </React.Fragment>
  );
};

// Page Router interface definition
PageRouter.propTypes = {
  host: PropTypes.object.isRequired,
  transactionId: PropTypes.string,
};

// Handler to render New Order Page
const NewOrder = (props) => {
  return <NewOrderPage host={props.host} />;
};

// New Order Page interface definition
NewOrder.propTypes = {
  host: PropTypes.object.isRequired,
};

// Handler to render Order Details Page
const OrderDetails = (props) => {
  return (
    <OrderDetailsPage host={props.host} transactionId={props.transactionId} />
  );
};

// Order Details Page interface definition
OrderDetails.propTypes = {
  host: PropTypes.object.isRequired,
  transactionId: PropTypes.string,
};

// Handler to render Loading Page
const Loading = (props) => {
  return <LoadingPage host={props.host} />;
};

// Loading Page interface definition
Loading.propTypes = {
  host: PropTypes.object.isRequired,
};

export default App;
