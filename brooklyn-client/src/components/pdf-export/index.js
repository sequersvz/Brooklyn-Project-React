import React from "react";
import renderHTML from "react-render-html";
import { LoadingSpinner } from "../loading-spinner";
const PdfReportReview = ({ isLoading, htmlString }) => {
  if (isLoading) return <LoadingSpinner />;
  return <div>{renderHTML(htmlString)}</div>;
};

export default React.memo(PdfReportReview);
