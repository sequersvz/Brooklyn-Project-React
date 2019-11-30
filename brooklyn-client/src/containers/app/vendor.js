import React, { Component } from "react";
import LayoutVendor from "../../components/vendor/layout.vendor";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { API } from "aws-amplify";
import { Axios } from "axios";
import { getLogo } from "../service";
import { getAccount } from "../../actions/account";
import { editEntity } from "../../containers/service/root.service";
import { makeCancelable } from "../../Utils";
let lastRequestTokenSource = undefined;
const editAccount = editEntity("accounts");

class ContainerVendor extends Component {
  state = {
    vendor: null,
    isLoading: false
  };
  OnError = error => {
    if (Axios.isCancel(error)) {
      // console.log("Request canceled", error);
    } else {
      console.log(error);
    }
    this.setState({
      isLoaded: true,
      error
    });
  };

  editAccountOnSuccess = () => {
    const { account, getAccountById } = this.props;
    getAccountById(account.id);
  };

  editAccount = editAccount(this.editAccountOnSuccess);

  getVendorsOnSuccess = () => async vendor => {
    if (vendor.logo) {
      try {
        const logo = await getLogo(vendor.logo);
        vendor.logo = logo;
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ isLoading: false, vendor });
  };

  getVendorById = id => {
    let onSuccess = this.getVendorsOnSuccess();
    this.setState({ isLoading: true });
    API.get(
      "UsersAPI",
      `/accounts/${this.props.user.attributes["custom:accountId"] ||
        1}/vendors/${id}`,
      {}
    )
      .then(onSuccess)
      .catch(error => {
        if (error.response.status === 404) {
          this.props.history.push("/vendor");
        } else {
          this.OnError(error);
        }
      });
  };

  editVendorProfile = (vendorId, properties) => {
    let [vendorProfile] = this.state.vendor.profile;
    vendorProfile = { ...vendorProfile, ...properties };
    // optimistic update
    this.setState(
      prevState => ({
        ...prevState,
        vendor: {
          ...prevState.vendor,
          profile: [vendorProfile]
        }
      }),
      async () => {
        if (lastRequestTokenSource) {
          lastRequestTokenSource.cancel();
        }
        let options = {
          body: properties
        };
        try {
          const request = API.patch(
            "UsersAPI",
            `/vendors/${vendorId}/profile`,
            options
          );
          const cancelableRequest = makeCancelable(request);
          lastRequestTokenSource = cancelableRequest;
          await cancelableRequest.promise;
          lastRequestTokenSource = undefined;
        } catch (error) {
          lastRequestTokenSource = undefined;
        }
      }
    );
  };

  componentDidUpdate(preProps) {
    if (preProps.user !== this.props.user) {
      let vendorId = this.props.match.params.id;
      this.getVendorById(vendorId);
    }
  }

  componentDidMount() {
    const vendorId = this.props.match.params.id;
    if (this.props.user !== null) {
      this.setState({ loading: true }, () => {
        this.getVendorById(vendorId);
      });
    }
  }

  render() {
    const handlerLayout = {
      vendor: this.state.vendor,
      account: this.props.account,
      editAccount: this.editAccount,
      isLoading: this.state.isLoading,
      getVendorById: this.getVendorById,
      getAccountById: this.props.getAccountById,
      editVendorProfile: this.editVendorProfile
    };
    return (
      <div>
        <LayoutVendor {...handlerLayout} />
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAccountById: accountId => {
      dispatch(getAccount(accountId));
    }
  };
};
export default withRouter(
  connect(
    state => ({
      user: state.user,
      account: state.account
    }),
    mapDispatchToProps
  )(ContainerVendor)
);
