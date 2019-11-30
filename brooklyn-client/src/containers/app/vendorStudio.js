import React, { Component } from "react";
import LayoutVendorStudio from "../../components/vendorStudio/layout.vendorStudio";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { API } from "aws-amplify";
import { Storage } from "aws-amplify/lib/index";
import { getVendorsByAccount } from "../../actions/vendors";
import { isArray } from "util";
import { baseUrlUploads } from "../../config/config";
import { getQueryParams } from "../containers.Utils";
import { parseSelectedFilters } from "../../Utils";
import { Route, Switch } from "react-router-dom";

let error;
class ContainerVendorStudio extends Component {
  constructor(props) {
    super(props);
    this.handleErrorModalAddVendor = this.handleErrorModalAddVendor.bind(this);
  }
  state = {
    vendor: undefined,
    load: true,
    disableSaveButton: false,
    showUploadingMessage: false,
    loadingVendors: true,
    vendorsCount: 0,
    vendorQueryString: "",
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    }
  };

  onError = error => {
    console.log(error);
  };

  handleErrorModalAddVendor(isErrorValue) {
    error = true;
    this.setState({
      [isErrorValue]: true
    });
  }

  getVendors = async (accountIdParameter, query = {}, filters) => {
    let accountId =
      this.props.user === null
        ? accountIdParameter
        : this.props.user.attributes["custom:accountId"];
    let vendorQueryString = query.name || this.state.vendorQueryString;
    if (!filters) {
      filters = parseSelectedFilters(this.props.searchKitQueryFilters);
    }
    if (query.reset) {
      vendorQueryString = "";
    }

    this.setState({ loadingVendors: true, vendorQueryString }, () => {
      try {
        this.props.getVendorsByAccount({
          accountId,
          onSuccess: () =>
            this.setState({
              loadingVendors: false,
              load: false
            }),
          query,
          filters
        });
      } catch (error) {
        console.log(error);
        this.setState({ loadingVendors: false });
      }
    });
    if (!query.changePage) {
      try {
        const { count } = await API.get(
          "UsersAPI",
          `/accounts/${accountId}/vendors/count${
            query.name ? "?name=" + query.name : ""
          }`,
          getQueryParams()(filters)
        );
        this.setState({ vendorsCount: count });
      } catch (error) {
        console.log(error);
      }
    }
  };

  handlerClick = () => {
    this.setState({
      vendorView: !this.state.vendorView
    });
  };

  openModalAdd = () => {
    this.setState({
      showAdd: true
    });
  };

  openModal = modalName => this.setState({ [modalName]: true });
  closeModal = modalName => {
    this.setState(prevState => ({
      [modalName]: false,
      logo: undefined,
      name: undefined,
      invoiceYtd: undefined,
      costOptimizations: undefined,
      numberOfCostOptimizations: undefined,
      csat: undefined,
      manager: undefined,
      critical: undefined,
      strategic: undefined,
      vendorFiles: undefined,
      ...(prevState.vendor && { vendor: undefined })
    }));
  };

  _setProfileOnSuccess = () => {
    this.setState({ disableSaveButton: false });
    this.getVendors();
  };

  setProfileInfo(properties, vendorId) {
    this.setState({ disableSaveButton: true });
    properties = {
      csat: properties["csat"],
      costOptimizations: properties["costOptimizations"],
      numberOfCostOptimizations: properties["numberOfCostOptimizations"],
      invoiceYtd: properties["invoiceYtd"],
      manager: properties["manager"],
      critical: properties["critical"] === true ? 1 : 0,
      strategic: properties["strategic"] === true ? 1 : 0
    };
    let options = {
      body: properties
    };
    let onSuccess = this._setProfileOnSuccess;

    API.patch("UsersAPI", `/vendors/${vendorId}/profile`, options)
      .then(onSuccess)
      .catch(this.onError);
  }

  addVendor = async properties => {
    try {
      error = false;
      if (!this.state.name) {
        this.handleErrorModalAddVendor("isErrorName");
      }
      if (error !== true) {
        this.setState({ disableSaveButton: true });
        if (isArray(properties.logo) && properties.logo.length > 0) {
          let fileName = await this.putAttachments(properties.logo);

          properties.logo = baseUrlUploads + fileName;
        }

        let options = {
          body: properties
        };
        let accountId =
          this.props.user === null
            ? this.props.user.attributes["custom:accountId"]
            : 1;
        const vendor = await API.post(
          "UsersAPI",
          `/accounts/${accountId}/vendors`,
          options
        );
        this.setProfileInfo(properties, vendor.id);
        this.openAlert({
          duration: 3000,
          variant: "success",
          message: "Vendor created"
        });
      }
    } catch (error) {
      let errMsg = "Could not create the vendor";
      if (error.toString().includes("409")) {
        errMsg = `A vendor with the name ${properties.name} already exists`;
      }
      this.openAlert({ message: errMsg, duration: 3000, variant: "error" });
    } finally {
      this.setState({ disableSaveButton: false });
      this.closeModal("showModalAddVendor");
    }
  };

  closeModalAddVendorEvent = () => {
    this.setState({ isErrorName: undefined, name: undefined });
  };

  deleteVendorOnsuccess = () => {
    this.getVendors();
    this.setState(
      prevState => ({ ...prevState, vendor: undefined }),
      () => {
        this.closeModal("showModalRemoveVendor");
        this.openAlert({
          variant: "success",
          duration: 3000,
          message: "Vendor deleted"
        });
      }
    );
  };

  removeVendor = () => {
    let onSuccess = this.deleteVendorOnsuccess;
    let vendorId = this.state.vendorId;
    API.del("UsersAPI", `/vendors/${vendorId}`, {})
      .then(onSuccess)
      .catch(() => {
        this.closeModal("showModalRemoveVendor");
        this.openAlert({
          variant: "error",
          message: "Could not delete the vendor",
          duration: 3000
        });
      });
  };

  handleInputChange = event => {
    if (isArray(event) === true) {
      this.setState({
        vendorFiles: event,
        showUploadingMessage: false
      });
    } else {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }
  };
  handleDeleteVendor = vendorId => {
    this.setState({
      vendorId: vendorId
    });
  };
  putAttachments = async files => {
    const file = files[0];
    const timestamp = Date.now().toString();
    const name = `${timestamp}.${file.name}`;
    const fileName = `uploads/logos/${name}`;
    await Storage.put(fileName, file, { contentType: file.type });
    return fileName;
  };

  openAlert = ({ message, variant, duration }) =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        open: true,
        variant,
        duration,
        message
      }
    }));

  closeAlert = () =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        ...prevState.alert,
        open: false
      }
    }));

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        accountId: this.props.user.attributes["custom:accountId"]
      });
    }
  }

  componentWillUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      const accountIdParameter = prevProps.user.attributes["custom:accountId"];
      this.getVendors(accountIdParameter);
    }
  }

  render() {
    const handlers = {
      showMockup: this.state.showMockup,
      handlerClick: this.handlerClick,
      getVendors: this.getVendors,
      vendors: this.props.vendorsByAccount ? this.props.vendorsByAccount : [], //this.state.vendors,
      openModal: this.openModal,
      closeModal: this.closeModal,
      showModalAddVendor: this.state.showModalAddVendor,
      showModalRemoveVendor: this.state.showModalRemoveVendor,
      addVendor: this.addVendor,
      handleInputChange: this.handleInputChange,
      removeVendor: this.removeVendor,

      vendor: this.state.vendor,
      name: this.state.name,
      logo: this.state.logo,
      load: this.state.load,
      handleDeleteVendor: this.handleDeleteVendor,
      isErrorName: this.state.isErrorName,
      closeModalAddVendorEvent: this.closeModalAddVendorEvent,
      disableSaveButton: this.state.disableSaveButton,
      putAttachments: this.putAttachments,
      showUploadingMessage: this.state.showUploadingMessage,
      handleShowUploadingMessage: value =>
        this.setState({ showUploadingMessage: value }),
      vendorFiles: this.state.vendorFiles,
      loadingVendors: this.state.loadingVendors,
      vendorsCount: this.state.vendorsCount,
      vendorQueryString: this.state.vendorQueryString,
      alert: this.state.alert,
      closeAlert: this.closeAlert
    };
    return (
      <div>
        <Switch>
          <Route
            path="/vendor"
            exact
            strict
            render={props => <LayoutVendorStudio {...props} {...handlers} />}
          />
          {this.props.routes.map(
            ({ path, component }) =>
              component && (
                <Route key={path} path={path} component={component} />
              )
          )}
        </Switch>
      </div>
    );
  }
}
// con esta function se inserta las variables a los prod del componente instanciado
const mapStateToProps = state => {
  return {
    user: state.user,
    vendorsNextReview: state.vendors.vendorsNextreview,
    vendorsByAccount: state.vendors.vendorsByAccount,
    store: state,
    searchKitQueryFilters: state.queryFilters
  };
};
//con esta function se sirven las functions para ejecutar en el container, al ejecutar estas functions la function anterior
//inserta los resultados en las props
const mapDispatchToProps = dispatch => {
  return {
    getVendorsByAccount: ({ accountId, onSuccess, query, filters }) => {
      dispatch(
        getVendorsByAccount({
          accountId,
          onSuccess,
          query,
          filters
        })
      );
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContainerVendorStudio));
