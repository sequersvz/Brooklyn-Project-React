import React, { Component } from "react";
import LayoutJourney from "../../components/journey/layout.journey";
import { withRouter } from "react-router-dom";

class ContainerJourney extends Component {
  handlerNotify = (message, type) => {
    let objetNotify = { message: message, type, show: true };
    this.setState({ notify: objetNotify });
    setTimeout(() => this.setState({ notify: { show: false } }), 5000);
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  render() {
    const handlers = {};

    return (
      <div>
        <LayoutJourney {...handlers} />
      </div>
    );
  }
}

export default withRouter(ContainerJourney);
