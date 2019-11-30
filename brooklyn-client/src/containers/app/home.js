import React, { Component } from "react";
import LayoutHome from "../../components/home/layout.home";
import { withRouter } from "react-router-dom";
import { API } from "aws-amplify";
import { connect } from "react-redux";
import { getContractStatuses } from "../../actions/contractStatus";
import { getQueryParams } from "../containers.Utils";
import { parseSelectedFilters, signedRequest } from "../../Utils";

import { CancelToken } from "axios";
let lastRequestTokenSourceVendors = undefined;
let lastRequestTokenSourceContracts = undefined;
let lastRequestTokenSourceHomaData = undefined;
let lastRequestTokenSourceUsersWithVendors = undefined;
class ContainerHome extends Component {
  state = {
    showMockup: "homeDashboardWithoutAnyCharts",
    load: true,
    vendor: {},
    slugEditInitiatives: false,
    rawContracts: [],
    firstTimeLoading: true,
    loadingContracts: false,
    loadingVendors: false,
    initiativeToEdit: {},
    rawVendors: null
  };

  onError = error => {
    // nothing is done with the error so far
    console.log(error);
  };

  _setState = properties =>
    this.setState(prevState => ({ ...prevState, properties }));
  _getQueryParams = getQueryParams(this.state, this._setState);

  addInitiatives = async (initiative, callback) => {
    const options = {
      body: { ...initiative }
    };

    try {
      await API.post("UsersAPI", `/contracts`, options);
      callback();
      const filters = this.getSearchKitQueryFilters();
      this.getContracts(filters);
      this.closeModalEvent();
    } catch (error) {
      this.onError(error);
    }
  };
  editInitiativesOnSucess = () => {
    const filters = this.getSearchKitQueryFilters();
    this.getContracts(filters);
    this.closeModal("showModalAddInitiatives");
  };
  editInitiatives = ({ initiative, id }) => {
    const options = {
      method: "PATCH",
      body: { ...initiative }
    };
    let onSuccess = this.editInitiativesOnSucess;
    API.patch("UsersAPI", `/contracts/${id}`, options)
      .then(onSuccess)
      .catch(this.onError);

    this.closeModalEvent();
  };

  _getHomeDataOnSuccess = () => result => {
    this.setState({
      isLoaded: true,
      homeData: this.state.homeData
        ? { ...this.state.homeData, ...result }
        : result
    });
  };
  getHomeData = filters => {
    if (lastRequestTokenSourceHomaData) {
      lastRequestTokenSourceHomaData.cancel(
        "Operation canceled due to new request."
      );
    }
    lastRequestTokenSourceHomaData = CancelToken.source();
    let options = this._getQueryParams(filters);
    options.cancelToken = lastRequestTokenSourceHomaData.token;
    let onSuccess = this._getHomeDataOnSuccess();
    signedRequest(
      `/accounts/${this.props.user.attributes["custom:accountId"]}/datahome`,
      {
        ...options,
        cancelToken: lastRequestTokenSourceHomaData.token
      }
    )
      .then(onSuccess)
      .catch(this.onError);
  };

  closeModalEvent = () => {
    this.closeModal("showModalAddInitiatives");
    this.setState({
      vendor: {},
      initiativeToEdit: {}
    });
  };
  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };
  getVendorsOnSuccess = () => result => {
    let vendors = result;
    if (this.props.selectedContractStatusFilters.length > 0) {
      //create an array of ids ([1,2,3]) with the selected status filters
      const statusIds = this.props.selectedContractStatusFilters.map(
        status => status.id
      );

      //now filter the contracts and select all whose statusId match the ones in the statusIds array
      //then map it to create an array of vendorIds
      const filteredContractsVendors = this.state.rawContracts
        .filter(contract => statusIds.indexOf(contract.statusId) !== -1)
        .map(contract => contract.vendorId);

      //filter the API query result to include all the vendors that have a contract
      //whose statusId appears in the filters
      vendors = result.filter(
        vendor => filteredContractsVendors.indexOf(vendor.id) !== -1
      );
    }

    this.setState(prevState => ({
      ...prevState,
      isLoaded: true,
      vendors: vendors,
      loadingVendors: false,
      firstTimeLoading:
        prevState.firstTimeLoading && prevState.loadingContracts,
      rawVendors: !prevState.rawVendors ? result : prevState.rawVendors
    }));
  };
  getVendors = (filters = {}) => {
    if (lastRequestTokenSourceVendors) {
      lastRequestTokenSourceVendors.cancel(
        "Operation canceled due to new request."
      );
    }
    lastRequestTokenSourceVendors = CancelToken.source();
    let options = this._getQueryParams(filters);
    options.cancelToken = lastRequestTokenSourceVendors.token;
    let onSuccess = this.getVendorsOnSuccess();

    this.setState({ loadingVendors: true }, () => {
      signedRequest(
        `/accounts/${this.props.user.attributes["custom:accountId"]}/vendors`,
        {
          ...options,
          cancelToken: lastRequestTokenSourceVendors.token
        }
      )
        .then(onSuccess)
        .catch(this.onError);
    });
  };

  _getUsersWithVendorsOnSuccess = () => result => {
    this.setState({
      isLoaded: true,
      usersWithVendors: result
    });
  };

  getUsersWithVendors = filters => {
    if (lastRequestTokenSourceUsersWithVendors) {
      lastRequestTokenSourceUsersWithVendors.cancel(
        "Operation canceled due to new request."
      );
    }
    lastRequestTokenSourceUsersWithVendors = CancelToken.source();

    let options = this._getQueryParams(filters);
    options.cancelToken = lastRequestTokenSourceUsersWithVendors.token;

    let onSuccess = this._getUsersWithVendorsOnSuccess();
    signedRequest(`/vendors/managers`, {
      ...options,
      cancelToken: lastRequestTokenSourceUsersWithVendors.token
    })
      .then(onSuccess)
      .catch(this.onError);
  };

  closeModal = modalName => this.setState({ [modalName]: false });
  openModal = modalName => this.setState({ [modalName]: true });

  handleModalEditInitiativeActivityPipeLine = contract => {
    this.setState(prevState => ({
      ...prevState,
      initiativeToEdit: {
        name: contract.name,
        amount: contract.amount,
        vendor: contract.vendor.id,
        status: (contract.contractstatus || {}).id,
        start: contract.start,
        end: contract.end,
        id: contract.id
      }
    }));
  };

  _getContractsOnSuccess = () => rawContracts => {
    const contractStatusIds = this.props.selectedContractStatusFilters.map(
      status => status.id
    );
    const contracts =
      this.props.selectedContractStatusFilters.length === 0
        ? rawContracts
        : rawContracts.filter(
            contract => contractStatusIds.indexOf(contract.statusId) !== -1
          );

    let activity = {
      activityPipeline: contracts
        .filter(
          contract =>
            new Date(contract.end) > new Date() && contract.amount !== null
        )
        .reduce(
          (count, contract) => (count += parseInt(contract.amount, 10)),
          0
        )
    };
    this.setState(prevState => ({
      isLoaded: true,
      homeData: prevState.homeData
        ? { ...prevState.homeData, ...activity }
        : activity,
      contracts,
      rawContracts,
      loadingContracts: false,
      firstTimeLoading: prevState.firstTimeLoading && prevState.loadingVendors
    }));
  };

  getContracts = (filters = {}) => {
    if (lastRequestTokenSourceContracts) {
      console.log("request canceled");
      lastRequestTokenSourceContracts.cancel(
        "Operation canceled due to new request."
      );
    }
    lastRequestTokenSourceContracts = CancelToken.source();
    let options = this._getQueryParams(filters);
    options.cancelToken = lastRequestTokenSourceContracts.token;
    let onSuccess = this._getContractsOnSuccess();

    this.setState({ loadingContracts: true }, () => {
      signedRequest(`/contracts/all`, {
        ...options,
        cancelToken: lastRequestTokenSourceContracts.token
      })
        .then(onSuccess)
        .catch(this.onError);
    });
  };

  deleteInitiative = async InitiativeId => {
    try {
      await API.del("UsersAPI", `/contracts/${InitiativeId}`, {});
      const filters = this.getSearchKitQueryFilters();
      this.getContracts(filters);
      this.closeModalEvent();
    } catch (error) {
      this.onError(error);
    }
  };

  handleStartDateChange = date =>
    this.setState(prevState => ({
      startDate: date,
      endDate: prevState.endDate < date ? null : prevState.endDate
    }));

  getSearchKitQueryFilters = () => {
    let filters = {};
    if (Object.keys(this.props.searchKitQueryFilters).length > 0) {
      filters = { ...this.props.searchKitQueryFilters };
    }
    return parseSelectedFilters(filters);
  };

  componentDidMount() {
    this.props.getContractStatuses();
    this.getContracts();
    this.getVendors();
  }

  componentDidUpdate(preProps) {
    if (
      preProps.selectedContractStatusFilters.length !==
      this.props.selectedContractStatusFilters.length
    ) {
      const filters = this.getSearchKitQueryFilters();
      this.getContracts(filters);
      this.getVendors(filters);
    }
  }
  render() {
    const handlers = {
      showMockup: this.state.showMockup,
      load: this.state.firstTimeLoading,
      initiativeToEdit: this.state.initiativeToEdit,
      InitiativesName: this.state.InitiativesName,
      InitiativeId: this.state.InitiativeId,
      deleteInitiative: this.deleteInitiative,
      InitiativesAmount: this.state.InitiativesAmount,
      InitiativeVendor: this.state.InitiativeVendor,
      InitiativeStatus: this.state.InitiativeStatus,
      editInitiatives: this.editInitiatives,
      slugEditInitiatives: this.state.slugEditInitiatives,
      handleEditInitiatives: value =>
        this.setState({ slugEditInitiatives: value }),
      changeLoad: value => this.setState({ load: value }),
      changeMockup: value => this.setState({ showMockup: value }),
      closeModal: this.closeModal,
      openModal: this.openModal,
      showModalAddInitiatives: this.state.showModalAddInitiatives,
      addInitiatives: this.addInitiatives,
      handleInputChange: this.handleInputChange,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      handleStartDateChange: this.handleStartDateChange,
      handleEndDateChange: date => this.setState({ endDate: date }),
      getVendors: this.getVendors,
      vendors: this.state.vendors,
      rawVendors: this.state.rawVendors,
      isErrorName: this.state.isErrorName,
      isErrorAmount: this.state.isErrorAmount,
      isErrorVendor: this.state.isErrorVendor,
      isErrorStatus: this.state.isErrorStatus,
      closeModalEvent: this.closeModalEvent,
      contracts: this.state.contracts,
      getContracts: this.getContracts,
      homeData: this.state.homeData,
      getHomeData: this.getHomeData,
      users: this.state.users,
      getUsersWithVendors: this.getUsersWithVendors,
      usersWithVendors: this.state.usersWithVendors,
      handleModalEditInitiativeActivityPipeLine: this
        .handleModalEditInitiativeActivityPipeLine
    };

    return (
      <div>
        <LayoutHome {...handlers} />
      </div>
    );
  }
}
// con esta function se inserta las variables a los prod del componente instanciado
const mapStateToProps = state => {
  return {
    user: state.user,
    account: state.account,
    selectedContractStatusFilters: state.contractStatus.selectedStatuses,
    searchKitQueryFilters: state.queryFilters
  };
};
//con esta function se sirven las functions para ejecutar en el container, al ejecutar estas functions la function anterior
//inserta los resultados en las props
const mapDispatchToProps = dispatch => {
  return {
    getContractStatuses: () => {
      dispatch(getContractStatuses());
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContainerHome));
