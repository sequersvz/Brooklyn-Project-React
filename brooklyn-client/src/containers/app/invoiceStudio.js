import React, { Component } from "react";
import LayoutInvoiceStudio from "../../components/invoice-studio/layout.invoiceStudio";
import { withRouter } from "react-router-dom";

class ContainerInvoiceStudio extends Component {
  state = {
    showMockup: "invoiceStudioDashboard",
    load: true
  };

  render() {
    const handlers = {
      showMockup: this.state.showMockup,
      changeMockup: value => this.setState({ showMockup: value }),
      load: this.state.load,
      changeLoad: value => this.setState({ load: value })
    };

    return (
      <div>
        <LayoutInvoiceStudio {...handlers} />
      </div>
    );
  }
}
export default withRouter(ContainerInvoiceStudio);
