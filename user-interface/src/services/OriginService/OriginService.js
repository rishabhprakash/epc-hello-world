import merge from 'deepmerge';

import {
  API_URL,
  ORIGIN_PATH,
} from '../../environment';

// Service that enables the application to access originating
// borrower/loan/property information
const OriginService = (originId, partnerAccessToken) => {
  // Placeholder value for origination loan data that is not returned
  const missingText = 'Data not available';

  // Base loan object (assuming all data is missing)
  const _baseLoan = {
    loanNumber: missingText,
    purchasePriceAmount: missingText,
    property: {
      loanPurposeType: missingText,
      county: missingText,
    },
    mortgageType: missingText,
    loanProductData: {
      lienPriorityType: missingText,
      gsePropertyType: missingText,
    },
  };

  // Base application object (assuming all data is missing)
  const _baseApplication = {
    borrower: {
      firstName: missingText,
      middleName: missingText,
      lastName: missingText,
    },
    coborrower: {
      firstName: missingText,
      middleName: missingText,
      lastName: missingText,
    },
    propertyUsageType: missingText,
  };

  // Utility function - performs a deep merge of the base state of the loan data
  // and what is available in the origination data to handle for missing fields
  const _deepMerge = (intermediateData) => {
    // The final current application is a deep merge of the
    // application returned by the EPC platform and the base application
    const finalApplication = merge(
        _baseApplication,
        intermediateData.applications[0],
    );

    // The final loan is a deep merge of the loan
    // returned by the EPC platform and the base loan
    const finalLoan = merge(_baseLoan, intermediateData);

    // Replace the final loans first application with
    // the merged final application
    finalLoan.applications[0] = finalApplication;
    return finalLoan;
  };

  // Internal function that invokes the integrations back-end API to access
  // origination data and merges the result with base state before returning
  const _getOriginLoanData = async () => {
    // Prepare API URL
    const url = API_URL + ORIGIN_PATH +
      originId + '?partner_access_token=' + partnerAccessToken;

    try {
      // Access and serialize the response
      const response = await fetch(url);
      const intermediateResponse = await response.json();

      // Merge the response with the base state
      // to handle for missing fields and return
      const finalResponse = _deepMerge(intermediateResponse);
      return finalResponse;
    } catch (error) {
      console.error(error);
    };
  };

  // Return public interface for this service
  return {
    getOriginLoanData: _getOriginLoanData,
  };
};

export default OriginService;
