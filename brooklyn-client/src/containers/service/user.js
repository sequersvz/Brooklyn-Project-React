import { API } from "aws-amplify";
import { orderAlphabetically } from "../../actions/utils/sortByKey";

const globalOnError = error => {
  console.log(error);
};

export const getUserOwners = (onSuccess, onError) => reviewId => {
  reviewId = reviewId ? `/${reviewId}` : "";
  onError = !onError ? globalOnError : onError;
  API.get("UsersAPI", `/user/owners${reviewId}`, {})
    .then(result => {
      return (result || []).sort((user1, user2) =>
        orderAlphabetically(user1.name, user2.name)
      );
    })

    .then(onSuccess)

    .catch(onError);
};

export const getUserManagers = (onSuccess, onError) => () => {
  onError = !onError ? globalOnError : onError;
  API.get("UsersAPI", `/user/managers`, {})
    .then(result => {
      return (result || []).sort((user1, user2) =>
        orderAlphabetically(user1.name, user2.name)
      );
    })

    .then(onSuccess)

    .catch(onError);
};

export const getUserGroups = (onSuccess, onError) => () => {
  onError = !onError ? globalOnError : onError;
  API.get("UsersAPI", `/user/groups`, {})
    .then(onSuccess)
    .catch(onError);
};
export const getUserRoles = (onSuccess, onError) => () => {
  onError = !onError ? globalOnError : onError;
  API.get("UsersAPI", `/user/roles`, {})
    .then(onSuccess)
    .catch(onError);
};

export const getUserVendors = async cognitoId => {
  return await API.get("UsersAPI", `/user/${cognitoId}/vendors`);
};

export const getUserSelectedGroups = async cognitoId => {
  return await API.get("UsersAPI", `/user/${cognitoId}/groups`);
};

export const getUserData = async cognitoId => {
  return await API.get("UsersAPI", `/user/cognito/${cognitoId}`);
};
