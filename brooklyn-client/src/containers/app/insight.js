import React, { Component } from "react";
import LayoutInsight from "../../components/insight/layout.insight";
import { withRouter } from "react-router-dom";
import { API } from "aws-amplify";
import { connect } from "react-redux";

class ContainerInsight extends Component {
  state = {
    showMockup: "insightDashboard",
    insights: [],
    load: true,
    showModal: {},
    showMockupLayout: ""
  };

  OnError = error => {
    this.setState({
      isLoaded: true,
      error
    });
  };

  _getInsightsOnSuccess = () => result => {
    this.setState({ insights: result });
  };

  getInsights = () => {
    let onSuccess = this._getInsightsOnSuccess();
    API.get("UsersAPI", `/insights/all`, {})
      .then(onSuccess)
      .catch(this.onError);
  };

  _editInsightOnSuccess = () => {
    this.closeModal("createInsight");
    this.getInsights();
  };

  editInsight = (insightId, properties) => {
    let objectEdit = {};
    Object.keys(properties).reduce((prek, key) => {
      if (typeof properties[key] !== "undefined") {
        return Object.assign(objectEdit, { [key]: properties[key] });
      } else {
        return null;
      }
    }, objectEdit);
    let options = {
      method: "PATCH",
      body: objectEdit
    };
    let onSuccess = this._editInsightOnSuccess;
    API.patch("UsersAPI", `/insights/${insightId}`, options)
      .then(onSuccess)
      .catch(this.onError);
  };

  addInsightsOnSuccess = () => {
    this.closeModal("createInsight");
    this.getInsights();
  };

  addInsights = () => {
    let options = {
      body: {
        title: this.state.title,
        date: this.state.date,
        impact: this.state.impact,
        vendorId: this.state.vendorId,
        insightstatusId: this.state.insightstatusId || 1,
        checkpointId: this.state.checkpointId,
        validatedAmount: this.state.validatedAmount,
        optimisedAmount: this.state.optimisedAmount,
        description: this.state.description,
        targetAmount: this.state.targetAmount,
        findingAmount: this.state.findingAmount,
        pctLikelihoodPessimistic: this.state.pctLikelihoodPessimistic,
        pctLikelihoodMiddle: this.state.pctLikelihoodMiddle,
        pctLikelihoodOptimistic: this.state.pctLikelihoodOptimistic
      }
    };
    let onSuccess = this.addInsightsOnSuccess;
    API.post("UsersAPI", `/insights`, options)
      .then(onSuccess)
      .catch(this.onError);
  };

  _getInsightStatusOnSuccess = () => result => {
    this.setState({
      isLoaded: true,
      insightStatus: result
    });
  };
  getInsightStatus = () => {
    let onSuccess = this._getInsightStatusOnSuccess();
    API.get("UsersAPI", `/insights/status`, {})
      .then(onSuccess)
      .catch(this.onError);
  };

  getVendorsOnSuccess = () => result => {
    this.setState({
      isLoaded: true,
      vendors: result
    });
  };
  getVendors = () => {
    let onSuccess = this.getVendorsOnSuccess();
    API.get("UsersAPI", `/vendors`, {})
      .then(onSuccess)
      .catch(this.onError);
  };

  _getCheckpointsOnSuccess = () => result => {
    this.setState({
      isLoaded: true,
      checkpoints: result
    });
  };
  getCheckpoints = () => {
    let onSuccess = this._getCheckpointsOnSuccess();
    API.get("UsersAPI", `/accounts/null/checkpoints`, {})
      .then(onSuccess)
      .catch(this.onError);
  };

  _getCategoriesOnSuccess = () => result => {
    this.setState({
      isLoaded: true,
      categories: result
    });
  };
  getCategories = () => {
    let onSuccess = this._getCategoriesOnSuccess();
    API.get("UsersAPI", `/category`, {})
      .then(onSuccess)
      .catch(this.onError);
  };

  _getReviewsOpenOnSuccess = () => result => {
    let reviewsOpen = result.sort(function(a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    let nextReview = reviewsOpen.filter(
      review => new Date(review.date) > new Date()
    );
    if (nextReview.length > 0) {
      nextReview = nextReview[nextReview.length - 1];
    } else {
      nextReview = null;
    }
    this.setState({
      nextReview
    });
  };

  getReviewsOpen = user => {
    let onSuccess = this._getReviewsOpenOnSuccess;
    //cuando tengamos el account por la session se enviara el account autenticado
    API.get(
      "UsersAPI",
      `/reviews/account/${user.attributes["custom:accountId"]}/open`,
      {}
    )
      .then(onSuccess)
      .catch(this.onError);
  };

  _addReviewitemOnSuccess = () => {
    this.closeModal("createReviewItem");
  };

  addReviewItem = (reviewId, checkpointId, properties) => {
    let options = {
      body: properties
    };
    let onSuccess = this._addReviewitemOnSuccess(this.props);
    API.post(
      "UsersAPI",
      `reviews/${reviewId}/checkpoint/${checkpointId}/itemreviews`,
      options
    )
      .then(onSuccess)
      .catch(this.onError);
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };
  openModal = name => {
    this.setState({ showModal: { [name]: true } });
  };
  closeModal = name => {
    delete this.state.title;
    delete this.state.date;
    delete this.state.impact;
    delete this.state.vendorId;
    delete this.state.insightstatusId;
    delete this.state.checkpointId;
    delete this.state.validatedAmount;
    delete this.state.optimisedAmount;
    delete this.state.description;
    delete this.state.targetAmount;
    delete this.state.findingAmount;
    delete this.state.pctLikelihoodPessimistic;
    delete this.state.pctLikelihoodMiddle;
    delete this.state.pctLikelihoodOptimistic;
    this.setState({ showModal: { [name]: false } });
  };

  componentWillMount() {
    this.getInsights();
    this.getVendors();
    this.getInsightStatus();
    this.getCheckpoints();
    this.getCategories();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getReviewsOpen(this.props.user);
    }
  }

  render() {
    const handlers = {
      changeMockup: value => this.setState({ showMockup: value }),
      changeMockupLayout: value => this.setState({ showMockupLayout: value }),
      showMockup: this.state.showMockup,
      showMockupLayout: this.state.showMockupLayout,
      insights: this.state.insights,

      openModal: this.openModal,
      closeModal: this.closeModal,
      showModalCreateInsight: this.state.showModal.createInsight,

      vendors: this.state.vendors,
      addInsights: this.addInsights,
      itemEcho: this.state.echo,
      itemTitle: this.state.title,
      itemImpact: this.state.impact,
      itemValidatedAmount: this.state.validatedAmount,
      itemActioned: this.state.actioned,
      itemOptimisedAmount: this.state.optimisedAmount,
      itemDescription: this.state.description,
      itemTargetAmount: this.state.targetAmount,
      itemFindingAmount: this.state.findingAmount,
      itemUnderInvestigation: this.state.underInvestigation,
      itemPctLikelihoodPessimistic: this.state.pctLikelihoodPessimistic,
      itemPctLikelihoodMiddle: this.state.pctLikelihoodMiddle,
      itemPctLikelihoodOptimistic: this.state.pctLikelihoodOptimistic,
      itemInsightstatusId: this.state.insightstatusId,
      itemCheckpointId: this.state.checkpointId,

      itemVendorId: this.state.vendorId,
      date: this.state.date,
      handleInputChange: this.handleInputChange,
      handleDateChange: date => this.setState({ date }),
      insightStatus: this.state.insightStatus,
      load: this.state.load,
      changeLoad: value => this.setState({ load: value }),

      checkpoints: this.state.checkpoints,
      categories: this.state.categories,

      nextReview: this.state.nextReview,
      editInsight: this.editInsight,

      showModalCreateReviewItem: this.state.showModal.createReviewItem,
      addReviewItem: this.addReviewItem,
      checkpointId: this.state.checkpointId
    };

    return (
      <div>
        <LayoutInsight {...handlers} />
      </div>
    );
  }
}
export default connect(
  state => ({
    user: state.user
  }),
  {}
)(withRouter(ContainerInsight));
