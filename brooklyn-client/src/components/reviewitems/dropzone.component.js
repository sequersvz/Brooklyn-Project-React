import React from "react";
import Dropzone from "react-dropzone";
import { getFileNameFromUrl, getIconFromFileName } from "../../Utils";
import * as icons from "@fortawesome/free-solid-svg-icons/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import RichTextEditor from "../rich-text-editor";

class CustomDropzoneComponent extends React.PureComponent {
  editProperty = async (property, safeHtml) => {
    const { item, editDecriptionEdit, editItemreview } = this.props;
    editDecriptionEdit(item.id);
    if (safeHtml && typeof safeHtml !== "undefined") {
      await editItemreview(item.id, {
        [property]: safeHtml
      });
    }
  };

  messageIsOldReview = () => {
    const { isOldReview } = this.props;
    if (isOldReview) return "can not be modified";
    return "";
  };

  handleOnDrop = event => {
    const {
      item,
      isOldReview,
      editShowUploadingMessage,
      putAttachments,
      setUploadProgress
    } = this.props;

    if (isOldReview || event.length === 0) {
      return;
    }
    editShowUploadingMessage(item.id, true);

    putAttachments(event, item.id, setUploadProgress);
  };

  renderOverview = htmlString => {
    const {
      item,
      isOldReview,
      editDecriptionEdit,
      displayUploadFragment
    } = this.props;
    const handleClick = () => {
      if (!isOldReview) editDecriptionEdit(item.id);
    };
    return (
      <div
        style={{
          fontSize: 13,
          whiteSpace: "pre-wrap",
          cursor: "text",
          display: !displayUploadFragment
        }}
        onClick={handleClick}
        data-tip={`${this.messageIsOldReview()}`}
      >
        {htmlString || "Click to edit description"}
      </div>
    );
  };

  render() {
    const {
      item,
      items,
      isOldReview,
      dropzoneRef,
      displayUploadFragment,
      showDescriptionEdit,
      getAttachments,
      _openModal,
      uploadProgress,
      isMeetingItem
    } = this.props;
    if (!item || !items) return null;

    const isEditingEditor =
      !isOldReview && showDescriptionEdit && showDescriptionEdit[item.id];

    return (
      <Dropzone
        key={`c-dropzone-${item.id}`}
        disablePreview={true}
        disabled={isOldReview || isMeetingItem}
        onDrop={this.handleOnDrop}
        style={{
          height: "100%"
        }}
        ref={node => {
          dropzoneRef[item.id] = node;
        }}
        className={"dropzone"}
        activeClassName={"dropzoneactive"}
        activeStyle={{ border: "#117ede solid 1px" }}
        disableClick={true}
        minSize={
          150 //desabilita el click
        }
      >
        {" "}
        <div
          className="uploadingFragment"
          style={{
            display: displayUploadFragment
          }}
        >
          <div style={{ margin: "auto" }}>
            <FontAwesomeIcon
              spin
              icon={icons["faSpinner"]}
              style={{ marginRight: 10 }}
            />
            {`UPLOADING (${(uploadProgress || {})[item.id] || 0}%)...`}
          </div>
        </div>
        <RichTextEditor
          {...{
            key: item.id,
            itemId: item.id,
            text: item.description,
            property: "description",
            isEditing: isEditingEditor,
            editProperty: this.editProperty,
            renderOverview: this.renderOverview
          }}
        />
        <br />
        <div style={{ float: "left", textAlign: "left" }}>
          {isEditingEditor
            ? null
            : !isMeetingItem && item.files
              ? item.files.map(file => {
                  const fileName = getFileNameFromUrl(file.path);
                  const attachmentIcon = getIconFromFileName(fileName.pretty);
                  return (
                    <div key={file.id}>
                      <FontAwesomeIcon
                        icon={attachmentIcon}
                        pull="left"
                        color="#555555"
                        style={{ marginRight: 5 }}
                        data-tip="File type"
                      />
                      <p
                        style={{
                          cursor: "pointer",
                          display: "inline-block"
                        }}
                        onClick={() => getAttachments(fileName.original)}
                      >
                        {fileName.pretty}
                      </p>

                      <FontAwesomeIcon
                        icon={icons["faTrash"]}
                        color="#555555"
                        pull="right"
                        onClick={() => {
                          if (isOldReview) {
                            return;
                          }
                          _openModal(item.id, file.id, fileName.original);
                        }}
                        style={{ marginLeft: 5 }}
                        data-tip={`Delete${this.messageIsOldReview()}`}
                      />
                    </div>
                  );
                })
              : null}
        </div>
      </Dropzone>
    );
  }
}

export default CustomDropzoneComponent;
