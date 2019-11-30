import React, { Component } from "react";
import LayoutMachineLearning from "../../components/machine-learning/layout.machineLearning";
import { withRouter } from "react-router-dom";

class ContainerMachineLearningStudio extends Component {
  state = {
    showMockup: "machineLearningDashboard",
    load: true
  };

  render() {
    const handlers = {
      showMockup: this.state.showMockup,
      load: this.state.load,
      changeLoad: value => this.setState({ load: value }),
      changeMockup: value => this.setState({ showMockup: value })
    };

    return (
      <div>
        <LayoutMachineLearning {...handlers} />
      </div>
    );
  }
}
export default withRouter(ContainerMachineLearningStudio);
