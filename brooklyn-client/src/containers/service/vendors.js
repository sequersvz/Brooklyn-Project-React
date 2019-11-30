import { API } from "aws-amplify";
import { getQueryParams } from "../containers.Utils";

export const getVendorsReports = async ({
  chart,
  filters = {},
  query = {}
}) => {
  const queryParams = getQueryParams()(filters);
  const queryStringParameters = {
    ...query,
    ...queryParams.queryStringParameters
  };
  return await API.get("UsersAPI", `/vendors/reports/${chart}`, {
    queryStringParameters
  });
};

export const getVendorsNames = async () => {
  const vendors = await API.get("UsersAPI", "/vendors");
  return (vendors || [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(vendor => ({ name: vendor.name, id: vendor.id }));
};

export const getVendorStakeholderInformation = async ({
  vendorId,
  options = {}
}) => {
  return await API.get(
    "UsersAPI",
    `/vendors/${vendorId}/reports/stakeholder`,
    options
  );
};
