import { API } from "aws-amplify";

const onErrorGlobal = error => {
  console.log(error);
};

export const getReviewById = (onSuccess, onError) => (
  reviewId,
  options = {}
) => {
  API.get("UsersAPI", `/reviews/${reviewId ? reviewId : "all"}/vendor`, options)
    .then(onSuccess)
    .catch(onError);
};

export const editReviewById = (onSuccess, onError) => (
  reviewId,
  properties
) => {
  API.patch("UsersAPI", `/reviews/${reviewId}`, properties)
    .then(onSuccess)
    .catch(onError);
};

export const editReviewAttendeesById = (onSuccess, onError) => (
  reviewId,
  attendees
) => {
  let attendeesId = `?attendeesId=${attendees
    .map(attendee => attendee.value)
    .join(",")}`;
  API.patch("UsersAPI", `/reviews/${reviewId}/attendees${attendeesId}`, {})
    .then(onSuccess)
    .catch(onError);
};

export const deleteReview = (onSuccess, onError) => async reviewId => {
  try {
    await API.del("UsersAPI", `/reviews/${reviewId}/addcheckpoints`, {});
    onSuccess();
  } catch (error) {
    onError(error);
  }
};

export const addCheckpoint = (onSuccess, onError, getProps) => () => {
  let properties = getProps();
  let options = {
    body: {
      name: properties.checkpointName,
      enabled: true,
      order: 0,
      accountId: properties.accountId
    }
  };
  API.post(
    "UsersAPI",
    `/reviews/${properties.reviewId}/category/${
      properties.categoryId
    }/checkpoints`,
    options
  )
    .then(onSuccess)
    .catch(onError);
};

export const editReview = (onSuccess, onError) => (reviewId, properties) => {
  let options = {
    body: properties
  };
  API.patch("UsersAPI", `/reviews/${reviewId}`, options)
    .then(onSuccess)
    .catch(onError);
};

export const addReview = (onSuccess, onError, accountId) => async (
  review,
  submitting
) => {
  const options = {
    method: "POST",
    body: {
      ...review,
      accountId
    }
  };

  try {
    const { id } = await API.post(
      "UsersAPI",
      "/reviews/addcheckpoints",
      options
    );
    onSuccess(id);
  } catch (error) {
    onError(error);
  } finally {
    submitting(false);
  }
};

export const getReviewsOpen = (onSuccess, onError) => accountId => {
  API.get("UsersAPI", `/reviews/account/${accountId}/open`, {})
    .then(onSuccess)
    .catch(onError);
};

export const getMeetingItems = (onSuccess, onError) => reviewId => {
  API.get("UsersAPI", `/reviews/${reviewId}/meetingitems`, {})
    .then(onSuccess)
    .catch(onError);
};

export const cloneReview = (onSuccess, onError) => reviewId => {
  const _onSuccess = onError ? onError : onErrorGlobal;
  API.post("UsersAPI", `/reviews/${reviewId}/clone`, {})
    .then(onSuccess)
    .catch(_onSuccess);
};

export const attendeeApologies = (onSuccess, onError) => (
  reviewId,
  attendeeId,
  apologies
) => {
  const _onSuccess = onError ? onError : onErrorGlobal;
  API.patch("UsersAPI", `/reviews/${reviewId}/apologies/${attendeeId}`, {
    body: { apologies }
  })
    .then(onSuccess)
    .catch(_onSuccess);
};

export const getScores = async params => {
  return await API.get("UsersAPI", "/reviews/scores", params);
};
