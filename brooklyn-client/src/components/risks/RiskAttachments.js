import React, { useState } from "react";
import { Row, Col, Grid } from "react-bootstrap";
import Dropzone from "../dropzone";
import FileTable from "../vendor/tables/fileTable";
import {
  addRiskFiles,
  removeRiskFile,
  getRiskFile
} from "../../containers/service/risk";
import ModalRemoveFile from "../vendor/modals/modalRemoveFileVendor";
import Alert from "../snackbar-alert";

const RiskAttachments = ({
  files = [],
  id,
  concatRiskFiles,
  filterRiskFile
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setUploadProgress] = useState(0);
  const [fileCount, setFileCount] = useState("");
  const [removeModal, setRemoveModal] = useState(false);
  const [fileToRemove, setFileToRemove] = useState(0);
  const [removing, setRemoving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <Grid
      fluid
      style={{
        marginBottom: 30,
        padding: 30
      }}
    >
      <Row>
        <Col md={12}>
          <Row className="show-grid">
            <Col md={12}>
              <p className="itemAlign">Files added to risk record</p>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12} className="itemAlign">
              <FileTable
                files={files}
                handleOnDeleteClick={item => () => {
                  setFileToRemove(item);
                  setRemoveModal(true);
                }}
                handleOnFileClick={item => () => {
                  getRiskFile(item);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col md={12}>
          <Dropzone
            accept="all"
            style={{
              textAlign: "right",
              borderStyle: "none",
              minHeight: 40
            }}
            dropText="files"
            handleOnDrop={async files => {
              setUploading(true);
              try {
                const uploadedFiles = await addRiskFiles({
                  files,
                  id, // risk id
                  setUploadProgress: ({ progress, fileNumber }) => {
                    setUploadProgress(progress);
                    setFileCount(`${fileNumber}/${files.length}`);
                  }
                });
                concatRiskFiles({ id, files: uploadedFiles });
              } catch (error) {
                console.log(error);
              }
              setUploading(false);
              setUploadProgress(0);
              setFileCount("");
              setAlertMessage(`File${files.length > 1 ? "s" : ""} uploaded`);
              setShowAlert(true);
            }}
            uploadingMessage={`UPLOADING ${fileCount} (${progress}%)`}
            showUploadingMessage={uploading}
          />
        </Col>
      </Row>
      {removeModal && (
        <ModalRemoveFile
          show={removeModal}
          close={() => setRemoveModal(false)}
          removeFile={async () => {
            setRemoving(true);
            const removedFile = await removeRiskFile({
              risk: id,
              file: fileToRemove
            });
            filterRiskFile({ riskId: id, fileId: removedFile.id });
            setRemoveModal(false);
            setRemoving(false);
            setAlertMessage(`File removed`);
            setShowAlert(true);
          }}
          vendor={fileToRemove}
          removing={removing}
        />
      )}
      {showAlert && (
        <Alert
          open={showAlert}
          message={alertMessage}
          duration={3000}
          variant={"success"}
          handleClose={() => {
            setShowAlert(false);
          }}
        />
      )}
    </Grid>
  );
};

export default RiskAttachments;
