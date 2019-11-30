import React, { PureComponent } from "react";
import { Modal, Col, Row } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 200
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

class AddReviewModal extends PureComponent {
  state = {
    open: {},
    error: ""
  };

  handleClick = name => {
    let thisOpen = {
      [name]: name in this.state.open ? !this.state.open[name] : true
    };
    let open = Object.assign({}, this.state.open, thisOpen);
    this.setState({ open });
  };

  render() {
    const {
      handleInputChange,
      close,
      show,
      itemTitle,
      itemDescription,
      checkpointId,
      item,
      nextReview,
      addReviewItem,
      classes,
      categories,
      checkpoints
    } = this.props;

    let checkpointNAME = null;
    if (typeof item !== "undefined" && typeof checkpoints !== "undefined") {
      let checkIndex = checkpoints.findIndex(
        check => item.checkpointId === check.id
      );
      if (checkIndex > 0) {
        checkpointNAME = checkpoints[checkIndex].name;
      }
    }
    return (
      <div>
        {typeof item !== "undefined" ? (
          <Modal
            show={show}
            onHide={() => {
              this.setState({ open: {} });
              return close();
            }}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header
              style={{ backgroundColor: "#5b2157", color: "white" }}
            >
              <h3> New Review Item </h3>
            </Modal.Header>
            <Modal.Body>
              <div style={{ display: this.state.error ? "block" : "none" }}>
                {this.state.error}
              </div>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Title"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    name: "title",
                    value: itemTitle
                      ? itemTitle
                      : typeof item !== "undefined"
                        ? item.title
                        : "",
                    onChange: handleInputChange
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Row>
                  <Col xs={6} sm={6} md={6}>
                    <CustomInput
                      labelText="Description"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        name: "description",
                        value: itemDescription
                          ? itemDescription
                          : typeof item !== "undefined"
                            ? item.description
                            : "",
                        onChange: handleInputChange
                      }}
                    />
                  </Col>
                  <Col xs={6} sm={6} md={6}>
                    <List component="nav" className={classes.root}>
                      <ListItem
                        button
                        onClick={() => this.handleClick("master")}
                      >
                        <ListItemText
                          primary={
                            checkpointNAME !== null
                              ? checkpointNAME
                              : "Select Checkpoint"
                          }
                        />
                        {this.state.open["master"] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Collapse
                        in={this.state.open["master"]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {categories ? (
                            <div>
                              {categories.map(cat => (
                                <div key={cat.id}>
                                  <ListItem
                                    button
                                    onClick={() => this.handleClick(cat.id)}
                                  >
                                    <ListItemText primary={cat.name} />
                                    {this.state.open[cat.id] ? (
                                      <ExpandLess />
                                    ) : (
                                      <ExpandMore />
                                    )}
                                  </ListItem>
                                  <Collapse
                                    in={this.state.open[cat.id]}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <List component="div" disablePadding>
                                      {checkpoints ? (
                                        <div>
                                          {checkpoints
                                            .filter(
                                              check =>
                                                check.categoryId === cat.id
                                            )
                                            .map(check => (
                                              <ListItem
                                                button
                                                className={classes.nested}
                                                key={check.id}
                                              >
                                                <ListItemText
                                                  primary={check.name}
                                                />
                                                <input
                                                  name={"checkpointId"}
                                                  type={"radio"}
                                                  value={check.id}
                                                  checked={
                                                    item.checkpointId ===
                                                    check.id
                                                      ? true
                                                      : false
                                                  }
                                                  onChange={e => {
                                                    this.handleClick("master");
                                                    this.handleClick(check.id);
                                                    handleInputChange(e);
                                                  }}
                                                />
                                              </ListItem>
                                            ))}
                                        </div>
                                      ) : null}
                                    </List>
                                  </Collapse>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </List>
                      </Collapse>
                    </List>
                  </Col>
                </Row>
              </GridItem>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                color="success"
                onClick={() => {
                  if (
                    item.checkpointId === null &&
                    typeof checkpointId === "undefined"
                  ) {
                    this.setState({ error: "Have to select a checkpoint" });
                  } else {
                    let checId =
                      typeof checkpointId !== "undefined"
                        ? checkpointId
                        : item.checkpointId;
                    addReviewItem(nextReview.id, checId, {
                      name:
                        typeof itemTitle !== "undefined"
                          ? itemTitle
                          : item.title,
                      description:
                        typeof itemDescription !== "undefined"
                          ? itemDescription
                          : item.description
                    });
                  }
                }}
              >
                Save
              </Button>
              <Button type="button" color="warning" onClick={close}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(AddReviewModal);
