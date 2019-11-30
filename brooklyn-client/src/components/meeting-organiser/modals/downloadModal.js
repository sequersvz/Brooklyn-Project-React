import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import PdfReportReview from "../../pdf-export/index";
import { getPdf } from "../../pdf-export/create-pdf";
import { getHtml } from "../../../containers/service/pdf";
function DownloadModal({
  show,
  close,
  title,
  onShow,
  handlerExport,
  showButtons = true,
  editReview,
  renderBody
}) {
  if (!show) {
    return null;
  }

  const [htmlString, setHtmlString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {
    isMinute,
    isAgenda,
    reviewData,
    showExport,
    handlerItemReview: { categoryId, checkpointId } = {}
  } = handlerExport;
  const reviewId = reviewData.id;
  const downloadPDF = pdf => {
    let a = document.createElement("a");
    a.href = "data:application/octet-stream;base64," + pdf;
    a.download = "summary.pdf";
    a.click();
  };

  const downloadAgenda = async () => {
    editReview && editReview(reviewId, { agendaDownloaded: new Date() });
    const pdf = await getPdf({
      html: htmlString
    });
    downloadPDF(pdf);
  };

  const downloadMinutes = async () => {
    const pdf = await getPdf({
      html: htmlString
    });
    downloadPDF(pdf);
  };

  const handleOnClick = () => {
    setIsExporting(true);
    try {
      if (isMinute) downloadMinutes();
      else downloadAgenda();
    } catch (error) {
      console.error("Error", error);
      setIsExporting("error");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(
    () => {
      const getHtmlString = async () => {
        setIsLoading(true);
        try {
          const htmlString = await getHtml({
            isMinute,
            isAgenda,
            reviewId,
            showExport,
            categoryId,
            checkpointId
          });
          setHtmlString(htmlString);
        } catch (error) {
          setHtmlString(
            "<p>Error Processing PDF, please check your network connection and try again</p>"
          );
          setIsExporting("error");
          console.error("Error", error);
        } finally {
          setIsLoading(false);
        }
      };
      if (reviewData && reviewData.id) getHtmlString();
    },
    [reviewData, isMinute, showExport]
  );
  return (
    <div>
      <Modal
        show={show}
        onShow={onShow || undefined}
        bsSize="large"
        onHide={close}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
          <h3>{title}</h3>
        </Modal.Header>
        <Modal.Body>
          <GridItem xs={12} sm={12} md={12}>
            {renderBody ? (
              renderBody({ htmlString, isLoading })
            ) : (
              <PdfReportReview {...{ htmlString, isLoading }} />
            )}
          </GridItem>
        </Modal.Body>
        <Modal.Footer>
          {!showButtons ? null : (
            <>
              <Button
                type="button"
                color="success"
                onClick={handleOnClick}
                disabled={!!isExporting || isLoading}
              >
                {isExporting === "error"
                  ? "Error Processing"
                  : isExporting
                    ? "Processing"
                    : "Download"}
              </Button>
              <Button type="button" color="warning" onClick={close}>
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default React.memo(DownloadModal);
