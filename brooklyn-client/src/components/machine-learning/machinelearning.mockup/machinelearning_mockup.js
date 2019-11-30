import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../machineLearning.css";

class MachineLearningMockup extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.showMockup === "machineLearningDashboard"
      ? this.props.changeMockup("machineLearningDashboardGif")
      : this.props.changeMockup("machineLearningDashboard");
  }

  render() {
    return (
      <div className={this.props.showMockup} onClick={this.handleChange} />
    );
  }
}

export default withRouter(MachineLearningMockup);
