const parseFilters = filters => {
  if ((filters || []).length > 0) {
    return filters.join(",");
  }
  return null;
};

export const getQueryParams = (state, setState) => filters => {
  let myInit = {
    queryStringParameters: {}
  };
  const query = Object.keys(filters).reduce((query, key) => {
    const field = parseFilters(filters[key]);
    if (field) {
      query[key] = field;
    }
    return query;
  }, {});

  myInit.queryStringParameters = query;
  if (setState) {
    setState({ ...myInit });
  }
  return myInit;
};
