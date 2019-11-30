import { getFileNameFromUrl } from "../../Utils.js";
import { Storage } from "aws-amplify";
import { baseUrlUploads } from "../../config/config";

export const getLogo = url => getFile("logos", url);
export const putLogo = files => putFile("logos", files);

export const getPastedImage = url => getFile("pastedImages", url);
export const putPastedImage = files => putFile("pastedImages", files);

const getFile = async (source, url) => {
  const fileName = getFileNameFromUrl(url);
  return fileName
    ? Storage.get(`uploads/${source}/${fileName.original}`)
    : null;
};

const putFile = async (source, files) => {
  const file = files[0];
  const timestamp = Date.now().toString();
  const name = `${timestamp}.${file.name}`;
  const fileName = `uploads/${source}/${name}`;
  await Storage.put(fileName, file, { contentType: file.type });
  return baseUrlUploads + fileName;
};
