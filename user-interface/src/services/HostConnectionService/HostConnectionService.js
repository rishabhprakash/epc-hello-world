import host from '@elliemae/em-ssf-guest';

// Service that allows application to access Host application interface
const HostConnection = async () => {
  // Guest application initialization callback
  host.connect();
  host.ready();

  // Instantiate the transaction and application JavaScript objects for use
  const TransactionObject = await host.getObject('transaction');
  const ApplicationObject = await host.getObject('application');

  // Implementation for transaction.getOrigin method exposed by this service
  const _getTransactionOrigin = async () => {
    const originData = await TransactionObject.getOrigin();
    return originData;
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

  // Implementation for Host application.openModal method
  const _openResource = async (resourceReference) => {
    await ApplicationObject.open(resourceReference);
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
  };
};

export default HostConnection;
