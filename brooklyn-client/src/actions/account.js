import { API } from "aws-amplify";

export const AccountActions = {
  GET_ACCOUNT_BY_ID: "GET_ACCOUNT_BY_ID",
  GET_ACCOUNT_BY_ID_ERROR: "GET_ACCOUNT_BY_ID_ERROR",
  UPDATE_ACCOUNT_LOGO: "UPDATE ACCOUNT LOGO"
};

export function getAccount(accountId) {
  return async dispatch => {
    try {
      const result = await API.get("UsersAPI", `/accounts/${accountId}`, {});
      dispatch({
        type: "GET_ACCOUNT_BY_ID",
        ...{ account: result }
      });
    } catch (error) {
      console.error(`Error fetching `, error);
      dispatch({
        type: "GET_ACCOUNT_BY_ID_ERROR" // or, better, 'FAILED_ACTION' or something like that
      });
    }
  };
}

export const updateAccountLogo = ({ logoPath }) => ({
  type: AccountActions.UPDATE_ACCOUNT_LOGO,
  logoPath
});
