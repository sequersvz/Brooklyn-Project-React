import { VendorsActions } from "../actions/vendors";

const vendors = (state = { vendorsByAccount: [] }, action) => {
  switch (action.type) {
    case VendorsActions.GET_VENDORS_BYACCOUNT:
      return { ...state, vendorsByAccount: action.vendorsByAccount };
    default:
      return state;
  }
};

export default vendors;
