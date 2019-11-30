import { queryFilterActions } from "../actions/queryFilters";

const initialState = {};

const setQueryFilters = (state, { filters }) => ({
  ...filters
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case queryFilterActions.SET_QUERY_FILTERS:
      return setQueryFilters(state, action);
    case queryFilterActions.resetQueryFilters:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
