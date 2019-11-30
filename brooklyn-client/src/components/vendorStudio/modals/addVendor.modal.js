import React, { PureComponent } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/index";

class ModalAddVendor extends PureComponent {
  state = {
    error: ""
  };

  render() {
    const {
      show,
      close,
      addVendor,
      handleInputChange,
      name,
      isErrorName,
      showUploadingMessage,
      handleShowUploadingMessage,
      disableSaveButton,
      vendorFiles
    } = this.props;

    let vendor = this.props.vendor
      ? this.props.vendor
      : { name: "", edit: false };

    let vendorLogo = vendor.logo;
    let dropzoneRef;
    return (
      <div>
        <Modal
          show={show}
          onHide={close}
          onShow={this.openModalStateChanges}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
            <h3>New Vendor</h3>
          </Modal.Header>
          <Modal.Body>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="Name"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  name: "name",
                  value:
                    (typeof name !== "undefined" ? name : vendor.name) || "",
                  onChange: handleInputChange
                }}
                error={isErrorName}
              />
              <Dropzone
                accept="image/jpeg, image/png, image/jpeg"
                onDrop={accepted => {
                  if (accepted.length > 0) {
                    handleShowUploadingMessage(true);
                    return handleInputChange(accepted, vendor.id);
                  }
                  this.setState({
                    error: "Only jpeg, jpg and png images are permitted"
                  });
                  setTimeout(() => this.setState({ error: "" }), 3000);
                }}
                style={{
                  textAlign: "center",
                  borderStyle: "none",
                  minHeight: 40
                }}
                ref={node => {
                  dropzoneRef = node;
                }}
                className={"dropzone"}
                activeClassName={"dropzoneactive"}
                activeStyle={{ border: "#117ede solid 1px" }}
                disableClick={true} //desabilita el click
                minSize={150} //tamaño maximo del archivo permitido
              >
                <div
                  className="uploadingFragment"
                  style={{
                    display: !showUploadingMessage ? "none" : "block"
                  }}
                >
                  <p
                    style={{
                      textAlign: "center"
                    }}
                  >
                    <FontAwesomeIcon
                      spin
                      icon={faSpinner}
                      style={{
                        marginRight: 7
                      }}
                    />
                    UPLOADING...
                  </p>
                </div>
                <div
                  style={{
                    display: showUploadingMessage ? "none" : "block",
                    marginTop: 12
                  }}
                >
                  <center>
                    <img
                      style={{
                        marginBottom: 20,
                        display: !vendorLogo
                          ? !vendorFiles
                            ? "none"
                            : "block"
                          : "block"
                      }}
                      src={vendorFiles ? vendorFiles[0].preview : vendorLogo}
                      crossOrigin={"use-credentials"}
                      width={100}
                      alt="profile"
                    />
                  </center>
                  <span style={{ fontSize: 10, cursor: "pointer" }}>
                    Drop logo here or{" "}
                    <span
                      onClick={() => {
                        dropzoneRef.open();
                      }}
                      style={{ color: "blue" }}
                    >
                      upload from your computer
                    </span>
                  </span>
                </div>
                {this.state.error !== "" ? (
                  <p style={{ color: "red" }}>{this.state.error}</p>
                ) : null}
              </Dropzone>
            </GridItem>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              color="success"
              disabled={disableSaveButton ? true : false}
              onClick={() => {
                addVendor({
                  name: name,
                  logo: vendorFiles ? vendorFiles : ""
                });
              }}
            >
              Save
            </Button>
            <Button type="button" color="warning" onClick={close}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ModalAddVendor;
