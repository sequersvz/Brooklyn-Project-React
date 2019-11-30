import React, { PureComponent } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";

class ModalRemoveUser extends PureComponent {
  render() {
    const {
      show,
      close,
      manageAccount,
      accountId,
      username,
      userToDelete
    } = this.props;
    return (
      <div>
        <Modal
          show={show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
            <h3> Confirm user deletion?</h3>
          </Modal.Header>

          <Modal.Footer>
            <Button
              type="button"
              color="danger"
              onClick={() => {
                manageAccount(accountId, "delete", {
                  username: username,
                  cognitoId: userToDelete
                });
              }}
            >
              Delete
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

export default ModalRemoveUser;
