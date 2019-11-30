import { Storage } from "aws-amplify";
import { API } from "aws-amplify";
import { baseUrlUploads } from "../../config/config";

const allOnError = error => {
  console.log(error);
};

export const getItemreviews = (onSuccess, onError) => (reviewId, by) => {
  API.get("UsersAPI", `/reviews/${reviewId}/itemreviews${by}`, {})
    .then(onSuccess)
    .catch(onError);
};
const actions = ["recurring", "ready", "closed", "deferred"];
const validActionSend = (action, value) => {
  let actionsend = {
    closed: false,
    deferred: false,
    ready: false,
    open: false
  };
  if (actions.includes(action)) {
    if (action === "recurring") {
      return (actionsend = { [action]: !value });
    }
    actionsend[action] = true;
  }
  return actionsend;
};
export const actionReviewItem = (onSuccess, onError) => (
  item,
  action,
  value = null,
  options
) => {
  const mOptions = {
    body: { ...validActionSend(action, value), ...options }
  };

  API.patch("UsersAPI", `/itemreviews/${item.id}`, mOptions)
    .then(onSuccess)
    .catch(onError);
};

export const getAttachments = (onSuccess, onError) => fileName => {
  Storage.get(`uploads/${fileName}`)
    .then(onSuccess)
    .catch(onError);
};

export const delStorageAttachments = fileName => {
  return Storage.remove(`uploads/${fileName}`)
    .then(resp => {
      return resp;
    })
    .catch(allOnError);
};
export const delAttachments = (onSuccess, onError) => (
  itemreviewId,
  attachmentsId,
  fileName
) => {
  API.del("UsersAPI", `/itemreviews/${itemreviewId}/file/${attachmentsId}`, {})
    .then(delStorageAttachments(fileName))
    .then(onSuccess)
    .catch(onError);
};

export const putAttachments = (onSuccess, onError, callback) => async (
  files,
  reviewItemid,
  setUploadProgress
) => {
  const timestamp = Date.now().toString();
  files
    .reduce(async (prePromise, file) => {
      let putFiles = await prePromise;
      const name = `${timestamp}.${file.name}`;
      const fileName = `uploads/${name}`;
      const responses = await Storage.put(fileName, file, {
        contentType: file.type,
        progressCallback: ({ total, loaded }) => {
          if (total > 0 && total >= loaded && setUploadProgress) {
            const percentage = Math.floor((loaded * 100) / total);
            setUploadProgress(reviewItemid, percentage);
          }
        }
      })
        .then(async () => {
          await callback(fileName, reviewItemid);
        })
        .catch(onError);
      putFiles.push(responses);
      return putFiles;
    }, Promise.resolve([]))
    .then(() => {
      onSuccess(reviewItemid, false);
    })
    .catch(onError);
};

export const editItemreview = (onSuccess, onError) => (
  itemreviewId,
  properties
) => {
  let options = {
    body: properties
  };
  let succes = onSuccess(itemreviewId);
  API.patch("UsersAPI", `/itemreviews/${itemreviewId}`, options)
    .then(succes)
    .catch(onError);
};

export const addReviewitemFile = (onSuccess, onError) => (
  path,
  itemreviewId,
  reloadReviewitem = true
) => {
  let options = {
    body: {
      path: `${path.includes("http") ? "" : baseUrlUploads}${path}`
    }
  };
  let success = () => {};
  if (reloadReviewitem) {
    success = onSuccess;
  }
  API.post("UsersAPI", `/itemreviews/${itemreviewId}/file`, options)
    .then(success)
    .catch(onError);
};

export const sortItemreviews = (onSuccess, onError) => newSort => {
  let options = {
    body: {
      newsort: newSort
    }
  };
  let success = onSuccess(newSort);

  API.post("UsersAPI", `/itemreviews/sort`, options)
    .then(success)
    .catch(onError);
};

export const deleteReviewItem = (onSuccess, onError) => async item => {
  try {
    await API.del("UsersAPI", `/itemreviews/${item.id}`, {});
    if (item.itemreviewParent) {
      await API.patch("UsersAPI", `/itemreviews/${item.itemreviewParent}`, {
        body: { actioned: null }
      });
    }
    onSuccess();
  } catch (error) {
    onError(error);
  }
};

export const addReviewItem = (onSuccess, onError) => (
  reviewId,
  checkpoint,
  properties
) => {
  if (!reviewId) return;
  let options = {
    body: properties
  };
  let url = "";
  url = `/itemreviews`;
  if (checkpoint) {
    url = `/reviews/${reviewId}/checkpoint/${checkpoint}/itemreviews`;
  }
  API.post("UsersAPI", url, options)
    .then(onSuccess)
    .catch(onError);
};

export const getCheckpoints = (onSuccess, onError) => {
  API.get("UsersAPI", `/checkpoints`, {})
    .then(onSuccess)
    .catch(onError);
};

export const editReviewItemName = async (id, props) => {
  const options = { body: props };
  return await API.patch("UsersAPI", `/itemreviews/${id}`, options);
};

export const addRisk = async item => {
  return await API.post("UsersAPI", `/itemreviews/${item.id}/risk`, {});
};

export const getActionItemData = async query => {
  return await API.get("PublicAPI", `/action-item${query}`);
};
export const markActionItemAsDone = async query => {
  return await API.post("PublicAPI", `/action-item/mark-as-done${query}`, {
    headers: { "Content-Type": "application/json" }
  });
};

export const downloadActionLogCsv = async () => {
  try {
    const csv = await API.get("UsersAPI", `/vendors/reports/action-log/csv`);
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + csv);
    element.setAttribute("download", "action-log-report.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } catch (error) {
    console.log(error);
  }
};
