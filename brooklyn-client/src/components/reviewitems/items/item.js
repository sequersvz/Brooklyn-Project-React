import React, { PureComponent } from "react";
import "../../../assets/scss/material-kit-react.css?v=1.1.0";
import ReactTooltip from "react-tooltip";
import { Popover, Overlay, Row } from "react-bootstrap";
import "../button.file.css";
import { scoreNames } from "../../../config/config";
import ItemScore from "../../score.components/item.score";
import SelectImportance from "../../score.components/select.importance";
import SelectScore from "../../score.components/select.score";
import Score from "../../score.components/score";
import CustomPanel from "../custom.panel";
import ModalRemoveReviewItem from "../../reviews/modals/remove.modal";

class Item extends PureComponent {
  refFireButton = React.createRef();
  state = {
    inverse: {},
    recurringPinned: {},
    itemreviewName: undefined,
    itemreviewDescription: undefined,
    reviewitemComment: undefined,
    reviewitemImportance: undefined,
    showPopover: false,
    showPopoverCovered: false,
    addClassPopoverBox: false,
    popoverBoxClass: "popover__content",
    itemscore: undefined,
    showPopoverSelectScore: {},
    fileId: null,
    itemreviewBy: undefined,
    itemreviewTimeSlot: undefined
  };
  nodos = {};
  iconStyles = this.props.isAgenda
    ? {
        cursor: "pointer",
        fontSize: 12,
        marginRight: 6,
        position: "relative"
      }
    : {
        cursor: "pointer",
        fontSize: 18,
        marginRight: 10,
        position: "relative"
      };
  fontSize = this.props.isPdf ? 11 : 14;
  objectName = "";
  dropzoneRef = {};

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    if (this.state.addClassPopoverBox) {
      this.setState({ popoverBoxClass: "popover__content__extra" });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate(prevProps) {
    if (this.state.addClassPopoverBox) {
      this.setState({ popoverBoxClass: "popover__content__extra" });
    }
    if (prevProps.showModalRemove !== this.props.showModalRemove) {
      if (this.props.showModalRemove === false) {
        this.setState({ modal: null });
      }
    }
  }

  handleOnKeyDown = ({ field, value, name, updateField }) => event => {
    const { items, item } = this.props;
    const isOnRange = index => index >= 0 && index < items.length;
    if (event.keyCode === 13) {
      this.updateItemReview({ field, value, name, updateField })(event);
      return;
    }
    let currentIndex = item.index;
    let newIndex = -1;
    let hasPressedArrow = false;
    if (event.keyCode === 38) {
      hasPressedArrow = true;
      newIndex = isOnRange(currentIndex) ? currentIndex - 1 : currentIndex;
    }
    if (event.keyCode === 40) {
      hasPressedArrow = true;
      newIndex = isOnRange(currentIndex) ? currentIndex + 1 : currentIndex;
    }
    if (hasPressedArrow && newIndex > -1 && newIndex < items.length) {
      this.props.onSortEnd({
        oldIndex: item.index,
        newIndex
      });
    }
  };

  handleOnCommentKeyDown = event => {
    if (event.altKey && event.keyCode === 13) {
      this.updateItemReviewScore();
    }
  };

  handleClickOutside = event => {
    if (
      this["popoverShowSelectScore"] &&
      !this["popoverShowSelectScore"].contains(event.target)
    ) {
      this.updateItemReviewScore();
    }
  };

  updateItemReviewScore = () => {
    let {
      reviewitemComment,
      reviewitemImportance,
      reviewitemMark
    } = this.state;
    if (reviewitemMark) {
      return this.props.editItemreview(this.props.item.id, {
        closed: true,
        ready: false,
        deferred: false,
        mark: reviewitemMark,
        reviewClosedIn: this.props.reviewId,
        comment: reviewitemComment ? reviewitemComment : "",
        importance: reviewitemImportance ? reviewitemImportance : 1
      });
    }
    this.clickCancel();
  };

  updateItemReview = ({ field, value, name, updateField }) => () => {
    const { items, item, editItemreview } = this.props;
    if (typeof value !== "undefined") {
      let index = items.findIndex(i => i.id === item.id);
      items[index][field] = value ? value : item[field];
      editItemreview(item.id, { [field]: value });
      this.setState({ [name]: undefined });
    } else {
      updateField && updateField(item.id);
    }
  };

  handleOnBlur = this.updateItemReview;

  handleOnTrashIconClick = () => {
    const { isOldReview, item, openModalRemoveRI } = this.props;
    if (!isOldReview && !item.deleted) openModalRemoveRI(item);
  };

  handleOnReadyIconClick = () => {
    const { item, isOldReview, actionReviewItem } = this.props;
    const options = {
      mark: null,
      comment: null,
      importance: null
    };
    if (!isOldReview) actionReviewItem(item, "ready", null, options);
  };

  handleOnOpenIconClick = () => {
    const { item, isOldReview, actionReviewItem } = this.props;
    if (!isOldReview) actionReviewItem(item, "open");
  };

  handleOnCloseIconClick = () => {
    const { item, editItemreview } = this.props;

    if (!item.reviewcheckpointId) {
      editItemreview(item.id, {
        closed: true,
        ready: false,
        deferred: false
      });
    } else {
      let showPopoverSelectScore = { [item.id]: true };
      this.setState({ showPopoverSelectScore });
    }
  };

  handleOnRecurringIconClick = () => {
    const { item, isOldReview, actionReviewItem } = this.props;
    if (isOldReview) return;
    this.setState({
      recurringPinned: {
        [item.id]:
          item.id in this.state.recurringPinned
            ? !this.state.recurringPinned[item.id]
            : !item.recurring
      }
    });
    actionReviewItem(item, "recurring", item.recurring);
  };

  handleOnClickCapture = e => {
    e.preventDefault();
    if (!this.props.item.actioned && this.refFireButton.current)
      this.refFireButton.current.children[0].style.cursor = "auto";
  };

  handleOnActionIconClick = () => {
    const {
      item,
      isOldReview,
      categoryActionId,
      setInverseIconActions,
      addThunderboltReviewItem
    } = this.props;
    if (!item.actioned && !isOldReview) {
      setInverseIconActions(categoryActionId, true);
      this.setState({
        inverse: { [item.id]: true }
      });
      addThunderboltReviewItem(item);
      setTimeout(() => {
        setInverseIconActions(categoryActionId);
        this.setState({
          inverse: { [item.id]: false }
        });
      }, 5000);
    }
  };

  handleOnDeferIconClick = action => () => {
    const { item, isOldReview, actionReviewItem } = this.props;
    if (!isOldReview) actionReviewItem(item, action);
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };
  handlerItemScore = score => {
    this.setState({ itemscore: score });
  };

  handleOnHide = () => this.props.item && this.clickCancel(this.props.item.id);

  handleOnCloseClick = () => {
    const { item, editItemreview } = this.props;
    if (!item.reviewcheckpointId) {
      editItemreview(item.id, {
        closed: true,
        ready: false,
        deferred: false
      });
    } else {
      let showPopoverSelectScore = {
        [item.id]: true
      };
      this.setState({ showPopoverSelectScore });
    }
  };

  clickCancel = () => {
    this.setState({
      showPopoverSelectScore: {},
      reviewitemComment: undefined,
      reviewitemImportance: undefined,
      reviewitemMark: undefined
    });
  };
  handleOnPanelClick = () => {
    const { item } = this.props;
    this.dropzoneRef[item.id].open();
  };
  render() {
    const {
      item,
      isAgenda,
      sortableHandle,
      handleOnDoubleClick,
      type,
      items,
      owners,
      isPdf,
      openModal,
      openPanel,
      getOwners,
      renderItem,
      showEdit,
      editshowEdit,
      showTimeSlotEdit,
      editTimeSlotEdit,
      editAttendeesEdit,
      showAttendeesEdit,
      showByEdit,
      editByEdit,
      isOldReview,
      categoryNAME,
      putAttachments,
      editItemreview,
      getAttachments,
      uploadProgress,
      setUploadProgress,
      editDecriptionEdit,
      displayHrSeparator,
      marginTopSeparator,
      showDescriptionEdit,
      showUploadingMessage,
      editShowUploadingMessage,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI,
      deleteReviewItem
    } = this.props;
    const {
      inverse,
      recurringPinned,
      itemreviewName,
      itemreviewDescription,
      reviewitemComment,
      reviewitemImportance,
      showPopover,
      showPopoverCovered,
      addClassPopoverBox,
      popoverBoxClass,
      itemscore,
      showPopoverSelectScore,
      fileId,
      itemreviewBy,
      itemreviewTimeSlot
    } = this.state;

    let displayUploadFragment = "none";

    if (showUploadingMessage) {
      displayUploadFragment = !showUploadingMessage[item.id] ? "none" : "flex";
    }
    const handlerCustomDropZone = {
      item,
      items,
      isOldReview,
      editShowUploadingMessage,
      putAttachments,
      dropzoneRef: this.dropzoneRef,
      displayUploadFragment,
      showDescriptionEdit,
      itemreviewDescription,
      editItemreview,
      editDecriptionEdit,
      getAttachments,
      openModal,
      _openModal: this.props.openModalRemove,
      parentState: this.state,
      setParentState: (property, value) => {
        this.setState({ [property]: value });
      },
      handleInputChange: this.handleInputChange,
      uploadProgress,
      setUploadProgress
    };

    const sectionsHandler = {
      item,
      isPdf,
      owners,
      isOldReview,
      sortableHandle,
      handleOnDoubleClick,
      type,
      fileId,
      isAgenda,
      inverse,
      itemscore,
      showPopover,
      itemreviewBy,
      itemreviewName,
      popoverBoxClass,
      recurringPinned,
      showEdit,
      editshowEdit,
      showByEdit,
      editByEdit,
      showTimeSlotEdit,
      editTimeSlotEdit,
      editAttendeesEdit,
      showAttendeesEdit,
      reviewitemComment,
      showPopoverCovered,
      addClassPopoverBox,
      itemreviewTimeSlot,
      reviewitemImportance,
      itemreviewDescription,
      showPopoverSelectScore,
      categoryName: categoryNAME,
      iconStyles: this.iconStyles,
      nodos: this.nodos,
      refFireButton: this.refFireButton,
      recurringColor:
        item.id in recurringPinned
          ? recurringPinned[item.id]
            ? "#00d3ee"
            : "gray"
          : item.recurring === true
            ? "#00d3ee"
            : "gray",
      showOverlay:
        item.id in showPopoverSelectScore &&
        showPopoverSelectScore[item.id] === true,
      handleOnBlur: this.handleOnBlur,
      handleOnHide: this.handleOnHide,
      handleOnKeyDown: this.handleOnKeyDown,
      handlerItemScore: this.handlerItemScore,
      handleInputChange: this.handleInputChange,
      handleClickOutside: this.handleClickOutside,
      handleOnCloseClick: this.handleOnCloseClick,
      handleOnClickCapture: this.handleOnClickCapture,
      handleOnOpenIconClick: this.handleOnOpenIconClick,
      handleOnCommentKeyDown: this.handleOnCommentKeyDown,
      handleOnTrashIconClick: this.handleOnTrashIconClick,
      handleOnRecurringIconClick: this.handleOnRecurringIconClick,
      handleOnReadyIconClick: this.handleOnReadyIconClick,
      handleOnCloseIconClick: this.handleOnCloseIconClick,
      handleOnDeferIconClick: this.handleOnDeferIconClick,
      handleOnActionIconClick: this.handleOnActionIconClick,
      renderSelectScore: this.renderPopoverShowSelectScore,
      renderScoreSection: this.itemScoreSection,

      openModalRemoveRI
    };

    const handlerOwnerDescriptionComponent = {
      item,
      parentState: this.state,
      setParentState: (property, value) => this.setState({ [property]: value }),
      handleInputChange: this.handleInputChange,
      editItemreview,
      owners,
      getOwners
    };
    const showModalRemoveRI =
      (modalRemoveRI[(item || {}).id] || {}).show || false;
    return (
      <div key={`item-container-${item.id}`}>
        <div
          style={{
            fontSize: this.fontSize,
            marginTop: marginTopSeparator || 0
          }}
          data-target="#demo"
        >
          <Row>{renderItem({ ...sectionsHandler })}</Row>
          <ReactTooltip />
          {showModalRemoveRI && (
            <ModalRemoveReviewItem
              {...{
                show: showModalRemoveRI,
                closeModal: closeModalRemoveRI,
                handlerClick: () =>
                  deleteReviewItem((modalRemoveRI[item.id] || {}).item),
                objectName: `"${
                  ((modalRemoveRI[item.id] || {}).item || {}).name
                }"`,
                name: "modalRemoveRI",
                modalName:
                  categoryNAME === "Action Log" ? "Action Item" : "Review Item"
              }}
            />
          )}
        </div>
        {openPanel && openPanel[item.id] && openPanel[item.id].open ? (
          <CustomPanel
            {...{
              item,
              isAgenda,
              openPanel,
              isOldReview,
              key: `cp-${item.id}`,
              categoryName: categoryNAME,
              handleOnPanelClick: this.handleOnPanelClick,
              handlerCustomDropZone,
              handlerOwnerDescriptionComponent
            }}
          />
        ) : null}

        <hr
          style={{
            marginTop: 10,
            marginBottom: 0,
            borderColor: isAgenda && "#e3e3e3",
            display: displayHrSeparator || "block"
          }}
        />
      </div>
    );
  }

  itemScoreSection = item => {
    return (
      <div style={{ paddingLeft: "20%" }}>
        <div
          onMouseEnter={() =>
            this.setState({
              showPopoverCovered: true
            })
          }
          onMouseLeave={() =>
            this.setState({
              showPopoverCovered: false
            })
          }
        >
          <Score
            ref={node => (this.target = node)}
            scoreNumber={item.mark !== null ? item.mark : 0}
            negative={true}
          />
        </div>
        <Overlay
          show={this.state.showPopoverCovered}
          onHide={() => this.setState({ showPopoverCovered: false })}
          placement="top"
          target={() => this.target}
        >
          {this.popoverShowScore(item)}
        </Overlay>
      </div>
    );
  };

  popoverShowScore = item => (
    <Popover id="popover-positioned-top" title="Review Item Score">
      <div
        onMouseEnter={() => this.setState({ showPopoverCovered: true })}
        onMouseLeave={() => this.setState({ showPopoverCovered: false })}
      >
        <ItemScore
          {...{
            scoreNumber: item.mark !== null ? item.mark : 0,
            scoreName: scoreNames[item.mark !== null ? item.mark - 1 : 0],
            descriptionTitle: "Comments",
            description: item.comment !== null ? item.comment : "",
            importance: item.importance,
            item
          }}
        />
      </div>
    </Popover>
  );

  renderPopoverShowSelectScore = () => {
    const {
      reviewitemMark,
      reviewitemComment,
      reviewitemImportance
    } = this.state;
    return (
      <Popover id={"popover-positioned-top"}>
        <div ref={n => (this.popoverShowSelectScore = n)}>
          {!reviewitemMark ? (
            <SelectScore
              {...{
                handleInputChange: this.handleInputChange
              }}
            />
          ) : (
            <SelectImportance
              {...{
                scoreNumber: reviewitemMark,
                scoreName:
                  scoreNames[reviewitemMark !== null ? reviewitemMark - 1 : 0],
                handleInputChange: this.handleInputChange,
                reviewitemMark,
                reviewitemImportance,
                reviewitemComment,
                handleOnKeyDown: this.handleOnCommentKeyDown
              }}
            />
          )}
        </div>
      </Popover>
    );
  };
}

export default Item;
