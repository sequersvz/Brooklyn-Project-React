import React, { PureComponent } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";

class ModalRemoveFile extends PureComponent {
  render() {
    const {
      show,
      handlerClick,
      objectName,
      closeModal,
      name,
      modalName,
      type
    } = this.props;

    return (
      <div>
        <Modal
          show={show}
          onHide={() => {
            closeModal(name);
          }}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
            {type === "leavePage" ? (
              <h3>This will take you to the selected review. Are you sure?</h3>
            ) : (
              <h3> Confirm {modalName} deletion</h3>
            )}
          </Modal.Header>
          {type === "leavePage" ? null : (
            <Modal.Body>
              <React.Fragment>
                Are you sure you want to delete the {modalName} with name:{" "}
                <strong>{objectName}</strong>?
              </React.Fragment>
            </Modal.Body>
          )}

          <Modal.Footer>
            <Button
              type="button"
              color={type ? "success" : "danger"}
              onClick={e => {
                e.preventDefault();
                handlerClick();
              }}
            >
              {type ? "Confirm" : "Delete"}
            </Button>
            <Button
              type="button"
              color="warning"
              onClick={e => {
                e.preventDefault();
                closeModal(name);
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

export default ModalRemoveFile;
