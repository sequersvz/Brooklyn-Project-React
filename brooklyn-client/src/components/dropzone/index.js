import React, { PureComponent } from "react";
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/index";
import PropTypes from "prop-types";
export default class Index extends PureComponent {
  state = {
    error: ""
  };
  render() {
    const {
      accept,
      style,
      mainLogo,
      dropText,
      handleOnDrop,
      previewFiles,
      showUploadingMessage,
      uploadingMessage
    } = this.props;
    const acceptance =
      accept === "image"
        ? "image/jpeg, image/png, image/jpeg"
        : accept === "all"
          ? undefined
          : accept;
    const hasPreviewFiles = previewFiles && previewFiles.length > 0;
    const error = this.props.error || this.state.error;
    return (
      <Dropzone
        style={
          style || {
            textAlign: "center",
            borderStyle: "none",
            minHeight: 40
          }
        }
        accept={acceptance}
        onDrop={accepted => {
          if (accepted.length > 0) {
            return handleOnDrop(accepted);
          }
          this.setState({
            error: `Only ${acceptance && acceptance} are permitted`
          });
          setTimeout(() => this.setState({ error: "" }), 3000);
        }}
        ref={node => {
          this.dropzoneRef = node;
        }}
        className={"dropzone"}
        activeClassName={"dropzoneactive"}
        activeStyle={{ border: "#117ede solid 1px" }}
        disableClick={true}
        minSize={150}
      >
        <div
          className="uploadingFragment"
          style={{
            display: !showUploadingMessage ? "none" : "block"
          }}
        >
          <p
            style={{
              textAlign: "center"
            }}
          >
            <FontAwesomeIcon
              spin
              icon={faSpinner}
              style={{
                marginRight: 7
              }}
            />
            {uploadingMessage || "UPLOADING..."}
          </p>
        </div>
        <div
          style={{
            display: showUploadingMessage ? "none" : "block",
            marginTop: 12
          }}
        >
          <center>
            <img
              style={{
                marginBottom: 20,
                display: !mainLogo
                  ? !hasPreviewFiles
                    ? "none"
                    : "block"
                  : "block"
              }}
              src={hasPreviewFiles ? previewFiles[0].preview : mainLogo}
              width={100}
              alt="profile"
            />
          </center>
          <span style={{ fontSize: 10, cursor: "pointer" }}>
            Drop {dropText ? dropText : "logo"} here or{" "}
            <span
              onClick={() => {
                this.dropzoneRef.open();
              }}
              style={{ color: "blue" }}
            >
              upload from your computer
            </span>
          </span>
        </div>
        {error ? <p style={{ color: "red" }}>{error}</p> : null}
      </Dropzone>
    );
  }
}

Index.propTypes = {
  mainLogo: PropTypes.string,
  error: PropTypes.string,
  previewFiles: PropTypes.array.isRequired,
  handleOnDrop: PropTypes.func.isRequired,
  showUploadingMessage: PropTypes.bool.isRequired
};

Index.defaultProps = {
  previewFiles: [],
  showUploadingMessage: false,
  error: ""
};
