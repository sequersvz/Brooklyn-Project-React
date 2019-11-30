import React, { PureComponent } from "react";
import "../../assets/scss/material-kit-react.css?v=1.1.0";
import "./itemreviews.css";
import "../reviewitems/button.file.css";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
  arrayMove
} from "react-sortable-hoc";
import { withRouter } from "react-router-dom";

class Itemreview extends PureComponent {
  state = {
    inverse: {},
    recurringPinned: {},
    height: 100,
    modal: null
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    let soritems = this.props.items;
    soritems = arrayMove(soritems, oldIndex, newIndex);
    this.mounted && this.props.sortItemreviews(soritems);
  };

  handleOnDoubleClick = item => () => {
    const { showDescriptionEdit, showEdit, handlerPanelOpen } = this.props;

    if (document.querySelector(".datapikerSelector") !== null) {
      return null;
    }

    if (showEdit && item && showEdit[item.id] === true) {
      return null;
    } else if (
      showDescriptionEdit &&
      item &&
      showDescriptionEdit[item.id] === true
    ) {
      return null;
    }
    return item && handlerPanelOpen(item.id);
  };

  render() {
    const { actionReviewItem, type, handleOnAddMeetingItem } = this.props;
    const { items, editItemreview, deleteReviewItem } = this.props;
    const { addThunderboltReviewItem } = this.props;
    const { isOldReview, isAgenda, isPdf } = this.props;
    const { editShowUploadingMessage, showUploadingMessage } = this.props;
    const { owners, getOwners } = this.props;
    const {
      categoryNAME,
      setInverseIconActions,
      categoryActionId
    } = this.props;
    const {
      putAttachments,
      getAttachments,
      delAttachments,
      editDecriptionEdit,
      showDescriptionEdit
    } = this.props;
    const {
      editAttendeesEdit,
      editshowEdit,
      editByEdit,
      editTimeSlotEdit
    } = this.props;
    const {
      showEdit,
      showTimeSlotEdit,
      showByEdit,
      showAttendeesEdit
    } = this.props;
    const {
      openModal,
      closeModal,
      modalRemove,
      closeModalRemove,
      openModalRemove,
      openPanel
    } = this.props;

    const { uploadProgress, setUploadProgress } = this.props;
    const { renderItem } = this.props;
    const { modalRemoveRI, openModalRemoveRI, closeModalRemoveRI } = this.props;
    const { addRisk } = this.props;
    const _handlerItem = {
      type,
      items,
      showEdit,
      openModal,
      closeModal,
      openPanel,
      categoryNAME,
      editshowEdit,
      categoryActionId,
      editItemreview,
      putAttachments,
      getAttachments,
      editDecriptionEdit,
      showDescriptionEdit,
      actionReviewItem,
      deleteReviewItem,
      setInverseIconActions,
      addThunderboltReviewItem,
      modalRemove,
      closeModalRemove,
      openModalRemove,
      isOldReview,
      isAgenda,
      isPdf,
      sortableHandle,
      onSortEnd: this.onSortEnd,
      handleOnAddMeetingItem,
      editShowUploadingMessage,
      showUploadingMessage,
      owners,
      getOwners,
      reviewId: parseInt(this.props.match.params.id, 10),
      handleOnDoubleClick: this.handleOnDoubleClick,
      delAttachments,
      editByEdit,
      editTimeSlotEdit,
      editAttendeesEdit,
      showTimeSlotEdit,
      showByEdit,
      showAttendeesEdit,
      uploadProgress,
      setUploadProgress,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI,
      addRisk
    };

    const listStyles = {
      cursor: "pointer",
      paddingTop: "10px"
    };
    const closedStyles = {
      ...listStyles,
      backgroundColor: "#f0f0f0"
    };
    const SortableItem = SortableElement(({ item }) => (
      <li
        className={
          openPanel &&
          typeof openPanel[item.id] !== "undefined" &&
          openPanel[item.id].open === true
            ? "expandedActive"
            : ""
        }
        key={item.id}
        style={isAgenda && item.closed === true ? closedStyles : listStyles}
        onDoubleClick={this.handleOnDoubleClick(item)}
      >
        {renderItem && renderItem({ ..._handlerItem, item })}
      </li>
    ));

    const SortableList = SortableContainer(({ items }) => (
      <ul style={{ cursor: "all-scroll" }}>
        {items.map((value, index) => {
          value["index"] = index;
          return (
            <SortableItem
              key={`item-${index}`}
              index={index}
              item={value}
              disabled={isOldReview}
            />
          );
        })}
      </ul>
    ));
    return (
      <div className="itemreview">
        <SortableList
          items={items}
          useDragHandle
          onSortEnd={this.onSortEnd}
          helperClass={"sortBox"}
          pressDelay={200}
        />
      </div>
    );
  }
}

export default withRouter(Itemreview);
