import { AccountActions } from "../actions/account";

const account = (state = {}, action) => {
  switch (action.type) {
    case AccountActions.GET_ACCOUNT_BY_ID:
      return { ...state, ...action.account };
    case AccountActions.UPDATE_ACCOUNT_LOGO:
      return { ...state, logoPath: action.logoPath };
    default:
      return state;
  }
};

export default account;
