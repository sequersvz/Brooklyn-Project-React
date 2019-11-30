import React, { PureComponent } from "react";
import { Modal, Col, Row } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import DatePicker from "material-ui-pickers/DatePicker";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";

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
    open: {}
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
      handleDateChange,
      date,
      vendors,
      addInsights,
      insightStatus,
      checkpoints,
      categories,
      classes,
      item,
      editInsight
    } = this.props;

    const {
      itemTitle,
      itemImpact,
      itemValidatedAmount,
      itemOptimisedAmount,
      itemDescription,
      itemTargetAmount,
      itemFindingAmount,
      itemPctLikelihoodPessimistic,
      itemPctLikelihoodMiddle,
      itemPctLikelihoodOptimistic,
      itemCheckpointId,
      itemVendorId,
      itemInsightstatusId
    } = this.props;

    let checkpointNAME = null;
    if (
      typeof item !== "undefined" &&
      item !== null &&
      typeof checkpoints !== "undefined"
    ) {
      let checkIndex = checkpoints.findIndex(
        check => item.checkpointId === check.id
      );
      if (checkIndex > -1) {
        checkpointNAME = checkpoints[checkIndex].name;
      }
    }
    return (
      <div>
        <Modal
          show={show}
          onHide={() => {
            this.setState({ open: {} });
            return close();
          }}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header style={{ backgroundColor: "#5b2157", color: "white" }}>
            <h3> {item !== null ? "Edit Insight" : "New Insight"} </h3>
          </Modal.Header>
          <Modal.Body>
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
                    : item !== null
                      ? item.title
                      : itemTitle,
                  onChange: handleInputChange
                }}
              />
              <CustomInput
                labelText="Description"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  name: "description",
                  value: itemDescription
                    ? itemDescription
                    : item !== null
                      ? item.description
                      : itemDescription,
                  onChange: handleInputChange
                }}
              />
              {vendors ? (
                <select
                  name={"vendorId"}
                  style={{ padding: 10, width: "100%" }}
                  onChange={handleInputChange}
                >
                  <option>Select One Vendor</option>
                  {vendors.map(vendor => (
                    <option
                      key={vendor.id}
                      value={vendor.id}
                      selected={item !== null && item.vendorId === vendor.id}
                    >
                      {vendor.name}
                    </option>
                  ))}
                </select>
              ) : null}
              <Row>
                <Col xs={6} sm={6} md={6}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      value={date}
                      onChange={handleDateChange}
                      format={"DD-MM-YYYY"}
                      style={{ marginTop: 15, width: "100%" }}
                      autoOk={true}
                      ref={node => {
                        if (node !== null) {
                          node.setState({ open: false });
                        }
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Col>

                <Col xs={6} sm={6} md={6}>
                  {insightStatus ? (
                    <select
                      name={"insightstatusId"}
                      style={{ marginTop: 5, padding: 10, width: "100%" }}
                      onChange={handleInputChange}
                    >
                      {insightStatus.map(status => (
                        <option
                          key={status.id}
                          value={status.id}
                          selected={
                            item !== null && item.insightstatusId === status.id
                          }
                        >
                          {status.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Impact"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "impact",
                      value: itemImpact
                        ? itemImpact
                        : item !== null
                          ? item.impact
                          : itemImpact,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
                <Col xs={6} sm={6} md={6}>
                  <List component="nav" className={classes.root}>
                    <ListItem button onClick={() => this.handleClick("master")}>
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
                                            check => check.categoryId === cat.id
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
                                                onChange={handleInputChange}
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
              <Row>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Target Amount"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "targetAmount",
                      value: itemTargetAmount
                        ? itemTargetAmount
                        : item !== null
                          ? item.targetAmount
                          : itemTargetAmount,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Finding Amount"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "findingAmount",
                      value: itemFindingAmount
                        ? itemFindingAmount
                        : item !== null
                          ? item.findingAmount
                          : itemFindingAmount,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Validated Amount"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "validatedAmount",
                      value: itemValidatedAmount
                        ? itemValidatedAmount
                        : item !== null
                          ? item.validatedAmount
                          : itemValidatedAmount,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Optimised Amount"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "optimisedAmount",
                      value: itemOptimisedAmount
                        ? itemOptimisedAmount
                        : item !== null
                          ? item.optimisedAmount
                          : itemOptimisedAmount,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Pct Likelihood Pessimistic"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "pctLikelihoodPessimistic",
                      value: itemPctLikelihoodPessimistic
                        ? itemPctLikelihoodPessimistic
                        : item !== null
                          ? item.pctLikelihoodPessimistic
                          : itemPctLikelihoodPessimistic,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Pct Likelihood Middle"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "pctLikelihoodMiddle",
                      value: itemPctLikelihoodMiddle
                        ? itemPctLikelihoodMiddle
                        : item !== null
                          ? item.pctLikelihoodMiddle
                          : itemPctLikelihoodMiddle,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={6} md={6}>
                  <CustomInput
                    labelText="Pct Likelihood Optimistic"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "pctLikelihoodOptimistic",
                      value: itemPctLikelihoodOptimistic
                        ? itemPctLikelihoodOptimistic
                        : item !== null
                          ? item.pctLikelihoodOptimistic
                          : itemPctLikelihoodOptimistic,
                      onChange: handleInputChange
                    }}
                  />
                </Col>
              </Row>
            </GridItem>
          </Modal.Body>
          <Modal.Footer>
            {item !== null ? (
              <Button
                type="button"
                color="success"
                onClick={() => {
                  this.setState({ open: {} });
                  return editInsight(
                    item.id,
                    Object.assign(
                      {},
                      {
                        title: itemTitle,
                        description: itemDescription,
                        impact: itemImpact,
                        validatedAmount: itemValidatedAmount,
                        optimisedAmount: itemOptimisedAmount,
                        targetAmount: itemTargetAmount,
                        findingAmount: itemFindingAmount,
                        pctLikelihoodPessimistic: itemPctLikelihoodPessimistic,
                        pctLikelihoodMiddle: itemPctLikelihoodMiddle,
                        pctLikelihoodOptimistic: itemPctLikelihoodOptimistic,
                        checkpointId: itemCheckpointId,
                        vendorId: itemVendorId,
                        date,
                        insightstatusId: itemInsightstatusId
                      }
                    )
                  );
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                type="button"
                color="success"
                onClick={() => {
                  this.setState({ open: {} });
                  return addInsights();
                }}
              >
                Save
              </Button>
            )}
            <Button
              type="button"
              color="warning"
              onClick={() => {
                this.setState({ open: {} });
                return close();
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

export default withStyles(styles)(AddReviewModal);
