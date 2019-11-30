import { contractStatusesActions } from "../actions/contractStatus";

const initialState = {
  statuses: [],
  rawContractStatuses: [], //display only
  selectedStatuses: []
};

const getContractStatusesSuccess = (state, action) => ({
  ...state,
  statuses: action.statuses,
  rawContractStatuses: action.statuses
});

const selectContractStatus = (state, action) => {
  const statusId = parseInt(action.statusId, 10);
  const selectedStatus = state.statuses.filter(
    status => status.id === statusId
  );

  return {
    ...state,
    statuses: state.statuses.filter(status => status.id !== statusId),
    selectedStatuses: state.selectedStatuses.concat(selectedStatus)
  };
};

const deselectContractStatus = (state, action) => {
  const statusId = parseInt(action.statusId, 10);
  const deselectedStatus = state.selectedStatuses.filter(
    status => status.id === statusId
  );
  return {
    ...state,
    statuses: state.statuses
      .concat(deselectedStatus)
      .sort((item1, item2) => item1.id - item2.id),
    selectedStatuses: state.selectedStatuses.filter(
      status => status.id !== statusId
    )
  };
};

const clearStatusFilters = state => ({
  ...state,
  statuses: state.rawContractStatuses,
  selectedStatuses: []
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case contractStatusesActions.GET_CONTRACT_STATUSES_SUCCESS:
      return getContractStatusesSuccess(state, action);
    case contractStatusesActions.SELECT_CONTRACT_STATUS:
      return selectContractStatus(state, action);
    case contractStatusesActions.DESELECT_CONTRACT_STATUS:
      return deselectContractStatus(state, action);
    case contractStatusesActions.CLEAR_STATUS_FILTERS:
      return clearStatusFilters(state, action);
    default:
      return state;
  }
};

export default reducer;
