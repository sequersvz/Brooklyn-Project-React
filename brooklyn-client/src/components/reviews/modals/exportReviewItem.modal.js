import React, { useState } from "react";
import PdfReportReview from "../../pdf-export/index";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AgendaFilesTable from "../AgendaFilesTable";
import DownloadModal from "../../meeting-organiser/modals/downloadModal";

function PdfExportModal(props) {
  const [showExport, setShowExport] = useState({ underCheckpoint: true });
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    show,
    items,
    vendor,
    attendees,
    reviewData,
    editReview,
    accountLogo,
    reviewDate,
    categoryNAME,
    checkpointName,
    getAttachments,
    handlerItemReview,
    getItemreviewByReviewId,
    getItemreviewByCategoryId,
    handleChangeDisableExport
  } = props;
  const handlerInputChange = async event => {
    handleChangeDisableExport(true);
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    if (value === "underCategory") {
      await getItemreviewByCategoryId();
    } else if (value === "underReview") {
      await getItemreviewByReviewId();
    } else {
      handleChangeDisableExport(false);
    }

    setShowExport({
      [value]: value in showExport ? !showExport[value] : true
    });
  };

  const close = () => {
    setShowExport({
      ...showExport,
      underCheckpoint: true
    });
    handleChangeDisableExport(true);
    props.close();
  };

  const openModalStateChanges = () => {
    setShowExport({
      ...showExport,
      underCheckpoint: true
    });
  };

  const getSelectedItems = items => {
    let itemsSelected = Object.keys(showExport)[0];
    let _items, files;
    _items =
      itemsSelected && items[itemsSelected] && items[itemsSelected].items
        ? items[itemsSelected].items
        : [];
    files =
      _items && _items.length > 0
        ? _items.reduce((allFiles, item) => {
            let reviewItemFiles = item.files.map(file => {
              return {
                ...file,
                categoryCheckpoint: `${item.categoryName} / ${
                  item.checkpointName
                }`
              };
            });
            return allFiles.concat(reviewItemFiles);
          }, [])
        : [];
    return { items: _items, files };
  };

  const handleTabChange = (_, tab) => {
    if (selectedTab !== tab) setSelectedTab(tab);
  };

  const selectedItems = getSelectedItems(items);
  let _items = selectedItems.items;
  let files = selectedItems.files;
  const handlerExport = {
    reviewData,
    showExport: showExport,
    vendorLogo: vendor.logo !== null ? vendor.logo : undefined,
    accountLogo: accountLogo ? accountLogo : undefined,
    nextReviewDate: reviewDate,
    categoryNAME,
    checkpointName,
    vendor,
    vendorName: vendor.name,
    items: _items,
    handlerItemReview
  };
  const title = "Download Agenda";

  const renderBody = ({ isLoading, htmlString }) => (
    <div>
      <div
        style={{
          marginBottom: "20px",
          borderStyle: "solid",
          borderWidth: "thin",
          padding: "12px",
          borderColor: "#683364"
        }}
      >
        <div className="form-check form-check-radio">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios2"
              value="underCheckpoint"
              onChange={handlerInputChange}
              defaultChecked={true}
            />
            This Checkpoint and expand all Review items
            <span className="circle">
              <span className="check" />
            </span>
          </label>
        </div>
        <div className="form-check form-check-radio">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios2"
              value="underCategory"
              onChange={handlerInputChange}
            />
            All Checkpoints under this category
            <span className="circle">
              <span className="check" />
            </span>
          </label>
        </div>
        <div className="form-check form-check-radio">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios2"
              value="underReview"
              onChange={handlerInputChange}
            />
            All Categories, All Checkpoints
            <span className="circle">
              <span className="check" />
            </span>
          </label>
        </div>
      </div>

      <AppBar position="static" color="default">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="PDF Export" />
          <Tab label="Files Export" />
        </Tabs>
      </AppBar>

      {selectedTab === 0 && (
        <div
          style={{
            display: Object.keys(showExport).length > 0 ? "block" : "none"
          }}
        >
          <PdfReportReview {...{ htmlString, isLoading }} />
        </div>
      )}
      {selectedTab === 1 && (
        <AgendaFilesTable
          files={files}
          getFile={file => getAttachments(file)}
        />
      )}
    </div>
  );
  return (
    <DownloadModal
      {...{
        show,
        close,
        title,
        attendees,
        renderBody,
        editReview,
        handlerExport,
        onShow: openModalStateChanges,
        showButtons: !selectedTab
      }}
    />
  );
}

export default React.memo(PdfExportModal);
