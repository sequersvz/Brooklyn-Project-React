import { API } from "aws-amplify";

export const getAllInternalServices = (onSuccess, onError) => () => {
  API.get("UsersAPI", `/servicearea`, {})
    .then(onSuccess)
    .catch(onError);
};

export const addInternalServices = (onSuccess, onError) => properties => {
  const options = {
    body: properties
  };
  API.post("UsersAPI", `/servicearea`, options)
    .then(onSuccess)
    .catch(onError);
};

export const deleteInternalServices = (onSuccess, onError) => serviceId => {
  API.del("UsersAPI", `/servicearea/${serviceId}`, {})
    .then(onSuccess)
    .catch(onError);
};

export const editInternalServices = (onSuccess, onError) => (
  serviceId,
  properties
) => {
  const options = {
    body: properties
  };
  API.patch("UsersAPI", `/servicearea/${serviceId}`, options)
    .then(onSuccess)
    .catch(onError);
};
