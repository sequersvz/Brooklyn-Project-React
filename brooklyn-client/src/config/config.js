module.exports = {
  urlApi: process.env.REACT_APP_API_URL,
  mockup: process.env.REACT_APP_MOCKUP,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  baseUrlUploads:
    "https://s3.eu-west-2.amazonaws.com/" +
    process.env.REACT_APP_ATTACHMENTS_BUCKET +
    "/public/",
  host: window.location.protocol + "//" + window.location.hostname,

  scoreNames: ["Quite poorly", "Not great", "Pretty Well", "Very Well"],

  //lo dejo para probar
  ServiceNow: {
    urlBase: "https://dev39203.service-now.com/",
    apiName: "api/now/table/",
    tableName: "core_company",
    auth: {
      user: "admin",
      password: "BrooklynNow123"
    }
  }
};
