import { API } from "aws-amplify";
import { makeCancelable } from "../../Utils";
let lastRequestTokenSourceCheckpointsPinned = undefined;

export const getAllCheckpoints = (onSuccess, onError) => () => {
  API.get("UsersAPI", `/checkpoints`, {})
    .then(onSuccess)
    .catch(onError);
};

export const getCheckpointsByCategoryIdAndReview = (onSuccess, onError) => (
  reviewId,
  categoryId
) => {
  API.get(
    "UsersAPI",
    `/reviews/${
      reviewId ? reviewId : "all"
    }/category/${categoryId}/checkpoints`,
    {}
  )
    .then(onSuccess)
    .catch(onError);
};

export const getCheckpointsByCategoryId = (
  onSuccess,
  onError
) => categoryId => {
  API.get("UsersAPI", `/category/${categoryId}/checkpoints`, {})
    .then(onSuccess)
    .catch(onError);
};

export const rootEditCheckpoints = (onSuccess, onError) => (
  checkpointId,
  properties
) => {
  let options = {
    body: Object.assign({}, properties)
  };
  API.patch("UsersAPI", `/checkpoints/root/${checkpointId}`, options)
    .then(onSuccess)
    .catch(onError);
};

export const rootDeleteCheckpoint = (onSuccess, onError) => checkpointId => {
  API.del("UsersAPI", `/checkpoints/root/${checkpointId}`, {})
    .then(onSuccess)
    .catch(onError);
};

export const reviewDelectCheckpoint = (
  onSuccess,
  onError
) => reviewId => checkpointId => {
  API.del("UsersAPI", `/reviews/${reviewId}/checkpoints/${checkpointId}`, {})
    .then(onSuccess)
    .catch(onError);
};

export const reviewActionCheckpoint = (onSuccess, onError) => reviewId => (
  checkpointId,
  options
) => {
  if (lastRequestTokenSourceCheckpointsPinned) {
    lastRequestTokenSourceCheckpointsPinned.cancel();
  }
  const request = API.patch(
    "UsersAPI",
    `/reviews/${reviewId}/checkpoint/${checkpointId}`,
    options
  );
  const cancellableRequest = makeCancelable(request);
  lastRequestTokenSourceCheckpointsPinned = cancellableRequest;

  cancellableRequest.promise
    .then(resp => {
      return onSuccess(resp);
    })
    .catch(error => {
      lastRequestTokenSourceCheckpointsPinned = undefined;
      return onError(error);
    });
};

export const addCheckpointByCategoryId = (onSuccess, onError) => properties => {
  let options = {
    body: properties
  };
  API.post("UsersAPI", `/checkpoints`, options)
    .then(onSuccess)
    .catch(onError);
};
