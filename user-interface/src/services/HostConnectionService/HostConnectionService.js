import host from '@elliemae/em-ssf-guest';

// Service that allows application to access Host application interface
const HostConnection = async () => {
  // Guest application initialization callback
  host.connect();
  host.ready();

  // Instantiate the transaction and application JavaScript objects for use
  const TransactionObject = await host.getObject('transaction');
  const ApplicationObject = await host.getObject('application');

  // Instantiate state variables to capture origination context and expiry
  let originExpiry = null;
  let originContext = null;

  // Implementation for transaction.getOrigin method exposed by this service
  // Note the special handling for origination context TTL of 300 seconds
  const _getTransactionOrigin = async () => {
    // Instantiate current time to check for origin expiry
    const currentTime = new Date();
    // Instantiate 10 second buffer under 300 second origin TTL - in miliseconds
    const bufferTime = 290 * 1000;

    // If this isn't the first time accessing origination context
    // and the current origination context has expired
    if (originExpiry && currentTime > originExpiry) {
      // Refresh the origination context
      originContext = await TransactionObject.refreshOrigin();

      // Reset the origination context expiry time with 10 second buffer
      originExpiry = new Date(new Date().getTime() + bufferTime);

      // Else - if this is the first time accessing origination context
    } else {
      // Initialize the origination context
      originContext = await TransactionObject.getOrigin();

      // Initialize expiry time with 10 second buffer
      originExpiry = new Date(new Date().getTime() + bufferTime);
    }

    return originContext;
  };

  // Implementation for transaction.create method exposed by this service
  const _createTransaction = async (request) => {
    const transactionId = await TransactionObject.create(request);
    return transactionId;
  };

  // Implementation for transaction.close method exposed by this service
  const _close = async () => {
    const close = await TransactionObject.close();
    return close;
  };

  // Implementation for Host application.getCapabilities method
  const _getApplicationCapabilities = async () => {
    const applicationCapabilities = await ApplicationObject.getCapabilities();
    return applicationCapabilities;
  };

  // Implementation for Host application.open method
  const _openResource = async (resourceReference) => {
    await ApplicationObject.open(resourceReference);
  };

  // Implementation for Host application.openModal method
  const _openResourceInModal = async (resourceReference) => {
    await ApplicationObject.openModal(resourceReference);
  };

  // Return the public interface for this service
  return {
    // Transaction Object interface
    getTransactionOrigin: _getTransactionOrigin,
    createTransaction: _createTransaction,
    close: _close,

    // Application Object interface
    getApplicationCapabilities: _getApplicationCapabilities,
    openResource: _openResource,
    openResourceInModal: _openResourceInModal,
  };
};

export default HostConnection;
