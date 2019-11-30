import React, { Component } from "react";
class CustomAlert extends Component {
  render() {
    return (
      <div>
        <div
          className={
            this.props.clases + " " + this.props.type + " " + this.props.show
          }
          role="alert"
          style={{
            position: "fixed",
            textAlign: "center",
            width: "100%",
            zIndex: 1002
          }}
        >
          {this.props.message}
        </div>
      </div>
    );
  }
}
export default CustomAlert;
