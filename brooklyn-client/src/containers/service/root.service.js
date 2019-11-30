import { API } from "aws-amplify";
import { getQueryParams } from "../containers.Utils";

const allOnErrors = error => {
  console.log(error);
};

export const getAllBy = entity => (onSuccess, onError) => ({
  filters = {}, // filters
  query = {} // sort, limit, offset, desc
}) => {
  const queryParams = getQueryParams()(filters);
  const queryStringParameters = {
    ...query,
    ...queryParams.queryStringParameters
  };
  API.get("UsersAPI", `/${entity}`, {
    queryStringParameters
  })
    .then(onSuccess)
    .catch(onError || allOnErrors);
};

export const getAllEntities = entity => (onSuccess, onError) => () => {
  API.get("UsersAPI", `/${entity}`, {})
    .then(onSuccess)
    .catch(onError || allOnErrors);
};

export const addEntity = entity => (onSuccess, onError) => properties => {
  const options = {
    body: properties
  };
  API.post("UsersAPI", `/${entity}`, options)
    .then(onSuccess)
    .catch(onError || allOnErrors);
};

export const delEntity = entity => (onSuccess, onError) => entityId => {
  API.del("UsersAPI", `/${entity}/${entityId}`, {})
    .then(onSuccess)
    .catch(onError || allOnErrors);
};

export const editEntity = entity => (onSuccess, onError) => (
  entityId,
  properties
) => {
  console.log("so what?", entity, properties);
  const options = {
    body: properties
  };
  API.patch("UsersAPI", `/${entity}/${entityId}`, options)
    .then(onSuccess)
    .catch(onError || allOnErrors);
};
