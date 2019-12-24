from services.origins import get_loan_information

"""" Origins retrieve controller """


def retrieve(origin_id, partner_access_token):

    res = get_loan_information(origin_id, partner_access_token)
    if res is False: # This means the credentials are not valid
        res['status'] = "Invalid username or password"
        return res, 401
    else: # if credentials are valid simply pass on the response
        return res, 200
