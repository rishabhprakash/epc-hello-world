import {
  API_URL,
  STATUS_PATH,
} from '../../environment';

const StatusService = (transactionId) => {
  // Internal function that invokes the integrations back-end API to access
  // transaction processing status
  const _getStatus = async () => {
    // Prepare API URL
    const url = API_URL + STATUS_PATH + transactionId;

    try {
      // Access and serialize the response
      const response = await fetch(url);
      const responseBody = await response.json();

      return responseBody;
    } catch (error) {
      console.error(error);
    };
  };

  // Internal function that invokes the integrations back-end API repetitively
  // to access transaction processing status
  const _pollStatus = async (timeout = 300000, interval = 200) => {
    // Define when to stop polling
    const endTime = Number(new Date()) + timeout;

    // Execute determinator function
    const checkCondition = async (resolve, reject) => {
      // Get current status
      const currentResponse = await _getStatus();
      const currentStatus = currentResponse.status;
      if (currentStatus === 'DOCUMENT_UPLOADED') {
        resolve(currentResponse);
      } else if (Number(new Date()) < endTime) {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        setTimeout(checkCondition, interval, resolve, reject);
      } else {
        // Didn't match and too much time, exit and reject
        reject(new Error(`Polling timed out!`));
      }
    };

    return new Promise(checkCondition);
  };

  return {
    // Public interface
    getStatus: _getStatus,
    pollStatus: _pollStatus,
  };
};

export default StatusService;
