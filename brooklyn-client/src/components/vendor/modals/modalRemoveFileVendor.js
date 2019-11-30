import React, { PureComponent } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import LinearProgress from "@material-ui/core/LinearProgress";

class ModalRemoveFileVendor extends PureComponent {
  render() {
    const { show, close, removeFile, vendor, removing } = this.props;

    return (
      <div>
        <Modal
          show={show}
          onHide={() => {
            if (!removing) {
              close();
            }
          }}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
            <h3> Confirm file deletion?</h3>
          </Modal.Header>
          {removing && <LinearProgress />}
          <Modal.Footer>
            <Button
              disabled={removing}
              type="button"
              color="danger"
              onClick={e => {
                e.preventDefault();
                removeFile(vendor.id);
              }}
            >
              {removing ? "Deleting..." : "Delete"}
            </Button>
            <Button
              disabled={removing}
              type="button"
              color="warning"
              onClick={e => {
                e.preventDefault();
                close();
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ModalRemoveFileVendor;
