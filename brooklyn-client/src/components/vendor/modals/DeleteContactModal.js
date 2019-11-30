import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import LinearProgress from "@material-ui/core/LinearProgress";

class DeleteContactModal extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { show, loading, error } = this.props;
    return (
      show !== nextProps.show ||
      loading !== nextProps.loading ||
      error !== nextProps.error
    );
  }
  render() {
    const { show, close, deleteContact, loading, error, contact } = this.props;
    return (
      <Modal show={show} onHide={close} aria-labelledby="contained-modal-title">
        <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
          <h3> Confirm contact deletion</h3>
        </Modal.Header>
        <Modal.Body>
          {loading && <LinearProgress />}
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>
              {typeof error === "boolean"
                ? "There was an error deleting the contact"
                : error}
            </p>
          )}
          <p style={{ marginTop: "10px" }}>
            Are you sure you want to delete the contact with name:{" "}
            <strong>{contact.name}</strong>?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            color="danger"
            onClick={() => deleteContact(contact)}
            disabled={loading}
          >
            Delete
          </Button>
          <Button
            type="button"
            color="warning"
            onClick={close}
            disabled={loading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DeleteContactModal;
