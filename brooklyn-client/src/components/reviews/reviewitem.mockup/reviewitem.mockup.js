import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class RiviewsItemMockup extends Component {
  render() {
    return (
      <div className={this.props.showMockup}>
        <div
          style={{
            borderBottom: "none",
            width: "100%",
            height: 200
          }}
          onClick={this.props.changeMockup.bind(this, "itemreviewMockupNew")}
        />
        <div
          style={{
            borderBottom: "none",
            width: "100%",
            height: 200
          }}
          onClick={this.props.changeMockup.bind(this, "itemreviewMockupExport")}
        />
        <div
          style={{
            width: "100%",
            height: 200
          }}
          onClick={this.props.changeMockup.bind(this, "itemreviewMockup")}
        />
      </div>
    );
  }
}

export default withRouter(RiviewsItemMockup);
