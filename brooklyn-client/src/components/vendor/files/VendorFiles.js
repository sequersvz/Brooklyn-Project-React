import React, { useState, useEffect } from "react";
import ModalRemoveFileVendor from "../modals/modalRemoveFileVendor";
import { Row, Col, Grid } from "react-bootstrap";
import Dropzone from "../../dropzone";
import FileTable from "../tables/fileTable";
import { Storage } from "aws-amplify";
import { API } from "aws-amplify";
import {
  putAttachments as _putAttachments,
  delStorageAttachments
} from "../../../containers/service/itemreview";

export default function VendorFilesTab(props) {
  const { vendor, getVendorById } = props;
  const vendorId = vendor ? vendor.id : undefined;
  const [error, setError] = useState(null);
  const [reviewItems, setReviewItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState(null);
  const [showUploadingMessage, setShowUploadingMessage] = useState(false);

  const getItemreviewsAttachments = fileName => {
    Storage.get(`uploads/${fileName}`)
      .then(result => {
        window.open(result);
      })
      .catch(err => console.log(err));
  };

  const onError = error => {
    console.log(error);
    setError(error);
  };

  const handleOnFileClick = (fileName, vendor) => () => {
    if (vendor) {
      getAttachments(fileName);
    } else {
      getItemreviewsAttachments(fileName);
    }
  };

  const handleOnDeleteClick = (id, fileName) => () => {
    handleRemovefile(id, fileName);
    openModal();
  };
  const closeModal = () => setIsModalOpen(false);

  const openModal = () => setIsModalOpen(true);

  const getAttachments = fileName => {
    Storage.get(`uploads/${fileName}`)
      .then(result => {
        window.open(result);
      })
      .catch(onError);
  };

  const putAttachments = files =>
    _putAttachments(
      () => {
        getVendorById(vendorId);
      },
      () => {},
      addVendorFile
    )(files, vendorId);

  const addVendorFile = (path, vendorId) => {
    let options = {
      body: {
        path: `${path}`,
        vendorId
      }
    };
    let onSuccess = addVendorFileOnSuccess(vendorId);
    API.post("UsersAPI", `/itemreviews/files`, options)
      .then(onSuccess)
      .catch(onError);
  };

  const removeFileOnSuccess = vendorId => () => {
    closeModal();
    getVendorById(vendorId);
  };

  const removeFile = vendorId => {
    const { id, fileName } = fileToRemove;
    let onSuccess = removeFileOnSuccess(vendorId);
    API.del("UsersAPI", `/vendors/files/${id}`, {})
      .then(delStorageAttachments(fileName))
      .then(onSuccess)
      .catch(onError);
  };

  const onGetItemreviewsFilesSuccess = () => items => {
    let result = items.reduce((prevItem, item) => {
      let files = item.files.map(file => {
        file.date = item.date;
        file.reviewitemName = item.name;
        file.reviewId = item.reviewId;
        file.reviewName = item.reviewName;
        file.checkpointName = item.checkpointName;
        file.checkpointId = item.checkpointId;
        file.categoryName = item.categoryName;
        file.categoryId = item.categoryId;
        return file;
      });
      return prevItem.concat(files);
    }, []);
    setReviewItems(result);
  };

  const getItemreviewsFiles = async vendorId => {
    let onSuccess = onGetItemreviewsFilesSuccess();
    await API.get("UsersAPI", `/vendors/${vendorId}/reviews/itemreviews/files`)
      .then(onSuccess)
      .catch(onError);
  };

  const addVendorFileOnSuccess = vendorId => {
    setShowUploadingMessage(false);
    getVendorById(vendorId);
  };

  const handleOnDrop = event => {
    handleShowUploadingMessage(true);
    const vendorId = vendor.id;
    putAttachments(event, { vendorId });
  };

  const HandlerModalRemove = {
    show: isModalOpen,
    close: closeModal,
    removeFile,
    vendor
  };
  const handleShowUploadingMessage = value => setShowUploadingMessage(value);

  const handleRemovefile = (id, fileName) => setFileToRemove({ id, fileName });

  useEffect(
    () => {
      if (vendorId) {
        getItemreviewsFiles(vendorId);
      }
    },
    [vendorId, fileToRemove]
  );
  if (!vendor) return null;
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
              <p className="itemAlign">Files added to vendor record</p>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12} className="itemAlign">
              <FileTable
                files={vendor.files}
                handleOnDeleteClick={handleOnDeleteClick}
                handleOnFileClick={handleOnFileClick}
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
            dropText={"files"}
            error={error}
            handleOnDrop={handleOnDrop}
            showUploadingMessage={showUploadingMessage}
          />
        </Col>
        <Col md={12}>
          <Row className="show-grid">
            <Col md={12}>
              <p className="itemAlign">Files added to review item</p>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12} className="itemAlign">
              <FileTable
                type="reviewitem"
                files={reviewItems}
                handleOnFileClick={handleOnFileClick}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <ModalRemoveFileVendor {...HandlerModalRemove} />
    </Grid>
  );
}
