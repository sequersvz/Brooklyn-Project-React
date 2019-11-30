import { API } from "aws-amplify";

export const getAllCategories = (onSuccess, onError) => () => {
  API.get("UsersAPI", `/category`, {})
    .then(onSuccess)
    .catch(onError);
};

export const getReviewCategories = (onSuccess, onError) => reviewId => {
  API.get("UsersAPI", `/reviews/${reviewId ? reviewId : "all"}/categories`, {})
    .then(onSuccess)
    .catch(onError);
};

export const addCategory = (onSuccess, onError) => properties => {
  const options = {
    body: properties
  };
  API.post("UsersAPI", `/category`, options)
    .then(onSuccess)
    .catch(onError);
};

export const deleteCategory = (onSuccess, onError) => categoryId => {
  API.del("UsersAPI", `/category/${categoryId}`, {})
    .then(onSuccess)
    .catch(onError);
};

export const editCategory = (onSuccess, onError) => (
  categoryId,
  properties
) => {
  const options = {
    body: properties
  };
  API.patch("UsersAPI", `/category/${categoryId}`, options)
    .then(onSuccess)
    .catch(onError);
};

export const sortCategories = (onSuccess, onError) => newSort => {
  const options = {
    body: {
      newsort: newSort
    }
  };
  API.post("UsersAPI", `/category/meeting-sort`, options)
    .then(onSuccess)
    .catch(onError);
};
