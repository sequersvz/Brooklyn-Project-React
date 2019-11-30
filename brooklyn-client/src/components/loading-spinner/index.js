import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";

class Loading extends Component {
  render() {
    let { load } = this.props;
    return (
      <span
        style={{
          position: "relative",
          top: 250
        }}
      >
        <LoadingOverlay
          active={load}
          spinner
          text="Loading"
          background={"#E5E5E5"}
          color={"#683364"}
          spinnerSize={"200px"}
        />
      </span>
    );
  }
}

const LoadingSpinner = ({ height, size, text, children }) => (
  <div style={{ height: `${height || 300}px` }}>
    <LoadingOverlay
      style={{ top: `${(height - size) / 2 || 100}px` }}
      active
      spinner
      text={text || "Loading..."}
      background="#E5E5E5"
      color="#683364"
      spinnerSize={`${size || 100}px`}
    >
      {children}
    </LoadingOverlay>
  </div>
);

export default Loading;
export { LoadingSpinner };
