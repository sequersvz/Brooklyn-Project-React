import React, { PureComponent } from "react";
import { connect } from "react-redux";
import "../../assets/scss/material-kit-react.css?v=1.1.0";
import CustomTabs from "../../assets/materialComponents/CustomTabs/CustomCard";
import "./itemreviews.css";
import FixedIcons from "../fixed-icon/fixed.icons";
import ExportReviewitemModal from "./modals/exportReviewItem.modal";
import AddReviewModal from "./modals/addReview.modal";
import AddReviewCheckpontModal from "./modals/addReviewCheckpoint.modal";
import ItemReviews from "./itemreviews";
import iconsDataStructure from "./structure.icons";
import Loading, { LoadingSpinner } from "../loading-spinner";
import DeleteReviewModal from "./modals/deleteReview.modal";
import RiviewsItemHeader from "./reviewitem.header/reviewitem.header";
import ReviewItem from "../reviewitems/items/review.item";
import ModalRemoveFile from "../reviews/modals/remove.modal";
import { withRouter } from "react-router";
class ReviewLayout extends PureComponent {
  componentDidUpdate(prevProps) {
    if (
      this.props.itemreview !== prevProps.itemreview ||
      this.props.reviewId !== prevProps.reviewId
    ) {
      this.props.getItemreviewsById(this.props.itemreview);
      this.props.getReviewById(this.props.reviewId);
    }
  }
  render() {
    const { account, accountLogo, cloneReview } = this.props;
    const { error, isLoaded, items, actionReviewItem } = this.props;
    const { handleInputChange, addReviewItem } = this.props;
    const { openModal, closeModal, showModalExport } = this.props;
    const { disableExport, handleChangeDisableExport } = this.props;
    const { editShowUploadingMessage, showUploadingMessage } = this.props;
    const { addReview, showModalAddReview, vendor } = this.props;
    const { owners, getOwners } = this.props;
    const {
      reviewId,
      reviewData,
      editReview,
      deleteReview,
      reviewDate,
      showModalDeleteReview,
      categoryId
    } = this.props;
    const {
      addCheckpoint,
      showModalAddReviewCheckpoint,
      checkpointName,
      checkpoint,
      checkpointId
    } = this.props;
    const {
      editItemreview,
      showEdit,
      itemreviewName,
      editshowEdit,
      openPanel,
      handlerPanelOpen
    } = this.props;
    const { sortItemreviews } = this.props;
    const { isOldReview, isDeletable } = this.props;
    const { closeModalEvent } = this.props;
    const {
      itemreviewDescription,
      showDescriptionEdit,
      editDecriptionEdit
    } = this.props;
    const {
      showTimeSlotEdit,
      showByEdit,
      showAttendeesEdit,
      editTimeSlotEdit,
      editByEdit,
      editAttendeesEdit
    } = this.props;
    const { deleteReviewItem } = this.props;
    const { load, isAddingReviewItem } = this.props;
    const { addThunderboltReviewItem } = this.props;
    const { categoryNAME } = this.props;
    const { setInverseIconActions, categoryActionId } = this.props;
    const {
      putAttachments,
      getAttachments,
      delAttachments,
      modalRemove,
      closeModalRemove,
      openModalRemove
    } = this.props;
    const { addRisk } = this.props;
    const { getItemreviewByCategoryId, itemsByCategory } = this.props;
    const { getItemreviewByReviewId, itemsByReview } = this.props;
    const { reviewTitle, remainingDays, showOverDateTriangle } = this.props;
    const { uploadProgress, setUploadProgress } = this.props;
    const openModalAddReviewCheckpoint = () => {
      if (isOldReview) {
        return;
      }
      openModal("showModalAddReviewCheckpoint");
    };
    const openModalReview = () => {
      openModal("showModalAddReview");
    };
    const openModalExport = () => openModal("showExport");
    const closeModalExport = () => closeModal("showExport");
    const closedReview = () => editReview(reviewId, { closed: true });

    const { modalRemoveRI, openModalRemoveRI, closeModalRemoveRI } = this.props;

    const modalHandldersReview = {
      show: showModalAddReview,
      addReview,
      closeModalEvent,
      vendor
    };

    const modalHandldersAddReviewCheckpoint = {
      handleInputChange,
      close: () => closeModal("showModalAddReviewCheckpoint"),
      show: showModalAddReviewCheckpoint,
      addCheckpoint,
      checkpointName
    };
    const disableAddReviewItemButton = [
      "Overdue Actions",
      "Actions (No Date)",
      "Future Actions"
    ].includes(checkpoint);
    const goToRoute = route => () => this.props.history.push(route);
    const handlerIconsStructure = {
      addReviewItem: () => {
        addReviewItem(reviewId, checkpointId, {
          name: "",
          description: "",
          order: 0
        });
      },
      goToRoute,
      openModalAddReviewCheckpoint,
      openModalExport,
      openModalReview,
      closedReview,
      isOldReview,
      isDeletable,
      isAddingReviewItem,
      openModalDeleteReview: () => openModal("showModalDeleteReview"),
      disableAddReviewItemButton,
      categoryNAME,
      cloneReview
    };
    let iconsData = iconsDataStructure(handlerIconsStructure);
    const itemsOpen = items.filter(
      ({ closed, deferred, ready }) => !closed && !deferred && !ready
    );
    const itemsReady = items.filter(({ ready }) => ready);
    const itemCovered = items.filter(
      ({ closed, deferred, ready }) => (closed || deferred) && !ready
    );

    const modalHandldersExport = {
      accountLogo,
      close: closeModalExport,
      show: showModalExport,
      items: {
        underCheckpoint: { items },
        underCategory: { items: itemsByCategory },
        underReview: { items: itemsByReview }
      },
      reviewData,
      categoryNAME,
      vendor,
      account,
      getItemreviewByCategoryId,
      getItemreviewByReviewId,
      reviewDate,
      reviewId,
      disableExport,
      handleChangeDisableExport,
      editReview,
      getAttachments
    };

    const handlerItemReview = {
      showTimeSlotEdit,
      showByEdit,
      showAttendeesEdit,
      editTimeSlotEdit,
      editByEdit,
      editAttendeesEdit,
      actionReviewItem,
      handleInputChange,
      editItemreview,
      showEdit,
      editshowEdit,
      itemreviewName,
      sortItemreviews,
      editShowUploadingMessage,
      showUploadingMessage,
      itemreviewDescription,
      showDescriptionEdit,
      editDecriptionEdit,
      deleteReviewItem,
      addThunderboltReviewItem,
      categoryNAME,
      setInverseIconActions,
      categoryActionId,
      putAttachments,
      getAttachments,
      delAttachments,
      openPanel,
      handlerPanelOpen,
      openModal,
      closeModal,
      modalRemove,
      closeModalRemove,
      openModalRemove,
      isOldReview,
      owners,
      getOwners,
      uploadProgress,
      setUploadProgress,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI,
      addRisk
    };

    const handlerItemreviewOpen = {
      items: itemsOpen,
      type: "open",
      ...handlerItemReview
    };

    const handlerItemreviewReady = {
      items:
        categoryNAME === "Action Log"
          ? itemsOpen.concat(itemsReady)
          : itemsReady,
      type: "ready",
      ...handlerItemReview
    };

    const handlerItemreviewCovered = {
      items: itemCovered,
      type: "closed",
      actionReviewItem,
      ...handlerItemReview
    };

    const modalHandlerDeleteReview = {
      show: showModalDeleteReview,
      deleteReview: () => deleteReview(reviewId),
      closeModal
    };
    const handlerReviewItemHeader = {
      reviewDate,
      reviewTitle,
      remainingDays,
      showOverDateTriangle,
      vendor
    };

    const handlerItemreviewExport = {
      ...handlerItemReview,
      categoryId,
      checkpointId,
      type: "ready",
      isPdf: true,
      isAgenda: false,
      fontSize: 9
    };

    const AddRILoadingSpinner = ({ render }) => (
      <React.Fragment>
        {isAddingReviewItem && (
          <LoadingSpinner
            height={200}
            size={100}
            text="Adding Review Item..."
          />
        )}
        {render()}
      </React.Fragment>
    );

    const isActionLog = categoryNAME === "Action Log";
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Loading load={load} />;
    } else {
      return (
        <div>
          <RiviewsItemHeader {...handlerReviewItemHeader} />
          <div className="itemreview">
            {!isActionLog ? (
              <div
                style={{
                  marginBottom: 65
                }}
                className={"tableOpenReviewItems"}
              >
                <CustomTabs
                  headerColor="warning"
                  title={`Open ${isActionLog ? "Action" : "Review"} Items`}
                  headerStyle={{ fontSize: 18 }}
                  cardBodyContent={
                    <AddRILoadingSpinner
                      render={() => (
                        <ItemReviews
                          {...{
                            ...handlerItemreviewOpen,
                            renderItem: props => <ReviewItem {...props} />
                          }}
                        />
                      )}
                    />
                  }
                />
              </div>
            ) : null}

            <div
              style={{ marginBottom: 65 }}
              className={"tableReadyRviewItems"}
            >
              <CustomTabs
                headerColor={isActionLog ? "warning" : "info"}
                title={`${isActionLog ? "Open" : "Ready"} ${
                  isActionLog ? "Action" : "Review"
                } Items`}
                headerStyle={{ fontSize: 18 }}
                cardBodyContent={
                  !isActionLog ? (
                    <ItemReviews
                      {...{
                        ...handlerItemreviewReady,
                        renderItem: props => <ReviewItem {...props} />
                      }}
                    />
                  ) : (
                    <AddRILoadingSpinner
                      render={() => (
                        <ItemReviews
                          {...{
                            ...handlerItemreviewReady,
                            renderItem: props => <ReviewItem {...props} />
                          }}
                        />
                      )}
                    />
                  )
                }
              />
            </div>
            <div className={"tableCoveredRviewItems"}>
              <CustomTabs
                headerColor="success"
                title={`${isActionLog ? "Done" : "Covered"} ${
                  isActionLog ? "Action" : "Review"
                } Items`}
                headerStyle={{ fontSize: 18 }}
                cardBodyContent={
                  <ItemReviews
                    {...{
                      ...handlerItemreviewCovered,
                      renderItem: props => <ReviewItem {...props} />
                    }}
                  />
                }
              />
            </div>
          </div>
          {reviewData ? <FixedIcons iconsData={iconsData} /> : null}
          {showModalExport ? (
            <ExportReviewitemModal
              {...{
                ...modalHandldersExport,
                handlerItemReview: handlerItemreviewExport
              }}
            />
          ) : null}
          {(modalRemove || {}).show ? (
            <ModalRemoveFile
              {...{
                show: (modalRemove || {}).show || false,
                closeModal: closeModalRemove,
                handlerClick: () =>
                  delAttachments(
                    (modalRemove || {}).itemreviewId,
                    (modalRemove || {}).fileId,
                    (modalRemove || {}).fileName
                  ),
                objectName: (modalRemove || {}).fileName,
                name: "showModalRemove",
                modalName: "Review Item File"
              }}
            />
          ) : null}
          {showModalAddReview && <AddReviewModal {...modalHandldersReview} />}
          <AddReviewCheckpontModal {...modalHandldersAddReviewCheckpoint} />
          <DeleteReviewModal {...modalHandlerDeleteReview} />
        </div>
      );
    }
  }
}

const mapStateToProps = ({ checkpoints }) => ({
  checkpoint: checkpoints.selectedCheckpoint
});

export default withRouter(connect(mapStateToProps)(ReviewLayout));
