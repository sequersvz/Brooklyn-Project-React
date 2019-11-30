import React, { Component } from "react";
import { monthNames } from "../../config/config";
import LayoutReview from "../../components/reviews/review.layout";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { API } from "aws-amplify";
import { getUserOwners } from "../service/user";
import {
  actionReviewItem,
  sortItemreviews,
  editItemreview,
  getItemreviews,
  addReviewItem,
  getCheckpoints,
  editReviewItemName,
  addRisk
} from "../service/itemreview";
import {
  editReview,
  addReview,
  deleteReview,
  addCheckpoint,
  getReviewsOpen,
  getReviewById,
  cloneReview
} from "../service/review";
import MainContainerParentAttachments from "../parentContainers/attachments.container";
import { getLogo } from "../service";

class ContainerReviews extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: [],
    reviewDate: "",
    vendorName: "",
    vendor: {},
    editNotes: false,
    date: new Date(),
    showMockup: "itemreviewMockup",
    notify: { show: false },
    load: true,
    title: "",
    showUploadingMessage: {},
    openPanel: {},
    disableExport: true,
    disableSaveButton: false,
    isOldReview: undefined,
    isAddingReviewItem: false,
    showModalDeleteReview: false,
    showModalAddReview: false,
    owners: [],
    modalRemove: {},
    uploadProgress: {},
    modalRemoveRI: {}
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.reloadCheck !== this.props.reloadCheck) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.itemreview !== prevProps.itemreview ||
      this.props.reloadReviewitem !== prevProps.reloadReviewitem ||
      this.props.reviewId !== prevProps.reviewId
    ) {
      this.getItemreviewsById(this.props.itemreview);
      this.getReviewById(this.props.reviewId);
      this.props.handleReloadcheck();
      this.setState(
        Object.assign({}, { reviewId: this.props.reviewId }, this.state)
      );
      const params = new URLSearchParams(this.props.location.search);
      if (params.get("categoryId") !== null && params.get("categoryId") !== 0)
        this.getCategoryById(params.get("categoryId"));
    }
    if (this.props.user !== prevProps.user) {
      this.getReviewsOpen(this.props.user.attributes["custom:account"]);
    }
  }

  componentDidMount() {
    const { location, reviewId } = this.props;
    this.getReviewById(reviewId);
    const params = new URLSearchParams(location.search);
    if (params.get("categoryId") && params.get("categoryId") > 0) {
      this.getCategoryById(params.get("categoryId"));
    }
    if (params.get("checkpointId")) {
      this.getItemreviewsById(params.get("checkpointId"));
    }
    this.getOwners();
    if (location.state && location.state.isForSendingAgenda) {
      this.openModal("showExport");
    }
  }

  onError = error => {
    this.handlerNotify("ERROR - Something went wrong", "error");
    console.error("ERROR - Something went wrong", error);
    this.setState({
      isLoaded: true,
      error
    });
  };

  setUploadProgress = (id, progress) => {
    this.setState(prevState => ({
      ...prevState,
      uploadProgress: {
        ...prevState.uploadProgress,
        [id]: progress
      }
    }));
  };

  _getCategoryByIdByIdOnsuccess = () => result => {
    this.setState({
      categoryNAME: result.name,
      categoryLogo: result.iconClassName
    });
  };
  getCategoryById = id => {
    let onSuccess = this._getCategoryByIdByIdOnsuccess();
    API.get("UsersAPI", `/category/${id}`, {})
      .then(onSuccess)
      .catch(this.onError);
  };

  getItemreviews = (by, onSuccess) =>
    getItemreviews(onSuccess, this.onError)(this.props.reviewId, by);

  getItemreviewsById = checkpointId => {
    const onSuccess = this._getItemreviewByIdOnsuccess(checkpointId);
    let by = `?checkpointId=${checkpointId}`;
    this.getItemreviews(by, onSuccess);
  };

  _getItemreviewByCategoryIdOnsuccess = () => result => {
    this.setState({
      isLoaded: true,
      itemsByCategory: result,
      disableExport: false
    });
  };

  _getItemreviewByIdOnsuccess = checkpointId => result => {
    this.setState({
      isLoaded: true,
      items: result,
      checkpointId: checkpointId
    });
  };

  getItemreviewByCategoryId = async categoryId => {
    if (!categoryId) {
      const params = new URLSearchParams(this.props.location.search);
      categoryId = params.get("categoryId");
    }
    const onSuccess = this._getItemreviewByCategoryIdOnsuccess();
    let by = `?categoryId=${categoryId}`;
    this.getItemreviews(by, onSuccess);
  };

  _getItemreviewByReviewIdOnsuccess = () => async result => {
    await this.setState({
      disableExport: false,
      isLoaded: true,
      itemsByReview: result
    });
  };
  getItemreviewByReviewId = () => {
    const onSuccess = this._getItemreviewByReviewIdOnsuccess();
    let by = ``;
    this.getItemreviews(by, onSuccess);
  };

  getReviewByIdOnSccess = async result => {
    if (result) {
      const { account } = this.props;
      let accountLogo = account.logoPath;
      if ((result.vendor || {}).logo) {
        try {
          const logo = await getLogo(result.vendor.logo);
          result.vendor.logo = logo;
          accountLogo = await getLogo(account.logoPath);
        } catch (error) {
          console.log(error);
        }
      }
      const date = moment(result["date"]);
      const month = monthNames[date.month()];
      let _dateFormat = date.format("DD-MM-YYYY");
      let reviewDate = new Date(result.date);
      const remainingDays = this.getRemainingDays(result);
      this.setState({
        accountLogo,
        reviewData: result,
        isLoaded: true,
        reviewDate: `${_dateFormat.split("-")[0]} ${month} ${date.year()}`,
        reviewTitle: result.notes,
        reviewDateFormat: _dateFormat,
        vendor: result["vendor"] ? result["vendor"] : {},
        vendorName: result["vendor"] ? result["vendor"]["name"] : "No vendor",
        vendorLogo: result["vendor"] ? result["vendor"]["logo"] : "No logo",
        disableExport: false,
        isOldReview:
          this.props.currentDateMinus7.getTime() >= reviewDate.getTime(),
        isDeletable: result.reviewItems && result.reviewItems.length > 0,
        ...remainingDays
      });
    }
  };

  getReviewById = review => {
    getReviewById(this.getReviewByIdOnSccess, error => {
      this.onError(error);
      if ((error.response || {}).status === 404) {
        this.props.history.push("/assurance");
      }
    })(review);
  };

  actionReviewItemOnsuccess = () => {
    this.props.handleReloadcheck();
    this.getItemreviewsById(this.props.itemreview);
  };

  deleteReviewOnSuccess = () => {
    this.props.history.push("/assurance");
  };

  addReviewItemOnSuccess = () => {
    this.props.handleReloadcheck();
    this.props.handleReloadReviewitem();
    this.closeModal("showAdd");
    this.disableAddingReviewItem(false);
    const newState = { ...this.state };
    delete newState.itemName;
    delete newState.itemDescription;
    this.setState(newState);
  };

  addCheckpointOnSuccess = () => {
    this.props.handleReloadcheck();
    this.props.handleReloadReviewitem();
    this.closeModal("showModalAddReviewCheckpoint");
    this.setState(prevState => ({ ...prevState, checkpointName: undefined }));
  };

  addReviewOnSuccess = id => {
    this.setState({
      reviewCreated: true,
      reviewId: id
    });
    this.closeModal("showModalAddReview");
    this.props.history.push("/assurance/review/" + id);
  };

  sortItemreviewsOnSucess = newSort => () => {
    let allItems = [...newSort];
    this.state.items.forEach(item => {
      if (!newSort.includes(item)) {
        allItems.push(item);
      }
    });
    this.setState({ items: allItems });
  };

  editReviewOnsusccess = () => {
    this.getReviewById(this.props.reviewId);
  };
  deleteReviewItemOnSucess = () => {
    this.props.handleReloadReviewitem();
  };

  editItemreviewOnSuccess = itemreviewId => () => {
    this.setState(
      prevState => ({
        ...prevState,
        showEdit: {
          ...prevState.showEdit,
          [itemreviewId]: false
        },
        showDescriptionEdit: {
          ...prevState.showDescriptionEdit,
          [itemreviewId]: false
        },
        itemreviewName: undefined,
        itemreviewDescription: undefined
      }),
      () => this.props.handleReloadReviewitem()
    );
  };

  updateItemReviews = ({ itemreviewId, action }, callback) =>
    this.setState(
      prevState => ({
        ...prevState,
        items: prevState.items.map(itemReview => {
          if (itemReview.id === itemreviewId) {
            return {
              ...itemReview,
              actioned: action === "update"
            };
          }
          return itemReview;
        })
      }),
      callback
    );

  addThunderboltReviewItemOnSuccess = itemReviewId => () => {
    this.editItemreview(itemReviewId, { actioned: true });
    this.props.handleReloadcheck();
    this.props.handleReloadReviewitem();
  };

  addThunderboltReviewItemOnError = itemreview => error => {
    this.onError(error);
    this.updateItemReviews({
      itemreviewId: itemreview.id,
      action: "cancel"
    });
  };

  addRisk = async itemreview => {
    this.setState(
      prevState => ({
        ...prevState,
        items: prevState.items.map(item => {
          if (item.id === itemreview.id) {
            return {
              ...item,
              // assign true just to make the button turn blue and non-clickable after clicking on it
              riskId: true
            };
          }
          return item;
        })
      }),
      async () => {
        try {
          await addRisk(itemreview);
        } catch (error) {
          this.setState(
            prevState => ({
              ...prevState,
              items: prevState.items.map(item => {
                if (item.id === itemreview.id) {
                  return {
                    ...item,
                    riskId: null
                  };
                }
                return item;
              })
            }),
            () => this.onError(error)
          );
        }
      }
    );
  };

  editItemreviewonError = (itemreviewId, properties) => error => {
    this.onError(error);
    const [propName] = Object.keys(properties);
    if (propName === "actioned") {
      this.updateItemReviews({ itemreviewId, action: "cancel" });
    }
  };

  getCheckpointsOSuccess = itemreview => result => {
    const checkpoint = result.find(({ name }) => name === "New Actions");
    if (!checkpoint) {
      return;
    }

    let options = {
      name: itemreview.name,
      description: itemreview.description,
      itemreviewParent: itemreview.id
    };

    let onSuccess = this.addThunderboltReviewItemOnSuccess(itemreview.id);

    addReviewItem(onSuccess, this.addThunderboltReviewItemOnError(itemreview))(
      this.props.reviewId,
      checkpoint.id,
      options
    );
  };

  editReviewItemName = (id, props) => {
    this.setState(
      prevState => ({
        ...prevState,
        showEdit: {
          ...prevState.showEdit,
          [id]: false
        },
        showDescriptionEdit: {
          ...prevState.showDescriptionEdit,
          [id]: false
        },
        itemreviewName: undefined,
        itemreviewDescription: undefined,
        items: prevState.items.map(item => {
          if (item.id === id) {
            return { ...item, ...props };
          }
          return item;
        })
      }),
      async () => {
        try {
          await editReviewItemName(id, props);
        } catch (error) {
          this.onError(error);
        }
      }
    );
  };

  editItemreview = (itemreviewId, properties) => {
    if (properties.closed === true) {
      properties.usercloseditId = this.props.user.id;
    }
    if (Reflect.has(properties, "name")) {
      this.editReviewItemName(itemreviewId, properties);
    } else {
      return editItemreview(
        this.editItemreviewOnSuccess,
        this.editItemreviewonError(itemreviewId, properties)
      )(itemreviewId, properties);
    }
  };

  getVendorsOnSuccess = () => result => {
    this.setState({
      isLoaded: true,
      vendors: result
    });
  };
  getVendors = () => {
    let onSuccess = this.getVendorsOnSuccess();
    API.get("UsersAPI", `/vendors`, {})
      .then(onSuccess)
      .catch(this.onError);
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  getReviewsOpenOnSuccess = () => result => {
    this.setState({
      reviewsOpen: result
    });
  };

  addThunderboltReviewItem = itemreview => {
    this.updateItemReviews(
      { itemreviewId: itemreview.id, action: "update" },
      async () => {
        try {
          await API.patch("UsersAPI", `/itemreviews/${itemreview.id}`, {
            body: { actioned: true }
          });
          getCheckpoints(this.getCheckpointsOSuccess(itemreview), this.onError);
        } catch (error) {
          this.updateItemReviews({
            itemreviewId: itemreview.id,
            action: "cancel"
          });
        }
      }
    );
  };

  addReview = addReview(
    this.addReviewOnSuccess,
    this.onError,
    this.props.user.attributes["custom:accountId"]
  );

  deleteReview = deleteReview(this.deleteReviewOnSuccess, this.onError);

  editReview = editReview(this.editReviewOnsusccess, this.onError);

  getReviewsOpen = getReviewsOpen(this.getReviewsOpenOnSuccess, this.onError);

  addReviewItem = addReviewItem(this.addReviewItemOnSuccess, this.onError);

  actionReviewItem = actionReviewItem(
    this.actionReviewItemOnsuccess,
    this.onError
  );

  deleteReviewItem = reviewItem => {
    const oldItems = this.state.items.slice();
    let newItems = oldItems.map(
      item => (item.id === reviewItem.id ? { ...item, deleted: true } : item)
    );
    // disable the delete button as soon as it it clicked
    this.setState({ items: newItems, modalRemoveRI: {} }, async () => {
      try {
        await API.del("UsersAPI", `/itemreviews/${reviewItem.id}`, {});
        if (reviewItem.itemreviewParent) {
          await API.patch(
            "UsersAPI",
            `/itemreviews/${reviewItem.itemreviewParent}`,
            {
              body: { actioned: false }
            }
          );
        }
        this.deleteReviewItemOnSucess();
      } catch (error) {
        this.onError(error);
        this.setState({ items: oldItems });
      }
    });
  };

  sortItemreviews = sortItemreviews(this.sortItemreviewsOnSucess, this.onError);

  addCheckpoint = addCheckpoint(
    this.addCheckpointOnSuccess,
    this.onError,
    () => {
      return {
        checkpointName: this.state.checkpointName,
        accountId: this.props.user.attributes["custom:accountId"],
        reviewId: this.props.reviewId,
        categoryId: this.props.categoryId
      };
    }
  );

  closeModal = modalName => this.setState({ [modalName]: false });
  openModal = modalName => this.setState({ [modalName]: true });

  disableAddingReviewItem = bool => {
    this.setState({
      isAddingReviewItem: bool
    });
  };

  handlerNotify = (message, type) => {
    let objetNotify = { message: message, type, show: true };
    this.setState({ notify: objetNotify });
    setTimeout(() => this.setState({ notify: { show: false } }), 5000);
  };

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

  closeModalEvent = () => {
    this.setState({ title: "", isErrorTitle: false });
    this.closeModal("showModalAddReview");
    this.setState({
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    });
  };

  getRemainingDays = reviewData => {
    let one_day = 1000 * 60 * 60 * 24;
    let currentDate = new Date().getTime();
    if (!reviewData) {
      return {};
    }
    let reviewDateAdd7 = new Date(reviewData.date).setDate(
      new Date(reviewData.date).getDate() + 7
    );
    let difference_ms = reviewDateAdd7 - currentDate;
    let remainingDays = Math.round(difference_ms / one_day);
    if (remainingDays < 0) {
      remainingDays = "You can't edit this";
    } else {
      remainingDays = remainingDays + " days left to edit this";
    }

    let showOverDateTriangle =
      new Date(reviewData.date).getTime() < currentDate;
    return { remainingDays, showOverDateTriangle };
  };
  getOwnersOnSuccess = result => {
    this.setState({
      owners: result
    });
  };
  getOwners = () => getUserOwners(this.getOwnersOnSuccess)(this.props.reviewId);

  updateEditingField = (id, field) => {
    this.setState({
      [field]: {
        [id]:
          typeof this.state[field] !== "undefined"
            ? !this.state[field][id]
            : true
      }
    });
  };

  cloneReviewOnSuccess = result => {
    this.props.history.push("/assurance/review/" + result.id);
  };
  cloneReview = () =>
    cloneReview(this.cloneReviewOnSuccess)(this.props.reviewId);

  editshowEdit = id => this.updateEditingField(id, "showEdit");
  editTimeSlotEdit = id => this.updateEditingField(id, "showTimeSlotEdit");
  editByEdit = id => this.updateEditingField(id, "showByEdit");
  editAttendeesEdit = id => this.updateEditingField(id, "showAttendeesEdit");
  editDecriptionEdit = id => this.updateEditingField(id, "showDescriptionEdit");

  _addReviewItem = (reviewId, checkpoint, properties) => {
    this.disableAddingReviewItem(true);
    return this.addReviewItem(reviewId, checkpoint, properties);
  };
  handleDateChange = date => this.setState({ date });
  handleInputOnTheFly = properties => this.setState(properties);
  changeMockup = value => this.setState({ showMockup: value });
  changeLoad = value => this.setState({ load: value });
  handleChangeDisableExport = value => this.setState({ disableExport: value });
  closeModalRemoveRI = () => this.setState({ modalRemoveRI: {} });
  openModalRemoveRI = item =>
    this.setState({
      modalRemoveRI: { [item.id]: { show: true, item } }
    });
  putAttachments = this.props.attachmentProps.putAttachments();
  delAttachments = this.props.attachmentProps.delAttachments();
  render() {
    const handlers = {
      account: this.props.account,
      accountLogo: this.state.accountLogo,
      getItemreviewsById: this.getItemreviewsById,
      getReviewById: this.getReviewById,
      actionReviewItem: this.actionReviewItem,
      itemreview: this.props.itemreview,
      isLoaded: this.state.isLoaded,
      items: this.state.items,
      handleInputChange: this.handleInputChange,
      addReviewItem: this._addReviewItem,
      isAddingReviewItem: this.state.isAddingReviewItem,
      showModalAdd: this.state.showAdd,
      showModalExport: this.state.showExport,

      openModal: this.openModal,
      closeModal: this.closeModal,

      showModalAddReview: this.state.showModalAddReview,
      addReview: this.addReview,
      getVendors: this.getVendors,
      handleDateChange: this.handleDateChange,
      date: this.state.date,
      reviewCreated: this.state.reviewCreated,
      reviewId: this.props.reviewId,

      editReview: this.editReview,
      deleteReview: this.deleteReview,
      reviewDate: this.state.reviewDate,
      reviewTitle: this.state.reviewTitle,
      reviewDateFormat: this.state.reviewDateFormat,
      vendorName: this.state.vendorName,
      vendorLogo: this.state.vendorLogo,
      vendor: this.state.vendor,
      reviewNotes: this.state.reviewNotes,
      editNotes: this.state.editNotes,
      handleImputOnTheFly: this.handleInputOnTheFly,
      showModalDeleteReview: this.state.showModalDeleteReview,

      changeMockup: this.changeMockup,
      showMockup: this.state.showMockup,
      notify: this.state.notify,

      categoryId: this.props.categoryId,
      categoryName: this.props.categoryName,
      addCheckpoint: this.addCheckpoint,
      showModalAddReviewCheckpoint: this.state.showModalAddReviewCheckpoint,
      checkpointName: this.state.checkpointName,
      checkpointId: this.state.checkpointId,

      editItemreview: this.editItemreview,
      showEdit: this.state.showEdit,
      showTimeSlotEdit: this.state.showTimeSlotEdit,
      showByEdit: this.state.showByEdit,
      showAttendeesEdit: this.state.showAttendeesEdit,
      editshowEdit: this.editshowEdit,
      editTimeSlotEdit: this.editTimeSlotEdit,
      editByEdit: this.editByEdit,
      editAttendeesEdit: this.editAttendeesEdit,
      editDecriptionEdit: this.editDecriptionEdit,
      itemreviewName: this.state.itemreviewName,

      sortItemreviews: this.sortItemreviews,
      itemreviewDescription: this.state.itemreviewDescription,
      showDescriptionEdit: this.state.showDescriptionEdit,

      reviewData: this.state.reviewData,

      reviewsOpen: this.state.reviewsOpen,
      getReviewsOpen: this.getReviewsOpen,

      deleteReviewItem: this.deleteReviewItem,
      load: this.state.load,
      changeLoad: this.changeLoad,
      addThunderboltReviewItem: this.addThunderboltReviewItem,

      categoryNAME: this.state.categoryNAME,

      setInverseIconActions: this.props.setInverseIconActions,
      categoryActionId: this.props.categoryActionId,

      putAttachments: this.putAttachments,
      getAttachments: this.props.attachmentProps.getAttachments,
      delAttachments: this.delAttachments,
      title: this.state.title,
      closeModalEvent: this.closeModalEvent,
      isErrorTitle: this.state.isErrorTitle,

      openPanel: this.state.openPanel,
      handlerPanelOpen: this.handlerPanelOpen,
      modalRemove: this.props.attachmentProps.modalRemove,
      closeModalRemove: this.props.attachmentProps.closeModalRemove,
      openModalRemove: this.props.attachmentProps.openModalRemove,

      modalRemoveRI: this.state.modalRemoveRI,
      openModalRemoveRI: this.openModalRemoveRI,
      closeModalRemoveRI: this.closeModalRemoveRI,

      itemsByCategory: this.state.itemsByCategory,
      getItemreviewByCategoryId: this.getItemreviewByCategoryId,
      itemsByReview: this.state.itemsByReview,
      getItemreviewByReviewId: this.getItemreviewByReviewId,
      disableExport: this.state.disableExport,
      disableSaveButton: this.state.disableSaveButton,
      isOldReview: this.state.isOldReview,
      isDeletable: this.state.isDeletable,
      remainingDays: this.state.remainingDays,
      showOverDateTriangle: this.state.showOverDateTriangle,
      editShowUploadingMessage: this.props.attachmentProps
        .editShowUploadingMessage,
      showUploadingMessage: this.props.attachmentProps.showUploadingMessage,
      handleChangeDisableExport: this.handleChangeDisableExport,
      owners: this.state.owners,
      getOwners: this.getOwners,
      setUploadProgress: this.setUploadProgress,
      uploadProgress: this.state.uploadProgress,
      cloneReview: this.cloneReview,
      addRisk: this.addRisk
    };
    return (
      <div>
        <LayoutReview {...handlers} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    account: state.account
  };
};
const _MainContainerParentAttachments = MainContainerParentAttachments(
  connect(mapStateToProps)(withRouter(ContainerReviews))
);

export default _MainContainerParentAttachments;
