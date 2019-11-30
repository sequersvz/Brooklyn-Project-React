import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";

class ModalDeleteReview extends React.Component {
  render() {
    const { deleteReview, closeModal, show } = this.props;
    return (
      <Modal
        show={show}
        onHide={() => {
          closeModal("showModalDeleteReview");
        }}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
          <h3> Are you sure you want to delete this review?</h3>
        </Modal.Header>

        <Modal.Footer>
          <Button
            type="button"
            color="danger"
            onClick={e => {
              e.preventDefault();
              deleteReview();
            }}
          >
            Delete
          </Button>
          <Button
            type="button"
            color="warning"
            onClick={e => {
              e.preventDefault();
              closeModal("showModalDeleteReview");
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalDeleteReview;
