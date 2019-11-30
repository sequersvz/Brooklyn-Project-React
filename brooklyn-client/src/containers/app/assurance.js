import React, { Component } from "react";
import LayoutAssurance from "../../components/assurance/layout.assurance";
import { connect } from "react-redux";
import { API } from "aws-amplify";
import { parseSelectedFilters, signedRequest } from "../../Utils";
import { getQueryParams } from "../containers.Utils";
import { getLogo as getImage } from "../service";
import axios from "axios";
import AlertContext from "../providers/context/Alert";
let lastRequestTokenSourceVendors = undefined;
let lastRequestTokenSourceReviews = undefined;
let lastRequestTokenSourceReviewsStatistics = undefined;
let lastRequestTokenSourceCheckpointsStatistics = undefined;
class ContainerAssurance extends Component {
  state = {
    reviews: [],
    load: true,
    loadingReviews: false,
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    },
    firstLoad: true
  };
  onError = error => {
    // nothing is done with the error so far
    console.log(error);
  };
  _setState = properties =>
    this.setState(prevState => ({ ...prevState, properties }));
  _getQueryParams = getQueryParams(this.state, this._setState);

  _getAllReviewsOnSucess = async (result = []) => {
    lastRequestTokenSourceReviews = undefined;
    const reviewsPromises = result.map(async review => {
      if (review.vendorLogo) {
        let vendorLogo = await getImage(review.vendorLogo);
        review.vendorLogo = vendorLogo;
      }
      if ((review.manager || {}).picture) {
        let managerPicture = await getImage(review.manager.picture);
        review.manager.picture = managerPicture;
      }
      if (review.attendees.length > 0) {
        const attendeesPromises = review.attendees.map(async attendee => {
          const attendeePicture = await getImage(attendee.picture);
          return { ...attendee, picture: attendeePicture };
        });
        const attendees = await Promise.all(attendeesPromises);
        review.attendees = attendees;
      }
      return review;
    });
    const reviewsWithLogos = await Promise.all(reviewsPromises);
    this.setState({
      isLoaded: true,
      reviews: reviewsWithLogos,
      load: false,
      loadingReviews: false,
      firstLoad: false
    });
  };

  getAllReviews = async filters => {
    this.setState({ loadingReviews: true }, async () => {
      if (lastRequestTokenSourceReviews) {
        lastRequestTokenSourceReviews.cancel("request canceled");
      }
      let options = this._getQueryParams(filters);
      let onSuccess = this._getAllReviewsOnSucess;
      lastRequestTokenSourceReviews = axios.CancelToken.source();
      try {
        const response = await signedRequest(`/reviews/timeline`, {
          ...options,
          cancelToken: lastRequestTokenSourceReviews.token
        });
        onSuccess(response);
      } catch (error) {
        if ((error || {}).message !== "request canceled") {
          this.onError(error);
          this.setState({ loadingReviews: false });
        }
      }
    });
  };
  _getAllReviewsStatisticsOnSucess = result => {
    lastRequestTokenSourceReviewsStatistics = undefined;
    this.setState({
      isLoaded: true,
      reviewsStatistics: result,
      load: false
    });
  };
  getAllReviewsStatistics = async filters => {
    if (lastRequestTokenSourceReviewsStatistics) {
      lastRequestTokenSourceReviewsStatistics.cancel("request canceled");
    }
    let options = this._getQueryParams(filters);
    let onSuccess = this._getAllReviewsStatisticsOnSucess;
    lastRequestTokenSourceReviewsStatistics = axios.CancelToken.source();
    try {
      const response = await signedRequest(
        `/accounts/${
          this.props.user.attributes["custom:accountId"]
        }/reviews/statistics?abscisa=month`,
        {
          ...options,
          cancelToken: lastRequestTokenSourceReviewsStatistics.token
        }
      );
      onSuccess(response);
    } catch (error) {
      if ((error || {}).message !== "request canceled") {
        this.onError(error);
      }
    }
  };

  _getAllCheckpointsStatisticsOnSucess = result => {
    lastRequestTokenSourceCheckpointsStatistics = undefined;
    this.setState({
      isLoaded: true,
      checkpointsStatistics: result,
      load: false
    });
  };
  getAllCheckpointsStatistics = async filters => {
    if (lastRequestTokenSourceCheckpointsStatistics) {
      lastRequestTokenSourceCheckpointsStatistics.cancel("request canceled");
    }
    let options = this._getQueryParams(filters);

    let onSuccess = this._getAllCheckpointsStatisticsOnSucess;
    lastRequestTokenSourceCheckpointsStatistics = axios.CancelToken.source();
    try {
      const response = await signedRequest(
        `/accounts/${
          this.props.user.attributes["custom:accountId"]
        }/checkpoints/statistics?abscisa=month`,
        {
          ...options,
          cancelToken: lastRequestTokenSourceCheckpointsStatistics.token
        }
      );
      onSuccess(response);
    } catch (error) {
      if ((error || {}).message !== "request canceled") {
        this.onError(error);
      }
    }
  };

  addReview = async (review, submitting) => {
    const options = {
      method: "POST",
      body: {
        ...review,
        organizer: this.props.user.id || null,
        accountId: this.props.user.attributes["custom:accountId"]
      }
    };
    try {
      const { id } = await API.post(
        "UsersAPI",
        "/reviews/addcheckpoints",
        options
      );
      this.props.openAlert({
        message: "Review created",
        variant: "success",
        duration: 5000
      });
      this._reloadDataAssurance();
      this.setState({
        reviewCreated: true,
        reviewId: id
      });
      this.closeModal("showModalAddReview");
    } catch (error) {
      console.log(error);
      this.props.openAlert({
        message: "Could not create the review",
        variant: "error",
        duration: 3000
      });
    } finally {
      submitting(false);
    }
  };

  // get vendors ranking
  getVendors = async filters => {
    if (lastRequestTokenSourceVendors) {
      lastRequestTokenSourceVendors.cancel("request canceled");
    }
    let options = this._getQueryParams(filters);
    lastRequestTokenSourceVendors = axios.CancelToken.source();
    try {
      const vendorsRankings = await signedRequest(
        `/reviews/stats/speedometer`,
        {
          ...options,
          cancelToken: lastRequestTokenSourceVendors.token
        }
      );
      this.setState({ isLoaded: true, vendorsRankings });
      lastRequestTokenSourceVendors = undefined;
    } catch (error) {
      if ((error || {}).message !== "request canceled") {
        this.onError(error);
      }
    }
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  closeModalEvent = () => {
    this.setState(
      prevState => ({
        ...prevState,
        vendor: undefined,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }),
      () => {
        this.closeModal("showModalAddReview");
      }
    );
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

  closeModal = modalName => this.setState({ [modalName]: false });
  openModal = modalName => this.setState({ [modalName]: true });

  _reloadDataAssurance = filters => {
    if (!filters) {
      filters = parseSelectedFilters(this.props.queryFilters || {});
    }
    this.getAllReviews(filters);
    this.getVendors(filters);
    this.getAllCheckpointsStatistics(filters);
    this.getAllReviewsStatistics(filters);
  };

  componentWillUnmount() {
    if (lastRequestTokenSourceCheckpointsStatistics) {
      lastRequestTokenSourceCheckpointsStatistics.cancel("request canceled");
    }
    if (lastRequestTokenSourceReviews) {
      lastRequestTokenSourceReviews.cancel("request canceled");
    }
    if (lastRequestTokenSourceReviewsStatistics) {
      lastRequestTokenSourceReviewsStatistics.cancel("request canceled");
    }
    if (lastRequestTokenSourceVendors) {
      lastRequestTokenSourceVendors.cancel("request canceled");
    }
  }

  render() {
    const handlersAssurance = {
      getAllReviews: this.getAllReviews,
      reviews: this.state.reviews,
      load: this.state.load,
      addReview: this.addReview,
      getVendors: this.getVendors,
      handleInputChange: this.handleInputChange,
      openModal: this.openModal,
      showModalAddReview: this.state.showModalAddReview,
      vendors: this.state.vendors,
      vendorsRankings: this.state.vendorsRankings,
      closeModalEvent: this.closeModalEvent,
      changeLoad: value => this.setState({ load: value }),
      getAllCheckpointsStatistics: this.getAllCheckpointsStatistics,
      checkpointsStatistics: this.state.checkpointsStatistics,
      getAllReviewsStatistics: this.getAllReviewsStatistics,
      reviewsStatistics: this.state.reviewsStatistics,
      loadingReviews: this.state.loadingReviews,
      queryFilters: parseSelectedFilters(this.props.queryFilters),
      firstLoad: this.state.firstLoad,
      getAssuranceData: this._reloadDataAssurance
    };
    return (
      <div>
        <LayoutAssurance {...handlersAssurance} />
      </div>
    );
  }
}

const Assurance = props => (
  <AlertContext.Consumer>
    {({ open, message, variant, openAlert, closeAlert }) => (
      <ContainerAssurance
        {...props}
        {...{ alert: { open, message, variant }, closeAlert, openAlert }}
      />
    )}
  </AlertContext.Consumer>
);

export default connect(state => ({
  user: state.user,
  queryFilters: state.queryFilters
}))(Assurance);
