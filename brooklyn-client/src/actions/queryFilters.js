export const queryFilterActions = {
  SET_QUERY_FILTERS: "SET QUERY FILTERS",
  resetQueryFilters: "RESET QUERY FILTERS"
};

export const setQueryFilters = ({ user, ...filters }) => {
  localStorage.setItem(`filters-${user}`, JSON.stringify(filters));
  return {
    type: queryFilterActions.SET_QUERY_FILTERS,
    filters
  };
};

export const resetQueryFilters = () => ({
  type: queryFilterActions.resetQueryFilters
});
