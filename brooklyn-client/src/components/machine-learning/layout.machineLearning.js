import React, { PureComponent } from "react";
import MachineLearningMockup from "./machinelearning.mockup/machinelearning_mockup";
import Loading from "../loading-spinner";

class LayoutMachineLearning extends PureComponent {
  componentDidMount() {
    setTimeout(() => this.props.changeLoad(false), 1500);
  }
  render() {
    const { showMockup, changeMockup } = this.props;
    const { load } = this.props;
    const handlerMachineLearningMockup = {
      showMockup,
      changeMockup
    };

    return (
      <div>
        <Loading load={load} />
        <MachineLearningMockup {...handlerMachineLearningMockup} />
      </div>
    );
  }
}

export default LayoutMachineLearning;
