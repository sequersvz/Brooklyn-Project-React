import React, { PureComponent } from "react";
import "../../assets/scss/material-kit-react.css?v=1.1.0";
import "./itemreviews.css";
import "./button.file.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtack,
  faGreaterThan,
  faLongArrowAltUp,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { Col, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import WdihtdtItem from "../reviewitems/items/wdihtdt.item";
import { CSSTransition, TransitionGroup } from "react-transition-group";
class Itemreview extends PureComponent {
  state = {
    countItems: undefined
  };

  handlerClickMore = () => {
    this.setState({
      countItems: this.state.countItems ? this.state.countItems + 5 : 9
    });
  };
  handlerClickLess = () => {
    this.setState({
      countItems: this.state.countItems ? this.state.countItems - 5 : 9
    });
  };

  handlerOpenPanel = id => {
    if (id) {
      this.props.handlerPanelOpen(id);
    }
  };

  handleOnUnpinned = item => e => {
    e.preventDefault();
    this.props.actionCheckpointMenu(item, false, this.props.vendor.id);
  };
  handleOnGoLinkClick = link => () => {
    let { info, history } = this.props;
    let pushObj = { pathname: link };
    if (info && info.props.children.includes("agenda")) {
      history.push({
        ...pushObj,
        state: { isForSendingAgenda: true }
      });
    } else {
      history.push(link);
    }
  };

  render() {
    const {
      vendor,
      review,
      actionReviewItem,
      deleteReviewItem,
      editItemreview,
      modalRemoveRI,
      meetingMessage,
      openModalRemoveRI,
      closeModalRemoveRI
    } = this.props;
    const {
      editDecriptionEdit,
      showEdit,
      editshowEdit,
      showDescriptionEdit
    } = this.props;
    const {
      openModal,
      closeModal,
      modalRemove,
      openModalRemove,
      closeModalRemove,
      showUploadingMessage,
      editShowUploadingMessage
    } = this.props;
    const { setInverseIconActions } = this.props;
    const { info } = this.props;
    const { slug } = this.props;
    const { openPanel } = this.props;
    const { putAttachments, getAttachments, delAttachments } = this.props;
    let checkpointPinned = review
      ? review.rc.filter(
          rc =>
            rc.pinned === true &&
            rc.itemreviews.length === 0 &&
            rc.checkpoint.category.name !== "Action Log"
        )
      : [];
    let reviewItemOpen = review
      ? review.rc.filter(rc => rc.itemreviews.length > 0)
      : [];
    let items = [];
    let groupedItems = {};
    let minGroupItem = 3;
    checkpointPinned.forEach(rc => {
      let catName = rc.checkpoint.category.name;
      let item = {
        id: rc.id,
        description: `Your pinned Checkpoint ${catName}/ ${
          rc.checkpoint.name
        } has no Review Items. Create a Review Item for it.`,
        categoryName: catName,
        categoryId: rc.checkpoint.category.id,
        checkpointName: rc.checkpoint.name,
        checkpointId: rc.checkpoint.id,
        iconClassName: rc.checkpoint.category.iconClassName,
        pinned: true,
        reviewId: rc.reviewId,
        keyprocessId: vendor && (vendor.keyprocess || {}).id
      };
      if (!(catName in groupedItems)) {
        groupedItems[catName] = {
          id: rc.checkpoint.category.id,
          items: [],
          categoryName: catName,
          iconClassName: rc.checkpoint.category.iconClassName,
          keyprocessId: vendor && (vendor.keyprocess || {}).id
        };
      }
      groupedItems[catName].items.push(item);
    });

    for (let group in groupedItems) {
      let expanded = true;
      if (groupedItems[group].items.length >= minGroupItem) {
        expanded = false;
        groupedItems[group].description = `You have ${
          groupedItems[group].items.length
        } pinned checkpoints in ${group}
          that don't have any review item. Create review item for them.`;
      }
      groupedItems[group].expanded = expanded;
      if (expanded) {
        for (let i in groupedItems[group].items) {
          items.push(groupedItems[group].items[i]);
        }
      } else {
        items.push(groupedItems[group]);
      }
    }
    reviewItemOpen.forEach(rc => {
      rc.itemreviews
        .filter(
          item =>
            item.closed === false &&
            item.deferred === false &&
            item.ready === false &&
            rc.checkpoint.category.name !== "Action Log"
        )
        .forEach(itemR => {
          let item = {
            id: itemR.id,
            name: itemR.name,
            description: itemR.description,
            vendorId: vendor && vendor.id,
            files: itemR.files,
            shortDescription: rc.itemreviews[0].description,
            categoryName: rc.checkpoint.category.name,
            categoryId: rc.checkpoint.category.id,
            checkpointName: rc.checkpoint.name,
            checkpointId: rc.checkpoint.id,
            iconClassName: rc.checkpoint.category.iconClassName,
            pinned: false,
            recurring: itemR.recurring,
            keyprocessId: vendor && (vendor.keyprocess || {}).id
          };
          items.push(item);
        });
    });

    const _handlerItem = {
      type: "open",
      items,
      showEdit,
      openModal,
      closeModal,
      openPanel,
      editshowEdit,
      categoryActionId: undefined,
      editItemreview,
      putAttachments,
      delAttachments,
      getAttachments,
      editDecriptionEdit,
      showDescriptionEdit,
      actionReviewItem,
      deleteReviewItem,
      setInverseIconActions,
      addThunderboltReviewItem: undefined,
      modalRemove,
      openModalRemove,
      closeModalRemove,
      slug,
      handleChangeShowItemReady: this.handleChangeShowItemReady,
      showUploadingMessage,
      editShowUploadingMessage,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI
    };

    let { countItems } = this.state;
    let loadingItem = [];
    if (!countItems) {
      loadingItem = items.slice(0, 4);
    } else {
      loadingItem = items.slice(0, countItems);
    }
    return !info ? (
      <div>
        <TransitionGroup>
          {loadingItem.map(item =>
            this.renderListItem(item, review, _handlerItem)
          )}
        </TransitionGroup>
        {items.length > loadingItem.length ? (
          <center>
            <button className="buttonLoad" onClick={this.handlerClickMore}>
              Load more...
            </button>
          </center>
        ) : null}
        {loadingItem.length > 4 ? (
          <center>
            <button className="buttonLoad" onClick={this.handlerClickLess}>
              less
              <FontAwesomeIcon
                icon={faLongArrowAltUp}
                pull="left"
                style={{
                  position: "relative",
                  top: 3
                }}
              />
            </button>
          </center>
        ) : null}
      </div>
    ) : (
      <InfoItem
        info={info}
        handleOnClick={this.handleOnGoLinkClick(
          `/assurance/review/${review.id}${
            meetingMessage ? "?categoryId=0&checkpointId=1" : ""
          }`
        )}
      />
    );
  }
  renderListItem = (item, review, _handlerItem) => {
    let render =
      "expanded" in item && !item.expanded
        ? renderGroupedItems(item)
        : item && item.pinned
          ? renderPinnedItem(this.handleOnUnpinned, item)
          : null;
    let reviewLink = `/assurance/review/${
      review.id
    }?categoryId=${item.categoryId || item.id}${
      item.checkpointId ? `&checkpointId=${item.checkpointId}` : ""
    }`;
    return (
      <CSSTransition timeout={1000} key={item.id} classNames="fade">
        <li
          className={
            typeof this.props.openPanel[item.id] !== "undefined" &&
            this.props.openPanel[item.id].open === true
              ? "expandedActive"
              : "expandedActiveBorder"
          }
          onDoubleClick={e => {
            e.preventDefault();
            if (item.expanded === false || item.pinned === true) return;
            this.handlerOpenPanel(item.id);
          }}
        >
          {render ? (
            <ListItem
              render={render}
              description={item.description}
              handleOnClick={this.handleOnGoLinkClick(reviewLink)}
            />
          ) : (
            <WdihtdtItem
              {...{
                ..._handlerItem,
                item,
                categoryNAME: item.categoryName,
                checkpointName: item.checkpointName
              }}
            />
          )}
        </li>
      </CSSTransition>
    );
  };
}

const ListItem = ({ render, description, handleOnClick }) => (
  <div
    style={{
      marginLeft: "-10px",
      fontSize: 14
    }}
  >
    <Row>
      <Col md={7}>
        <div>
          <p
            style={{
              paddingLeft: 10,
              marginBottom: 0
            }}
          >
            {description}
          </p>
        </div>
      </Col>
      <Col md={4}>{render}</Col>
      <Col md={1}>
        <GoIcon handleOnClick={handleOnClick} />
      </Col>
      <ReactTooltip />
    </Row>
  </div>
);
const GoIcon = ({ handleOnClick, style }) => (
  <div
    onClick={handleOnClick}
    style={style || { cursor: "pointer", float: "right" }}
  >
    <p style={{ color: "#502757", float: "left" }}>GO</p>
    <FontAwesomeIcon
      icon={faGreaterThan}
      pull="left"
      color={"#502757"}
      style={{
        marginRight: 0,
        fontSize: 14,
        marginLeft: 3
      }}
    />
  </div>
);

const InfoItem = ({ info, handleOnClick }) => (
  <li className={"expandedActiveBorder"}>
    {info}
    <GoIcon
      handleOnClick={handleOnClick}
      style={{
        cursor: "pointer",
        float: "right",
        position: "relative",
        top: -14
      }}
    />
  </li>
);

const groupedItems = item => {
  let { categoryName, iconClassName, items } = item;
  return (
    <span>
      <FontAwesomeIcon
        icon={iconClassName}
        pull="left"
        color={"grey"}
        style={{
          fontSize: 20,
          marginTop: -3,
          width: 30
        }}
      />{" "}
      {categoryName} /{" "}
      {items && items.length > 9 ? (
        <span>
          [ {9}
          <FontAwesomeIcon icon={faPlus} size="xs" color={"grey"} /> checkpoints
          ]
        </span>
      ) : (
        `[ ${items.length} checkpoints ]`
      )}
    </span>
  );
};

const renderGroupedItems = item => groupedItems(item);

const pinnedItem = (handleOnUnpinned, item) => {
  let { categoryName, iconClassName, checkpointName } = item;
  return (
    <Row>
      <Col md={10}>
        <FontAwesomeIcon
          icon={iconClassName}
          pull="left"
          color={"grey"}
          style={{
            fontSize: 20,
            marginTop: -3,
            width: 30
          }}
        />{" "}
        <span style={{}}>
          {categoryName} / {checkpointName}
        </span>
      </Col>
      <Col md={2}>
        <FontAwesomeIcon
          icon={faThumbtack}
          color={"#502757"}
          pull="right"
          style={{
            fontSize: 16,
            cursor: "pointer"
          }}
          onClick={handleOnUnpinned(item)}
        />
      </Col>
    </Row>
  );
};

const renderPinnedItem = (handleOnUnpinned, item) =>
  pinnedItem(handleOnUnpinned, item);

export default withRouter(Itemreview);
