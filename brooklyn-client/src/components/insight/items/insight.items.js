import React, { PureComponent } from "react";
import "../../../assets/scss/material-kit-react.css?v=1.1.0";
import "./insight.items.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faList, faPen } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { Panel } from "react-bootstrap";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";
import AddReviewItemInsightModal from "../modals/addReviewitemModal";
import { Row, Col } from "react-bootstrap";

class Itemreview extends PureComponent {
  state = {
    openPanel: {},
    showEdit: {},
    showDescriptionEdit: {},
    AddReviewInsightModal: null,
    showModal: true,
    showEditStatus: {}
  };

  componentWillMount() {
    this.setState({ items: this.props.items });
  }
  componentDidUpdate(prevProps) {
    if (this.props.showEdit !== prevProps.showEdit) {
      this.setState({ showEdit: this.props.showEdit });
    }
    if (this.props.showDescriptionEdit !== prevProps.showDescriptionEdit) {
      this.setState({ showDescriptionEdit: this.props.showDescriptionEdit });
    }
    if (this.props.items !== prevProps.items) {
      this.setState({ items: this.props.items });
    }
  }
  handlerPanelOpen = itemId => {
    let assign = {};
    if (typeof this.state.openPanel[itemId] === "undefined") {
      Object.assign(assign, this.state.openPanel, {
        [itemId]: {
          open: true
        }
      });
      this.setState({
        openPanel: assign
      });
    } else if (this.state.openPanel[itemId].open === true) {
      Object.assign(assign, this.state.openPanel, {
        [itemId]: {
          open: false
        }
      });
      this.setState({
        openPanel: assign
      });
    } else if (this.state.openPanel[itemId].open === false) {
      Object.assign(assign, this.state.openPanel, {
        [itemId]: {
          open: true
        }
      });
      this.setState({
        openPanel: assign
      });
    }
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    });
    this.props.sortItemreviews(this.state.items);
  };

  render() {
    const { items } = this.state;
    const { handleInputChange, editItemreview, insightName } = this.props;
    const { itemreviewDescription } = this.props;
    const { nextReview, insightStatus, editInsight } = this.props;
    const {
      showModalCreateReviewItem,
      openModal,
      closeModal,
      itemTitle,
      itemDescription,
      checkpointId,
      addReviewItem
    } = this.props;
    const { categories, checkpoints, loadItem } = this.props;
    const { vendors } = this.props;
    const handlerAddReviewInsightModal = {
      show: showModalCreateReviewItem,
      close: () => closeModal("createReviewItem"),
      itemTitle,
      itemDescription,
      checkpointId,
      handleInputChange,
      item: this.state.item,
      nextReview,
      addReviewItem,
      categories,
      checkpoints
    };

    const SortableItem = SortableElement(({ item }) => {
      let index = (vendors || []).findIndex(
        vendor => (vendor || {}).id === item.vendorId
      );
      return (
        <li
          className={
            typeof this.state.openPanel[item.id] !== "undefined" &&
            this.state.openPanel[item.id].open === true
              ? "expandedActive"
              : ""
          }
          key={item.id}
          style={{ cursor: "pointer" }}
          onDoubleClick={this.handlerPanelOpen.bind(this, item.id)}
        >
          {/* eslint-disable-next-line */}
          <a
            style={{ fontSize: 14 }}
            data-toggle="collapse"
            data-target="#demo"
          >
            {this.state.showEdit[item.id] === true ? (
              <input
                name="insightName"
                value={
                  typeof insightName !== "undefined" ? insightName : item.name
                }
                onChange={handleInputChange}
                autoFocus={true}
                onBlur={() => {
                  if (typeof insightName !== "undefined") {
                    editItemreview.bind(this, item.id, { name: insightName })();
                  } else {
                    this.setState({ showEdit: { [item.id]: false } });
                  }
                }}
                style={{ width: item.title.length * 2 + 220, padding: 5 }}
              />
            ) : (
              <span
                style={{ fontSize: 14, paddingLeft: 20 }}
                onClick={() => {
                  this.setState({ showEdit: { [item.id]: true } });
                }}
              >
                {item.title}
              </span>
            )}
            <FontAwesomeIcon
              icon={faPen}
              pull="right"
              color={"gray"}
              style={{
                cursor: "pointer",
                fontSize: 14,
                marginRight: 10
              }}
              data-tip={"Edit"}
              onClick={() => {
                loadItem(item);
                openModal("createInsight");
              }}
            />
            <FontAwesomeIcon
              icon={faList}
              pull="right"
              onClick={() => {
                this.setState({ item });
                openModal("createReviewItem");
              }}
              color={"gray"}
              style={{
                cursor: "pointer",
                fontSize: 14,
                marginRight: 10
              }}
              data-tip="Create review item"
            />
            <FontAwesomeIcon
              icon={faTrash}
              pull="right"
              color={"gray"}
              style={{
                cursor: "pointer",
                fontSize: 14,
                marginRight: 10
              }}
              data-tip={"Delete"}
            />
            <ReactTooltip />
            {this.state.showEditStatus[item.id] ? (
              insightStatus ? (
                <select
                  name={"insightstatusId"}
                  style={{ padding: 5, width: 200 }}
                  onChange={e => {
                    this.setState({ showEditStatus: { [item.id]: false } });
                    const target = e.target;
                    item.status = insightStatus.filter(
                      status => status.id === target.value
                    )[0];
                    editInsight(item.id, { insightstatusId: target.value });
                  }}
                  className={"pull-right"}
                  autoFocus={true}
                  onBlur={() => {
                    this.setState({ showEditStatus: { [item.id]: false } });
                  }}
                >
                  {insightStatus.map(status => (
                    <option
                      key={status.id}
                      value={status.id}
                      selected={status.id === item.insightstatusId}
                    >
                      {status.name}
                    </option>
                  ))}
                </select>
              ) : null
            ) : (
              <span
                style={{ marginRight: 10 }}
                className={"pull-right"}
                onClick={() =>
                  this.setState({ showEditStatus: { [item.id]: true } })
                }
              >
                {item.status}
              </span>
            )}
          </a>
          <Panel
            id="demo"
            style={{ border: "none", boxShadow: "none" }}
            expanded={
              typeof this.state.openPanel[item.id] !== "undefined" &&
              this.state.openPanel[item.id].open === true
                ? true
                : false
            }
            onToggle={() => {}}
          >
            <Panel.Collapse>
              <Panel.Body>
                <hr className="hr-style" />
                {this.state.showDescriptionEdit[item.id] === true ? (
                  <input
                    name="itemreviewDescription"
                    value={
                      typeof itemreviewDescription !== "undefined"
                        ? itemreviewDescription
                        : item.description
                    }
                    onChange={handleInputChange}
                    autoFocus={true}
                    onBlur={() => {
                      if (typeof itemreviewDescription !== "undefined") {
                        editItemreview.bind(this, item.id, {
                          description: itemreviewDescription
                        })();
                      } else {
                        this.setState({
                          showDescriptionEdit: { [item.id]: false }
                        });
                      }
                    }}
                    style={{ width: item.title.length * 2 + 220, padding: 5 }}
                  />
                ) : (
                  <span
                    style={{ fontSize: 14, padding: 5 }}
                    onClick={() => {
                      this.setState({
                        showDescriptionEdit: { [item.id]: true }
                      });
                    }}
                  >
                    <Row className="font-body">
                      <Col md={3} xs={12}>
                        {index !== -1 ? (
                          vendors[index].logo === undefined ? (
                            vendors[index].name
                          ) : vendors[index].logo === null ? (
                            vendors[index].name
                          ) : (
                            <img src={vendors[index].logo} alt={"logo"} />
                          )
                        ) : null}
                      </Col>

                      <Col md={12}>
                        <Col md={3} xs={6} className="titles-table">
                          Description:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.description}
                        </Col>
                        <Col md={3} xs={6} className="titles-table">
                          Date:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.date}
                        </Col>
                      </Col>
                    </Row>

                    <Row className="font-body">
                      <Col md={12}>
                        <Col md={3} xs={6} className="titles-table">
                          Target Amount:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.targetAmount}
                        </Col>
                        <Col md={3} xs={6} className="titles-table">
                          Impact:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.impact}
                        </Col>
                      </Col>
                    </Row>

                    <Row className="font-body">
                      <Col md={12}>
                        <Col md={3} xs={6} className="titles-table">
                          Optimised Amount:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.optimisedAmount}
                        </Col>
                        <Col md={3} xs={6} className="titles-table">
                          Finding Amount:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.findingAmount}
                        </Col>
                      </Col>
                    </Row>

                    <Row className="font-body">
                      <Col md={12}>
                        <Col md={3} xs={6} className="titles-table">
                          Checkpoint Id:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.checkpointId}
                        </Col>
                        <Col md={3} xs={6} className="titles-table">
                          PctLikelihood Pessimistic:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.pctLikelihoodPessimistic}
                        </Col>
                      </Col>
                    </Row>

                    <Row className="font-body">
                      <Col md={12}>
                        <Col md={3} xs={6} className="titles-table">
                          PctLikelihood Middle:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.pctLikelihoodMiddle}
                        </Col>
                        <Col md={3} xs={6} className="titles-table">
                          PctLikelihood Optimistic:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.pctLikelihoodOptimistic}
                        </Col>
                      </Col>
                    </Row>

                    <Row className="font-body">
                      <Col md={12}>
                        <Col md={3} xs={6} className="titles-table">
                          Validated Amount:
                        </Col>
                        <Col md={3} xs={6}>
                          {item.validatedAmount}
                        </Col>
                      </Col>
                    </Row>
                  </span>
                )}
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
          <hr />
        </li>
      );
    });

    const SortableList = SortableContainer(({ items }) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} item={value} />
          ))}
        </ul>
      );
    });

    return (
      <div>
        <SortableList
          items={items}
          onSortEnd={this.onSortEnd}
          pressDelay={200}
        />
        <AddReviewItemInsightModal {...handlerAddReviewInsightModal} />
      </div>
    );
  }
}

export default Itemreview;
