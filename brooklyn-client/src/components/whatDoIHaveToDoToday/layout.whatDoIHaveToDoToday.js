import React, { Component } from "react";
import "./whatDoIHaveToDoToday.css";
import { Row, Col } from "react-bootstrap";
import Searchkit from "../search-kit";
import { withRouter } from "react-router-dom";
import moment from "moment";

import iconsDataStructure from "./structure.icons";
import FixedIcons from "../fixed-icon/fixed.icons";
import AddReviewModal from "../reviews/modals/addReview.modal";
import Loading from "../loading-spinner";
import VendorReview from "./vendor.review";
import Button from "@material-ui/core/Button";
import ActionItem from "./ActionItem";

class LayoutWhatDoIHaveToDoToday extends Component {
  render() {
    const {
      vendors,
      showUploadingMessage,
      editShowUploadingMessage,
      modalRemove,
      openModalRemove,
      closeModalRemove,
      delAttachments,
      closeModal
    } = this.props;
    const goToRoute = () => this.props.history.push("/assurance");
    const {
      showModalAddReview,
      addReview,
      date,
      loadingVendors,
      getVendors,
      handleDateChange,
      isErrorTitle,
      handleisErrorTitleChange,
      closeModalEvent,
      vendor,
      keyprocessId,
      openModal,
      handleInputChange,
      setInverseIconActions,
      handleOnAddVendorReview,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI,
      showLoadMoreButton,
      loadMoreVendors,
      loadingMoreVendors
    } = this.props;

    const {
      openPanel,
      showEdit,
      editshowEdit,
      putAttachments,
      editDecriptionEdit,
      showDescriptionEdit,
      editItemreview,
      getAttachments,
      handlerPanelOpen,
      actionReviewItem,
      deleteReviewItem
    } = this.props;

    const { actionCheckpointMenu } = this.props;

    const handlerItemreview = {
      openModal,
      showEdit,
      editshowEdit,
      putAttachments,
      editDecriptionEdit,
      showDescriptionEdit,
      editItemreview,
      getAttachments,
      handlerPanelOpen,
      actionReviewItem,
      deleteReviewItem,
      actionCheckpointMenu,
      openPanel,
      slug: "wdihtdt",
      setInverseIconActions,
      closeModal,
      delAttachments,
      modalRemove,
      openModalRemove,
      closeModalRemove,
      showUploadingMessage,
      editShowUploadingMessage,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI
    };
    const modalHandldersReview = {
      vendorId: vendor,
      keyprocessId,
      handleInputChange,
      show: showModalAddReview,
      addReview,
      date,
      vendors,
      getVendors,
      handleDateChange,
      isErrorTitle,
      handleisErrorTitleChange,
      closeModalEvent
    };
    const handlerIconsStructure = {
      goToRoute
    };
    const iconsData = iconsDataStructure(handlerIconsStructure);
    return (
      <div>
        <Loading load={loadingVendors} />
        <Col md={12}>
          <Searchkit
            getAllWithFilters={filters => {
              getVendors(filters);
            }}
          >
            <Row>
              <Col md={12}>
                {showModalAddReview && (
                  <AddReviewModal {...modalHandldersReview} />
                )}
                <div className="itemreview">
                  {vendors.map((vendor, index) => {
                    if (vendor.type === "action-item") {
                      return (
                        <ActionItem
                          key={`action-item-${vendor.id}`}
                          item={vendor}
                        />
                      );
                    }
                    let donwloadAgendaMessage = this.getDownloadAgendaMessage(
                      vendor
                    );
                    return (
                      <VendorReview
                        key={index}
                        vendor={vendor}
                        donwloadAgendaMessage={donwloadAgendaMessage}
                        onTitleClick={this.handleOnTitleClick}
                        onGoClick={this.handleOnGoClick}
                        onAddVendorReview={handleOnAddVendorReview}
                        handlerItemreview={handlerItemreview}
                      />
                    );
                  })}
                </div>
                {showLoadMoreButton && (
                  <div style={{ textAlign: "center", paddingBottom: "60px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => loadMoreVendors()}
                      disabled={loadingMoreVendors}
                    >
                      {loadingMoreVendors ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Searchkit>
        </Col>
        <FixedIcons iconsData={iconsData} />
      </div>
    );
  }

  handleOnGoClick = nextReviewId => e => {
    e.preventDefault();
    this.props.history.push(`/assurance/review/${nextReviewId}`);
  };

  handleOnTitleClick = nextReview => e => {
    e.preventDefault();
    if (!nextReview) {
      return;
    }

    let categoryActionId = null;
    let categoryAction = nextReview.rc.filter(
      item => item.checkpoint.category["name"] === "Action Log"
    );
    if (categoryAction.length > 0) {
      categoryActionId = categoryAction[0].checkpoint.category.id;
    }

    let checkpointActionNextItemsId = null;
    let checkpointActionNextItems = nextReview.rc.filter(
      item => item.checkpoint["name"] === "New Actions"
    );
    if (checkpointActionNextItems.length > 0) {
      checkpointActionNextItemsId =
        checkpointActionNextItems[0].checkpoint.category.id;
    }
    this.props.history.push(
      `/assurance/review/${
        nextReview.id
      }?categoryId=${categoryActionId}&checkpointId=${checkpointActionNextItemsId}`
    );
  };

  getDownloadAgendaMessage = vendor => {
    let donwloadAgendaMessage = "";
    let isModifiedAfterDownload = false;
    if (!vendor.nextReview) return donwloadAgendaMessage;
    let { agendaDownloaded, updatedAt, date, readiness } = vendor.nextReview;
    if (agendaDownloaded) {
      isModifiedAfterDownload = moment(agendaDownloaded).isBefore(
        moment(updatedAt)
      );
    }

    if (isModifiedAfterDownload || !agendaDownloaded) {
      let diffDays = moment().diff(moment(date), "days") * -1;
      if (diffDays <= 14) {
        let diffWeeks = parseInt(diffDays / 7);
        let thisWeek = moment().diff(moment().endOf("week"), "days") * -1;
        donwloadAgendaMessage = `We are ${diffWeeks} week${
          diffWeeks > 1 ? "s" : ""
        } before the review`;
        if (diffDays < thisWeek) {
          donwloadAgendaMessage = `The review is this week`;
        } else if (diffWeeks === 0) {
          donwloadAgendaMessage = `The review is next week`;
        }
      }
      let ready = parseInt(readiness * 100);
      if (ready >= 80) {
        if (donwloadAgendaMessage !== "") {
          donwloadAgendaMessage += ` and `;
        }
        donwloadAgendaMessage += `you are ${ready}% ready for this review`;
      }
      if (donwloadAgendaMessage !== "") {
        donwloadAgendaMessage += `, how about sending ${
          vendor.name
        } the agenda?`;
      }
      //capitalize it
      donwloadAgendaMessage = donwloadAgendaMessage.replace(/^\w/, firstChar =>
        firstChar.toUpperCase()
      );
    }
    return donwloadAgendaMessage;
  };
}

export default withRouter(LayoutWhatDoIHaveToDoToday);
