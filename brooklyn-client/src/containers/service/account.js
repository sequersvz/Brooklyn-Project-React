import { API } from "aws-amplify";

export const changeCompanyName = async name => {
  const accountId = 1;
  return await API.patch("UsersAPI", `/accounts/${accountId}`, {
    body: { name }
  });
};

export const editAccount = async (accountId, properties) => {
  let options = {
    body: properties
  };
  return await API.patch("UsersAPI", `/accounts/${accountId}`, options);
};

export const getAccount = async accountId => {
  return await API.get("UsersAPI", `/accounts/${accountId}`, {});
};

export const getSearchKitData = async () => {
  return await API.get("UsersAPI", "/accounts/1/search-kit", {});
};
