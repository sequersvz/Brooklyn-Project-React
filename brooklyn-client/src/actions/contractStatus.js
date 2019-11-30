import { API } from "aws-amplify";

export const contractStatusesActions = {
  GET_CONTRACT_STATUSES_SUCCESS: "GET CONTRACT STATUSES SUCCESS",
  SELECT_CONTRACT_STATUS: "SELECT CONTRACT STATUS",
  DESELECT_CONTRACT_STATUS: "DESELECT CONTRACT STATUS",
  CLEAR_STATUS_FILTERS: "CLEAR STATUS FILTERS"
};

const getContractStatusesSuccess = statuses => {
  return {
    type: contractStatusesActions.GET_CONTRACT_STATUSES_SUCCESS,
    statuses
  };
};

export const selectContractStatus = statusId => ({
  type: contractStatusesActions.SELECT_CONTRACT_STATUS,
  statusId
});

export const deselectContractStatus = statusId => ({
  type: contractStatusesActions.DESELECT_CONTRACT_STATUS,
  statusId
});

export const clearStatusFilters = () => ({
  type: contractStatusesActions.CLEAR_STATUS_FILTERS
});

export const getContractStatuses = () => async dispatch => {
  try {
    const statuses = await API.get("UsersAPI", `/contracts/status`);
    dispatch(getContractStatusesSuccess(statuses));
  } catch (error) {
    //handle the error
  }
};
