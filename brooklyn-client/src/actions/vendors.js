import { API } from "aws-amplify";
import { getQueryParams } from "../containers/containers.Utils";
import { makeCancelable } from "../Utils";

let lastVendorsRequest;

export const VendorsActions = {
  GET_VENDORS_BYACCOUNT: "GET_VENDORS_BYACCOUNT"
};

export const getVendorsByAccount = ({
  accountId,
  onSuccess = null,
  query,
  filters
}) => {
  let myInit = getQueryParams()(filters);
  return async dispatch => {
    if (lastVendorsRequest) {
      lastVendorsRequest.cancel();
    }
    const request = API.get(
      "UsersAPI",
      `/accounts/${accountId}/vendors?limit=${query.limit || 50}${
        query.offset ? "&offset=" + query.offset : ""
      }${query.name ? "&name=" + query.name : ""}`,
      myInit
    );
    const cancelableRequest = makeCancelable(request);
    lastVendorsRequest = cancelableRequest;
    try {
      let result = await cancelableRequest.promise;
      lastVendorsRequest = false;
      dispatch({
        type: "GET_VENDORS_BYACCOUNT",
        ...{ vendorsByAccount: result }
      });

      if (onSuccess) {
        onSuccess(result, dispatch);
      }
    } catch (error) {
      if (!(error || {}).isCanceled) {
        console.error(`Error fetching `, error);
        dispatch({
          type: "GET_VENDORS_BYACCOUNT_ERROR" // or, better, 'FAILED_ACTION' or something like that
        });
      }
    }
  };
};
