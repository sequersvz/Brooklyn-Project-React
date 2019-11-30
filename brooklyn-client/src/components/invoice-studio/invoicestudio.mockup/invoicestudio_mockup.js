import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../invoiceStudio.css";

class InvoiceStudioMockup extends Component {
  render() {
    return (
      <div className={this.props.showMockup}>
        <span
          style={{
            width: "100%",
            height: "100%",
            float: "right",
            position: "relative",
            top: 0,
            left: -59
          }}
          onClick={this.props.changeMockup.bind(this, "invoiceStudioDetail")}
        />
      </div>
    );
  }
}

export default withRouter(InvoiceStudioMockup);
