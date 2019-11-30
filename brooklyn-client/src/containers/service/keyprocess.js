import { API, Storage } from "aws-amplify";
import { baseUrlUploads } from "../../config/config";
import { getFileNameFromUrl } from "../../Utils";

export const removeKeyProcessFile = async ({ keyprocessId, fileId }) => {
  try {
    const fileRemoved = await API.del(
      "UsersAPI",
      `/keyprocess/${keyprocessId}/file/${fileId}`
    );
    const fileName = getFileNameFromUrl(fileRemoved.path);
    await Storage.remove(fileName.original);
    return fileRemoved;
  } catch (error) {
    console.log(error);
  }
};

export const addKeyProcessFiles = async ({
  files,
  keyprocessId,
  setUploadProgress
}) => {
  try {
    const timestamp = Date.now().toString();
    const promises = files.reduce(async (acc, file, index) => {
      const result = await acc;
      const name = `${timestamp}.${file.name}`;
      const fileName = `uploads/${name}`;
      const fileResponse = await Storage.put(fileName, file, {
        contentType: file.type,
        progressCallback: ({ total, loaded }) => {
          if (total > 0 && total >= loaded && setUploadProgress) {
            const progress = Math.floor(
              (loaded * 100) / total / files.length +
                (100 / files.length) * index
            );
            setUploadProgress({ progress, fileNumber: index + 1 });
          }
        }
      });
      return Promise.resolve(
        result.concat({ path: baseUrlUploads + fileResponse["key"] })
      );
    }, Promise.resolve([]));

    const filesUploaded = await promises;

    const apiResponse = await API.post(
      "UsersAPI",
      `/keyprocess/${keyprocessId}/files`,
      {
        body: { path: filesUploaded }
      }
    );
    return apiResponse;
  } catch (error) {
    console.log(error);
  }
};

export const getKeyProcessFile = async fileName => {
  try {
    const file = await Storage.get(`uploads/${fileName}`);
    window.open(file);
  } catch (error) {
    console.log(error);
  }
};
