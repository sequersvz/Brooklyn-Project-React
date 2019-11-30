import React, { Component } from "react";
import {
  getAttachments,
  delAttachments,
  putAttachments,
  addReviewitemFile
} from "../service/itemreview";

function MainContainerParentAttachments(WrappedComponent) {
  class ContainerParentAttachments extends Component {
    state = {
      showUploadingMessage: null,
      modalRemove: {}
    };

    _putAttachmentsOnSuccess = (reviewItemid, slug) =>
      this.editShowUploadingMessage(reviewItemid, slug);

    addReviewitemFileOnSuccess = customHandlerOnSuccess => () => {
      this.props.handleReloadReviewitem();
      customHandlerOnSuccess && customHandlerOnSuccess();
      this.editShowUploadingMessage();
    };
    _addReviewitemFile = customHandlerOnSuccess =>
      addReviewitemFile(
        this.addReviewitemFileOnSuccess(customHandlerOnSuccess),
        this.props.onError
      );

    editShowUploadingMessage = (idItem, slug) => {
      let showUploadingMessage = Object.assign(
        {},
        this.state.showUploadingMessage
      );
      showUploadingMessage[idItem] = slug;
      this.setState({ showUploadingMessage });
    };

    delAttachmentsOnSuccess = customHandlerOnSuccess => () => {
      this.props.handleReloadReviewitem();
      customHandlerOnSuccess && customHandlerOnSuccess();
      this.closeModalRemove();
    };
    getAttachmentsOnSuccess = result => {
      window.open(result);
    };

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
    _delAttachments = customHandlerOnSuccess =>
      delAttachments(
        this.delAttachmentsOnSuccess(customHandlerOnSuccess),
        this.onError
      );
    _getAttachments = getAttachments(
      this.getAttachmentsOnSuccess,
      this.onError
    );
    _putAttachments = customHandlerOnSuccess =>
      putAttachments(
        this._putAttachmentsOnSuccess,
        this.onError,
        this._addReviewitemFile(customHandlerOnSuccess)
      );

    render() {
      const handlers = {
        putAttachments: this._putAttachments,
        delAttachments: this._delAttachments,
        getAttachments: this._getAttachments,
        showUploadingMessage: this.state.showUploadingMessage,
        editShowUploadingMessage: this.editShowUploadingMessage,
        modalRemove: this.state.modalRemove,
        openModalRemove: this.openModalRemove,
        closeModalRemove: this.closeModalRemove
      };
      return (
        <WrappedComponent {...this.props} {...{ attachmentProps: handlers }} />
      );
    }
  }
  return ContainerParentAttachments;
}

export default MainContainerParentAttachments;
