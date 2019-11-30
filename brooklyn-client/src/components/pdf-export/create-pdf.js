import { API } from "aws-amplify";

import { getHtml } from "../../containers/service/pdf";

const getPdf = async options => {
  let htmlTemplate = "";
  if ("html" in options) {
    htmlTemplate = options.html;
  } else {
    htmlTemplate = await getHtml(options);
  }
  const pdfString = await convertHtmlToPdf(htmlTemplate);
  return new Promise(resolve => {
    resolve(pdfString);
  });
};
const convertHtmlToPdf = async htmlTemplate => {
  const buffer = new Buffer.from(htmlTemplate);
  const htmlBase64Template = buffer.toString("base64");
  const options = {
    body: { htmlBase64: htmlBase64Template }
  };
  const response = await API.post("PdfLambda", "/", options);

  let body = JSON.parse(response.body);
  let pdfBase64 = body.pdfBase64;
  return pdfBase64;
};

export { getPdf, convertHtmlToPdf };
