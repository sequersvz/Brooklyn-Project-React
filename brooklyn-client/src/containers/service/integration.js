import { encode } from "base-64";
import { ServiceNow } from "../../config/config";

const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

const getMaxLimitOfObject = async url => {
  return await fetch(`${url}?sysparm_query=vendor%3Dtrue&sysparm_limit=1`, {
    headers
  }).then(resp => resp.headers.get("X-Total-Count"));
};

const rg = new RegExp(/^.+.com$/g);

const validUrl = url => url.replace(rg, `${url}/`);

export const getObjetsFromApi = (onSuccess, onError) => async (
  url,
  user,
  password
) => {
  url = `${validUrl(url)}${ServiceNow.apiName}${ServiceNow.tableName}`;
  headers.append("Authorization", `Basic ${encode(`${user}:${password}`)}`);
  let max = await getMaxLimitOfObject(url);
  return await fetch(
    `${url}?sysparm_query=vendor%3Dtrue&sysparm_limit=${max}`,
    {
      headers
    }
  )
    .then(resp => resp.json())
    .then(onSuccess)
    .catch(onError);
};
