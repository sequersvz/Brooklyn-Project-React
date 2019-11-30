import React, { useState } from "react";
import { Row, Col, Grid } from "react-bootstrap";
import Dropzone from "../../../dropzone";
import FileTable from "../../../vendor/tables/fileTable";
import {
  addKeyProcessFiles,
  removeKeyProcessFile,
  getKeyProcessFile
} from "../../../../containers/service/keyprocess";
import ModalRemoveFile from "../../../vendor/modals/modalRemoveFileVendor";
import Alert from "../../../snackbar-alert";

const RiskAttachments = ({
  files = [],
  id,
  concatKeyProcessFiles,
  filterKeyProcessFile
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
              <p className="itemAlign">Files</p>
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
                  getKeyProcessFile(item);
                }}
                labelNotItems={"No files attached to Keyprocess record"}
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
                const uploadedFiles = await addKeyProcessFiles({
                  files,
                  keyprocessId: id, // keyprocessId
                  setUploadProgress: ({ progress, fileNumber }) => {
                    setUploadProgress(progress);
                    setFileCount(`${fileNumber}/${files.length}`);
                  }
                });
                concatKeyProcessFiles(uploadedFiles);
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
            const removedFile = await removeKeyProcessFile({
              keyprocessId: id,
              fileId: fileToRemove
            });
            filterKeyProcessFile(removedFile.id);
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
