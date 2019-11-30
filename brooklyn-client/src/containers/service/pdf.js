import { API } from "aws-amplify";

export const getHtml = async ({
  reviewId,
  isAgenda,
  isMinute,
  showExport,
  categoryId,
  checkpointId
}) => {
  let query = getQuery({
    isAgenda,
    isMinute,
    showExport,
    checkpointId,
    categoryId
  });
  const response = await API.get(
    "UsersAPI",
    `/summary_export/html/${reviewId}${query}`,
    {}
  );
  const htmlString = response.html || "";
  return htmlString;
};

const getQuery = ({
  isAgenda,
  isMinute,
  showExport,
  categoryId,
  checkpointId
}) => {
  let query = "";
  if (isAgenda || isMinute) {
    let queryType = "?type=";
    queryType += isMinute ? "minutes" : isAgenda ? "agenda" : "";
    query = queryType;
  }
  if (!query && showExport) {
    let queryCategory = "?category=";
    if (showExport.underCategory) {
      queryCategory += categoryId;
    } else if (showExport.underCheckpoint) {
      queryCategory += categoryId + `&checkpoint=${checkpointId}`;
    } else {
      queryCategory = "";
    }
    query = queryCategory;
  }
  return query;
};
