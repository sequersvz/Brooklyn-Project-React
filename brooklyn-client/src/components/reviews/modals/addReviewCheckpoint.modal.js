import React, { PureComponent } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";

class AddReviewCheckpontModal extends PureComponent {
  render() {
    const {
      handleInputChange,
      addCheckpoint,
      close,
      show,
      checkpointName
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
            <h3> New Checkpoint</h3>
          </Modal.Header>
          <Modal.Body>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="name"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  name: "checkpointName",
                  value: checkpointName,
                  onChange: handleInputChange
                }}
              />
            </GridItem>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" color="success" onClick={addCheckpoint}>
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

export default AddReviewCheckpontModal;
