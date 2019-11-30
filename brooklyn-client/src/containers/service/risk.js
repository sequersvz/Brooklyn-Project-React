import { API, Storage } from "aws-amplify";
import { baseUrlUploads } from "../../config/config";
import { getFileNameFromUrl } from "../../Utils";

export const editRisk = async ({ id, ...data }) => {
  return await API.patch("UsersAPI", `/risks/${id}`, {
    body: data
  });
};

export const addRisk = async data => {
  return await API.post("UsersAPI", `/risks`, { body: data });
};

export const getRiskStatuses = async () => {
  return await API.get("UsersAPI", "/risks/status", {});
};

export const addRiskLabel = async riskLabel => {
  return await API.post("UsersAPI", `/risks/labels`, {
    body: riskLabel
  });
};

export const deleteRiskLabel = async riskLabelId => {
  return await API.del("UsersAPI", `/risks/labels/${riskLabelId}`, {});
};

export const getRisksLabels = async () => {
  return await API.get("UsersAPI", `/risks/labels`, {});
};

export const addTopRisk = async topRisk => {
  return await API.post("UsersAPI", `/risks/topRisks`, {
    body: topRisk
  });
};
export const deleteTopRisk = async topRiskId => {
  return await API.del("UsersAPI", `/risks/topRisks/${topRiskId}`, {});
};

export const getTopRisks = async () => {
  return await API.get("UsersAPI", `/risks/topRisks`, {});
};

export const addRiskTreatment = async riskTreatment => {
  return await API.post("UsersAPI", `/risks/treatments`, {
    body: riskTreatment
  });
};

export const deleteRiskTreatment = async riskTreatmentId => {
  return await API.del("UsersAPI", `/risks/treatments/${riskTreatmentId}`, {});
};

export const getRisksTreatments = async () => {
  return await API.get("UsersAPI", `/risks/treatments`, {});
};

export const addRiskLifeCycle = async riskLifeCycle => {
  return await API.post("UsersAPI", `/risks/lifeCycles`, {
    body: riskLifeCycle
  });
};

export const deleteRiskLifeCycle = async riskLifeCycleId => {
  return await API.del("UsersAPI", `/risks/lifeCycles/${riskLifeCycleId}`, {});
};

export const getRisksLifeCycles = async () => {
  return await API.get("UsersAPI", `/risks/lifeCycles`, {});
};

export const addRiskFiles = async ({ files, id, setUploadProgress }) => {
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

    const apiResponse = await API.post("UsersAPI", `/risks/${id}/files`, {
      body: filesUploaded
    });
    return apiResponse;
  } catch (error) {
    console.log(error);
  }
};

export const removeRiskFile = async ({ risk, file }) => {
  try {
    const fileRemoved = await API.del(
      "UsersAPI",
      `/risks/${risk}/files/${file}`
    );
    const fileName = getFileNameFromUrl(fileRemoved.path);
    await Storage.remove(fileName.original);
    return fileRemoved;
  } catch (error) {
    console.log(error);
  }
};

export const getRiskFile = async fileName => {
  try {
    const file = await Storage.get(`uploads/${fileName}`);
    window.open(file);
  } catch (error) {
    console.log(error);
  }
};

export const downloadRiskLogCsv = async () => {
  try {
    const csv = await API.get("UsersAPI", `/vendors/reports/risk-log/csv`);
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + csv);
    element.setAttribute("download", "risk-log-report.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } catch (error) {
    console.log(error);
  }
};
