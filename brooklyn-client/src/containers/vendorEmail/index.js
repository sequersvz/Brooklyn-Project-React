import React from "react";

import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

export default class vendorEmailContainer extends React.Component {
  state = {
    miEmail: null, // incoming email for MI reports
    eeEmail: null, // incoming email address for everything else
    alertPref: null,
    loading: true
  };

  async componentDidMount() {
    const { vendorId } = this.props;
    const vendorConfig = await API.graphql(
      graphqlOperation(queries.GetInboundEmails, {
        vendorId: vendorId
      })
    );
    const ie = vendorConfig.data.getInboundEmails;
    this.setState({
      ...(ie && { ...ie }),
      loading: false
    });
  }

  generateEmail() {
    const { vendorId } = this.props;
    var postfix = Math.floor(Math.random() * 9999);
    var inbox = `${vendorId}-${postfix}`.replace(/[^a-zA-Z\d-]/gi, "");
    return `${inbox}@${window.location.hostname}`.toLocaleLowerCase();
  }

  generateMiEmail = async () => {
    const { vendorId } = this.props;
    const miEmail = this.generateEmail();
    const alertPref = "immediately";
    try {
      await API.graphql(
        graphqlOperation(mutations.UpdateInboundEmail, {
          input: {
            vendorId: vendorId,
            miEmail,
            alertPref
          }
        })
      );
    } catch (e) {
      await API.graphql(
        graphqlOperation(mutations.CreateInboundEmail, {
          input: {
            vendorId: vendorId.toString(),
            miEmail,
            alertPref
          }
        })
      );
    }
    this.setState({ miEmail });
  };

  updateConfig = async ({ alertPref = "immediately" }) => {
    const { vendorId } = this.props;
    try {
      await API.graphql(
        graphqlOperation(mutations.UpdateInboundEmail, {
          input: {
            vendorId: vendorId,
            alertPref
          }
        })
      );
    } catch (e) {
      await API.graphql(
        graphqlOperation(mutations.CreateInboundEmail, {
          input: {
            vendorId: vendorId.toString(),
            alertPref
          }
        })
      );
    }
  };

  generateEeEmail = async () => {
    const { vendorId } = this.props;
    const eeEmail = this.generateEmail();
    const alertPref = "immediately";
    try {
      await API.graphql(
        graphqlOperation(mutations.UpdateInboundEmail, {
          input: {
            vendorId: vendorId,
            eeEmail,
            alertPref
          }
        })
      );
    } catch (e) {
      await API.graphql(
        graphqlOperation(mutations.CreateInboundEmail, {
          input: {
            vendorId: vendorId.toString(),
            eeEmail,
            alertPref
          }
        })
      );
    }
    this.setState({ eeEmail });
  };

  render() {
    const { miEmail, eeEmail, alertPref, loading } = this.state;
    const { children } = this.props;
    return children({
      miEmail,
      eeEmail,
      alertPref,
      updateConfig: this.updateConfig,
      generateMiEmail: this.generateMiEmail,
      generateEeEmail: this.generateEeEmail,
      loading
    });
  }
}
