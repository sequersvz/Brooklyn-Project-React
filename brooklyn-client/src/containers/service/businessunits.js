import { API } from "aws-amplify";

const globalOnError = error => {
  console.log(error);
};

export const getBusinessUnits = (onSuccess, onError) => (options = {}) => {
  onError = !onError ? globalOnError : onError;
  API.get("UsersAPI", `/businessunits`, options)
    .then(onSuccess)
    .catch(onError);
};
