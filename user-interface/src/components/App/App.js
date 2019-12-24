import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Router,
} from '@reach/router';

import Host from '../../services/HostConnectionService/HostConnectionService';

import NewOrderPage from './../NewOrderPage/NewOrderPage';
import OrderDetailsPage from '../OrderDetailsPage/OrderDetailsPage';
import LoadingPage from '../LoadingPage/LoadingPage';

const App = () => {
  // Declare state variables for the application
  const [transactionId, setTransactionId] = useState(null);

  // Initialize connection with Host Application
  const host = Host();

  // Function to instantiate application state with origination context
  const setOriginationContext = async () => {
    // Instantiate instance of host application interface
    // and invoke access to origination context
    const proxy = await host;
    const originationData = await proxy.getTransactionOrigin();
    console.log(originationData);

    // Access and instantiate application state with originating context
    const currentTransactionId = originationData.transactionId;

    setTransactionId(currentTransactionId);
  };

  // Use Effect Hook to initialize origination context at first page render
  useEffect(() => {
    setOriginationContext();
  }, [],
  );

  return (
    <PageRouter host={host} transactionId={transactionId} />
  );
};

const PageRouter = (props) => {
  return (
    <React.Fragment>
      <Router>
        <Loading
          path="/" host={props.host}
          transactionId={props.transactionId}
        />
        <NewOrder path="order" host={props.host} />
        <OrderDetails path="details/:transactionId"
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
  location: PropTypes.object,
};

// Handler to render New Order Page
const NewOrder = (props) => {
  return (
    <NewOrderPage host={props.host} />
  );
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
  return (
    <LoadingPage host={props.host} transactionId={props.transactionId} />
  );
};

// Loading Page interface definition
Loading.propTypes = {
  host: PropTypes.object.isRequired,
  transactionId: PropTypes.string,
};

export default App;
