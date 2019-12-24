import connexion

from services.origins import get_loan_information

# Origins retrieve controller
def retrieve(id, partnerAccessToken):

	res = get_loan_information(id, partnerAccessToken)

	return res, 200
