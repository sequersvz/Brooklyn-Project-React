import React, { Component } from "react";
import LayoutWhatDoIHaveToDoToday from "../../components/whatDoIHaveToDoToday/layout.whatDoIHaveToDoToday";
import { connect } from "react-redux";
import { API } from "aws-amplify";
import { makeCancelable, parseSelectedFilters } from "../../Utils";
import { resetQueryFilters } from "../../actions/queryFilters";
import {
  putAttachments,
  delAttachments,
  getAttachments,
  addReviewitemFile
} from "../service/itemreview";
import { getQueryParams } from "../containers.Utils";

let lastRequestTokenSourceVendors = undefined;
let lastRequestTokenSourceCheckpointsPinned = undefined;

class ContainerWhatDoIHaveToDoToday extends Component {
  state = {
    vendors: [],
    openPanel: {},
    date: new Date(),
    loadingVendors: false,
    vendor: {},
    inverseIcon: {},
    showUploadingMessage: {},
    pagination: {
      totalVendors: 0,
      loadedVendors: 0,
      limit: 5
    },
    request: {
      loadMoreVendors: false
    },
    errors: {
      loadMoreVendors: false
    },
    modalRemove: {},
    modalRemoveRI: {}
  };

  onError = error => {
    // nothing is done with the error so far
    console.log(error);
  };

  _setState = properties =>
    this.setState(prevState => ({ ...prevState, properties }));
  _getQueryParams = getQueryParams(this.state, this._setState);

  getVendorsOnSuccess = () => result => {
    lastRequestTokenSourceVendors = undefined;
    this.setState(prevState => ({
      ...prevState,
      vendors: result.vendors,
      loadingVendors: false,
      pagination: {
        ...prevState.pagination,
        totalVendors: result.count,
        ...(!prevState.pagination.loadedVendors && {
          loadedVendors: prevState.pagination.limit
        })
      }
    }));
  };
  getVendors = (filters, oldlimit, oldOffset) => {
    if (lastRequestTokenSourceVendors) {
      lastRequestTokenSourceVendors.cancel();
    }
    const { limit, loadedVendors } = this.state.pagination;
    this.setState({ loadingVendors: true });
    let options = this._getQueryParams(filters);
    let onSuccess = this.getVendorsOnSuccess();
    const request = API.get(
      "UsersAPI",
      `/accounts/${
        this.props.user.attributes["custom:accountId"]
      }/vendors/nextreview?limit=${oldlimit ? oldlimit : limit}${
        oldOffset ? "" : loadedVendors ? "&offset=" + loadedVendors : ""
      }`,
      options
    );
    const cancellableRequest = makeCancelable(request);
    lastRequestTokenSourceVendors = cancellableRequest;

    cancellableRequest.promise
      .then(onSuccess)
      .catch(error => console.log(error));
  };

  getVendorByIdOnSuccess = (vendorId, KeyprocessId) => ({ vendors }) => {
    const vendor = vendors.find(
      vendor =>
        (vendor.keyprocess || {}).id === KeyprocessId && vendor.id === vendorId
    );
    const loadedVendors = [...this.state.vendors];
    const vendorIndex = loadedVendors.findIndex(
      vendor =>
        ((vendor.keyprocess || {}).id === KeyprocessId &&
          vendor.id === vendorId) ||
        (vendor.id === vendorId && vendor.type === "action-item-vendor")
    );
    console.log("{vendor, loadedVendors, vendorIndex}", {
      vendor,
      loadedVendors,
      vendorIndex
    });
    loadedVendors[vendorIndex] = vendor;
    const newLoadedVendors = loadedVendors;

    this.setState({ vendors: newLoadedVendors, loadingVendors: false });
  };

  getVendorById = (vendorId, KeyprocessId) => {
    this.setState({ loadingVendors: true });
    API.get(
      "UsersAPI",
      `/accounts/${
        this.props.user.attributes["custom:accountId"]
      }/vendors/nextreview?vendorId=${vendorId}`
    )
      .then(this.getVendorByIdOnSuccess(vendorId, KeyprocessId))
      .catch(this.onError);
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

  handleOnAddVendorReview = (vendorId, keyprocessId) => {
    this.setState({
      vendor: vendorId,
      keyprocessId
    });
    this.openModal("showModalAddReview");
  };

  actionReviewItemOnsuccess = (vendorId, KeyprocessId) => () => {
    this.getVendorById(vendorId, KeyprocessId);
  };

  actionReviewItem = (item, action, value = false) => {
    let actionsend = {};
    if (action === "open") {
      actionsend = { closed: false, deferred: false, ready: false };
    } else if (action === "recurring") {
      actionsend = { recurring: value === false ? true : false };
    } else if (action === "ready") {
      actionsend = { closed: false, deferred: false, ready: true, open: false };
    } else if (action === "closed") {
      actionsend = { open: false, deferred: false, ready: false, closed: true };
    } else if (action === "deferred") {
      actionsend = { open: false, deferred: true, ready: false, closed: false };
    }
    let mVendors = [...this.state.vendors];
    let i = mVendors.findIndex(
      v =>
        v.id === item.vendorId && (v.keyprocess || {}).id === item.keyprocessId
    );
    let j =
      i > -1
        ? mVendors[i].nextReview
          ? mVendors[i].nextReview.rc.findIndex(
              rc => rc.checkpointId === item.checkpointId
            )
          : null
        : null;
    let k =
      j > -1
        ? mVendors[i].nextReview
          ? mVendors[i].nextReview.rc[j].itemreviews.findIndex(
              ir => ir.id === item.id
            )
          : null
        : null;
    if (k > -1) {
      let optimisticVendors = [...mVendors];
      optimisticVendors[i].nextReview.rc[j].itemreviews[k] = {
        ...optimisticVendors[i].nextReview.rc[j].itemreviews[k],
        ...actionsend
      };
      this.setState({ vendors: optimisticVendors });
    }
    let options = {
      body: actionsend
    };
    let onSuccess = this.actionReviewItemOnsuccess(
      item.vendorId,
      item.keyprocessId
    );
    API.patch("UsersAPI", `/itemreviews/${item.id}`, options)
      .then(onSuccess)
      .catch(e => {
        this.setState({ vendors: mVendors });
        this.onError(e);
      });
  };

  deleteReviewItemOnsusccess = (vendorId, keyprocessId) => () => {
    this.getVendorById(vendorId, keyprocessId);
  };
  deleteReviewItem = item => {
    console.log(item);
    let onSuccess = this.deleteReviewItemOnsusccess(
      item.vendorId,
      item.keyprocessId
    );
    API.del("UsersAPI", `/itemreviews/${item.id}`, {})
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
  editItemreviewOnSuccess = (props, itemreviewId) => () => {
    let filters = {};
    if (Object.keys(this.props.searchKitQueryFilters).length > 0) {
      filters = parseSelectedFilters({ ...this.props.searchKitQueryFilters });
    }
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
      () => {
        this.getVendors(filters, (this.state.vendors || []).length, true);
      }
    );
  };
  editItemreview = (itemreviewId, properties) => {
    let options = {
      body: properties
    };
    let onSuccess = this.editItemreviewOnSuccess(this.props, itemreviewId);
    API.patch("UsersAPI", `/itemreviews/${itemreviewId}`, options)
      .then(onSuccess)
      .catch(this.onError);
  };

  closeModalEvent = () => {
    this.closeModal("showModalAddReview");
    this.setState({
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    });
  };

  addReviewOnSucess = result => {
    this.setState({
      reviewCreated: true,
      reviewId: result.id
    });
    this.getVendorById(this.state.vendor, result.keyprocessId);
    this.closeModal("showModalAddReview");
  };
  addReview = async (review, submitting) => {
    const options = {
      method: "POST",
      body: {
        ...review,
        accountId: this.props.user.attributes["custom:accountId"]
      }
    };
    try {
      const result = await API.post(
        "UsersAPI",
        `/reviews/addcheckpoints`,
        options
      );
      this.addReviewOnSucess(result);
    } catch (err) {
      this.onError(err);
    } finally {
      submitting(false);
    }
  };

  _addReviewitemFileOnSuccess = () => {
    this.getVendors({});
    this.editShowUploadingMessage();
  };

  addReviewitemFile = addReviewitemFile(
    this._addReviewitemFileOnSuccess,
    this.onError
  );

  getAttachmentsOnSuccess = result => {
    window.open(result);
  };

  getAttachments = getAttachments(this.getAttachmentsOnSuccess, this.onError);

  putAttachmentsOnSuccess = (reviewItemid, slug) =>
    this.editShowUploadingMessage(reviewItemid, slug);

  putAttachments = putAttachments(
    this.putAttachmentsOnSuccess,
    this.onError,
    this.addReviewitemFile
  );

  _delAttachmentsOnSuccess = () => {
    this.getVendors({});
    this.closeModalRemove();
  };

  delAttachments = delAttachments(this._delAttachmentsOnSuccess, this.onError);

  closeModal = modalName => this.setState({ [modalName]: false });

  openModal = modalName => this.setState({ [modalName]: true });

  closeModalRemove = () =>
    this.setState({
      modalRemove: {
        show: false
      }
    });
  openModalRemove = (itemreviewId, fileId, fileName) =>
    this.setState({
      modalRemove: {
        show: true,
        itemreviewId,
        fileId,
        fileName
      }
    });

  actionCheckpointMenuOnSuccess = (vendorId, keyprocessId) => () => {
    lastRequestTokenSourceCheckpointsPinned = undefined;
    this.getVendorById(vendorId, keyprocessId);
  };

  actionCheckpointMenu = (item, pinned, vendorId) => {
    if (lastRequestTokenSourceCheckpointsPinned) {
      lastRequestTokenSourceCheckpointsPinned.cancel();
    }
    let { reviewId, checkpointId } = item;
    let mVendors = [...this.state.vendors];
    let i = mVendors.findIndex(v => v.id === vendorId);
    let j =
      i > -1
        ? mVendors[i].nextReview
          ? mVendors[i].nextReview.rc.findIndex(rc => rc.id === item.id)
          : null
        : null;
    if (j) {
      let optimisticVendors = [...mVendors];
      optimisticVendors[i].nextReview.rc[j] = {
        ...optimisticVendors[i].nextReview.rc[j],
        pinned
      };
      this.setState({ vendors: optimisticVendors });
    }
    let successHandler = this.actionCheckpointMenuOnSuccess(
      vendorId,
      item.keyprocessId
    );
    const request = API.patch(
      "UsersAPI",
      `/reviews/${reviewId}/checkpoint/${checkpointId}`,
      {
        body: { pinned: pinned }
      }
    );

    const cancellableRequest = makeCancelable(request);
    lastRequestTokenSourceCheckpointsPinned = cancellableRequest;

    cancellableRequest.promise
      .then(successHandler, error => {
        this.setState({
          vendors: mVendors,
          isLoaded: true,
          error
        });
      })
      .catch(error => console.log(error));
  };

  setInverseIconActions = categoryId => {
    this.setState({
      inverseIcon: {
        [categoryId]:
          categoryId in this.state.inverseIcon
            ? !this.state.inverseIcon[categoryId]
            : true
      }
    });
  };
  editShowUploadingMessage = (idItem, slug) => {
    let showUploadingMessage = Object.assign(
      {},
      this.state.showUploadingMessage
    );
    showUploadingMessage[idItem] = slug;
    this.setState({ showUploadingMessage });
  };

  loadMoreVendors = () => {
    let filters = {};
    if (Object.keys(this.props.searchKitQueryFilters).length > 0) {
      filters = parseSelectedFilters({ ...this.props.searchKitQueryFilters });
    }
    if (lastRequestTokenSourceVendors) {
      lastRequestTokenSourceVendors.cancel();
    }
    const { limit, loadedVendors } = this.state.pagination;
    let options = this._getQueryParams(filters);
    this.setState(
      prevState => ({
        ...prevState,
        request: {
          ...prevState.request,
          loadMoreVendors: true
        },
        errors: {
          ...prevState.errors,
          loadMoreVendors: false
        }
      }),
      async () => {
        try {
          const request = API.get(
            "UsersAPI",
            `/accounts/${
              this.props.user.attributes["custom:accountId"]
            }/vendors/nextreview?limit=${limit}${
              loadedVendors > 0 ? "&offset=" + loadedVendors : ""
            }`,
            options
          );
          const cancellableRequest = makeCancelable(request);
          lastRequestTokenSourceVendors = cancellableRequest;
          const { vendors } = await cancellableRequest.promise;
          this.setState(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              loadMoreVendors: false
            },
            pagination: {
              ...prevState.pagination,
              loadedVendors: loadedVendors + limit
            },
            vendors: prevState.vendors.concat(vendors)
          }));
        } catch (error) {
          this.setState(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              loadMoreVendors: false
            },
            errors: {
              ...prevState.errors,
              loadMoreVendors: true
            }
          }));
        }
      }
    );
  };

  getVendorsFromSearchKit = filters =>
    this.setState({ pagination: { limit: 5 } }, () => this.getVendors(filters));

  render() {
    const handlers = {
      vendors: this.state.vendors,
      actionReviewItem: this.actionReviewItem,
      deleteReviewItem: this.deleteReviewItem,
      handlerPanelOpen: this.handlerPanelOpen,
      openPanel: this.state.openPanel,
      handleInputChange: this.handleInputChange,
      editItemreview: this.editItemreview,
      showModalAddReview: this.state.showModalAddReview,
      addReview: this.addReview,
      date: this.state.date,
      vendor: this.state.vendor,
      keyprocessId: this.state.keyprocessId,
      loadingVendors: this.state.loadingVendors,
      getVendors: this.getVendorsFromSearchKit,
      isErrorTitle: this.state.isErrorTitle,
      handleDateChange: date => this.setState({ date }),
      handleisErrorTitleChange: isErrorTitle => this.setState({ isErrorTitle }),
      closeModalEvent: this.closeModalEvent,
      closeModal: this.closeModal,
      openModal: this.openModal,
      handleOnAddVendorReview: this.handleOnAddVendorReview,
      actionCheckpointMenu: this.actionCheckpointMenu,
      setInverseIconActions: this.setInverseIconActions,
      editDecriptionEdit: id =>
        this.setState({
          showDescriptionEdit: {
            [id]:
              typeof this.state.showDescriptionEdit !== "undefined"
                ? !this.state.showDescriptionEdit[id]
                : true
          }
        }),
      showDescriptionEdit: this.state.showDescriptionEdit,

      editshowEdit: id =>
        this.setState({
          showEdit: {
            [id]:
              typeof this.state.showEdit !== "undefined"
                ? !this.state.showEdit[id]
                : true
          }
        }),
      showEdit: this.state.showEdit,

      modalRemove: this.state.modalRemove,
      closeModalRemove: this.closeModalRemove,
      openModalRemove: this.openModalRemove,

      putAttachments: this.putAttachments,
      getAttachments: this.getAttachments,
      delAttachments: this.delAttachments,

      editShowUploadingMessage: this.editShowUploadingMessage,
      showUploadingMessage: this.state.showUploadingMessage,
      loadMoreVendors: this.loadMoreVendors,
      loadingMoreVendors: this.state.request.loadMoreVendors,
      showLoadMoreButton:
        this.state.pagination.loadedVendors <
          this.state.pagination.totalVendors &&
        this.state.pagination.totalVendors > this.state.pagination.limit,

      modalRemoveRI: this.state.modalRemoveRI,
      openModalRemoveRI: item =>
        this.setState({
          modalRemoveRI: { [item.id]: { show: true, item } }
        }),
      closeModalRemoveRI: () => this.setState({ modalRemoveRI: {} })
    };
    return (
      <div>
        <LayoutWhatDoIHaveToDoToday {...handlers} />
      </div>
    );
  }
}

// con esta function se inserta las variables a los prod del componente instanciado
const mapStateToProps = state => {
  return {
    user: state.user,
    searchKitQueryFilters: state.queryFilters,
    stateStore: state
  };
};
//con esta function se sirven las functions para ejecutar en el container, al ejecutar estas functions la function anterior
//inserta los resultados en las props
const mapDispatchToProps = dispatch => ({
  resetQueryFilters: () => {
    dispatch(resetQueryFilters());
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerWhatDoIHaveToDoToday);
