import { Analytics, Auth, Signer } from "aws-amplify";
import moment from "moment";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { getPastedImage } from "./containers/service";
import axios from "axios";
import config from "./config/config";
import urlLib from "url";

let credentials = undefined;

const setCredentials = creds => (credentials = creds);

export const sendPinpoint = (user, pathname) =>
  Analytics.record({
    name: "brooklyn-page-view",
    attributes: {
      user_email: user.attributes["email"],
      page: pathname
    }
  });

export const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getDateFormat = date => moment(date).format("LL");

export const makeCancelable = promise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

export const getFileNameFromUrl = url => {
  if (!url) return null;
  let fileName = url
    .split("/")
    .reverse()
    .slice(0, 1)[0];

  return {
    // with numbers: 1234567890.file.ext
    original: fileName,
    // file.ext
    pretty: fileName
      .split(".")
      .slice(1)
      .join(".")
  };
};

export const getIconFromFileName = fileName => {
  const ext = fileName
    .split(".")
    .reverse()
    .slice(0, 1)
    .join("")
    .toLowerCase();
  let iconName;

  if (ext === "pdf") {
    iconName = "faFilePdf";
  } else if (ext === "csv") {
    iconName = "faFileCsv";
  } else if (["ppt", "pptx"].includes(ext)) {
    iconName = "faFilePowerpoint";
  } else if (["doc", "docx", "odt"].includes(ext)) {
    iconName = "faFileWord";
  } else if (["xls", "xlsx"].includes(ext)) {
    iconName = "faFileExcel";
  } else if (["jpeg", "jpg", "png", "bmp", "gif", "tiff"].includes(ext)) {
    iconName = "faFileImage";
  } else if (["zip", "rar"].includes(ext)) {
    iconName = "faFileArchive";
  } else if (ext === "mp4") {
    iconName = "faFileVideo";
  } else if (ext === "mp3") {
    iconName = "faFileAudio";
  } else {
    iconName = "faFile";
  }
  return icons[iconName];
};

export const getColorFromScore = score => {
  if (score >= 8) {
    return "#5cb80a"; // green between 8-10
  }
  if (score >= 6) {
    return "#92a80a"; // light green between 6-7.9
  }
  if (score >= 4) {
    return "#ffd800"; // yellow between 4-5.9
  }
  if (score >= 2) {
    return "#d97c0a"; // orange between 2-3.9
  }
  return "#f55a0a"; // red between 0-1.9
};

export const getPastedImagesWithText = async text => {
  if (text) {
    let newText = text;
    let textToFind = `src="`;
    let amzHeader = `SignedHeaders=host"`;
    let regex = new RegExp(textToFind, "gi");
    let result,
      indices = [];
    while ((result = regex.exec(text))) {
      indices.push(result.index);
    }
    if (indices.length > 0) {
      let count = 0;
      for await (let indice of indices) {
        let startIndex = indice + textToFind.length;
        let str = text.slice(startIndex, -1);
        let j = str.indexOf(amzHeader);
        let endIndex = j + amzHeader.length + (count > 0 ? startIndex : 0);
        let substr = text.slice(indice, endIndex);
        let endIndexUri = substr.indexOf("?X-Amz-Algorithm");
        let uri = substr.slice(textToFind.length, endIndexUri);
        let image = await getPastedImage(uri);
        newText =
          text.substring(0, startIndex) +
          image +
          text.substring((count > 0 ? 0 : startIndex) + endIndex - 1);
        count++;
      }
    }
    return newText;
  }
};
export const formatToUnits = (number, precision) => {
  const abbrev = ["", "k", "m", "b", "t"];
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(number)) / 3);
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1));
  const suffix = abbrev[order];

  return +(number / Math.pow(10, order * 3)).toFixed(precision) + suffix;
};

export const parseSelectedFilters = filters => {
  return Object.keys(filters)
    .filter(filter => filter !== "activity")
    .reduce(
      (acc, currentFilter) => ({
        ...acc,
        [currentFilter]: (filters[currentFilter] || []).map(
          ({ value }) => value
        )
      }),
      {}
    );
};

export const signedRequest = async (
  endpoint,
  { queryStringParameters, ...options }
) => {
  if (!credentials) {
    const userCredentials = await Auth.currentCredentials();
    setCredentials(userCredentials);
  } else {
    try {
      const noop = () => "noop";
      const expiredCredentials =
        ((credentials || {}).expireTime || { getTime: noop }).getTime() <
        new Date().getTime();
      if (expiredCredentials) {
        const user = await Auth.currentAuthenticatedUser();
        const currentSession = await Auth.currentSession();
        const refreshToken = currentSession.getRefreshToken();
        await new Promise(resolve => {
          user.refreshSession(refreshToken, async err => {
            if (err) {
              console.log(err);
            } else {
              const newCognitoCredentials = await Auth.currentUserCredentials();
              setCredentials(newCognitoCredentials);
              return resolve();
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  const region = process.env.REACT_APP_AWS_REGION;
  const service = "execute-api";
  let request = {
    method: options.method || "GET",
    region,
    service,
    url: `${config.urlApi}/users${endpoint}`,
    ...options
  };

  //eslint-disable-next-line
  const { search, ...parsedUrl } = urlLib.parse(
    `${config.urlApi}/users${endpoint}`,
    true,
    true
  );

  request.url = urlLib.format({
    ...parsedUrl,
    query: {
      ...parsedUrl.query,
      ...(queryStringParameters || {})
    }
  });

  const urlParts = request.url.split("/");

  const creds = {
    secret_key: credentials.secretAccessKey,
    access_key: credentials.accessKeyId,
    session_token: credentials.sessionToken
  };
  let signedRequest = Signer.sign(
    {
      ...request,
      host: urlParts[2],
      path: `/${urlParts.slice(3).join("/")}`
    },
    creds,
    {
      region,
      service
    }
  );

  delete signedRequest.headers["Host"];
  delete signedRequest.headers["host"];
  delete signedRequest.headers["Content-Length"];

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios(signedRequest);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
