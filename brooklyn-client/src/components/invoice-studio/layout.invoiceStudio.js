import React, { PureComponent } from "react";
import InvoiceStudioMockup from "./invoicestudio.mockup/invoicestudio_mockup";
import Loading from "../loading-spinner";

class LayoutInvoiceStudio extends PureComponent {
  componentWillMount() {
    this.props.changeLoad(true);
    setTimeout(() => this.props.changeLoad(false), 1500);
  }
  render() {
    const { showMockup, changeMockup } = this.props;
    const { load } = this.props;
    const handlerInvoiceStudioMockup = {
      showMockup,
      changeMockup
    };

    return (
      <div>
        <Loading load={load} />
        <InvoiceStudioMockup {...handlerInvoiceStudioMockup} />
      </div>
    );
  }
}

export default LayoutInvoiceStudio;
