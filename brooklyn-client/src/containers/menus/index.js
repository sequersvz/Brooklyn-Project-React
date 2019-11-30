import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { API } from "aws-amplify";

import {
  getReviewCategories,
  getAllCategories
} from "../service/category.service";
import {
  getCheckpointsByCategoryIdAndReview,
  reviewDelectCheckpoint,
  reviewActionCheckpoint,
  getCheckpointsByCategoryId
} from "../service/checkpoints.service";
import { getReviewById, getScores } from "../service/review";
import { getQueryParams } from "../containers.Utils";

const requests = {};

function MainMenuContainerFunction(WrappedComponent) {
  class MainMenuContainer extends Component {
    state = {
      category: 0,
      categoryName: "",
      reviewId: this.props.reviewId,
      checkState: {
        error: null,
        isLoaded: false,
        items: []
      },
      categoryState: {
        error: null,
        isLoaded: false,
        items: []
      },
      checkpoints: [],
      showSwitch: false,
      isOldReview: undefined,
      isLoaded: {},
      lastRequestTokenSourceCheckpointsPinned: undefined,
      scores: {}
    };
    onError = error => {
      // nothing is done with the error so far
      this.setState(prevState => ({
        ...prevState,
        categoryState: {
          ...prevState.categoryState,
          isLoaded: true,
          error
        }
      }));
    };

    getQueryParams = getQueryParams();

    componentDidMount() {
      let options = {};
      if (this.props.filters) {
        options = this.getQueryParams(this.props.filters);
      }
      this.getReviewById(this.props.reviewId, options);
      if (this.props.menuGray) {
        this.getAllCategories();
      } else {
        this.getAllCategories(this.props.reviewId);
      }
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps.filters !== this.props.filters ||
        prevProps.reviewId !== this.props.reviewId
      ) {
        let options = {};
        if (this.props.filters) {
          options = this.getQueryParams(this.props.filters);
        }
        this.getReviewById(this.props.reviewId, options);

        if (this.props.menuGray) {
          this.getAllCategories();
        } else {
          this.getAllCategories(this.props.reviewId);
        }
      }
    }

    getCheckpointsByCategoryIdOnSuccess = result => {
      if (result.length > 0) {
        this.setState(prevState => ({
          ...prevState,
          checkState: {
            ...prevState.checkState,
            isLoaded: true,
            items: result
          },
          checkpoints: (result || []).map(({ id, pinned }) => ({ id, pinned })),
          isLoaded: { ...prevState.isLoaded, getCheckpoints: true }
        }));
        const params = new URLSearchParams(this.props.location.search);
        const checkpointId = params.get("checkpointId");
        let checkpointIndex = result.findIndex(
          check => parseInt(check.id, 10) === parseInt(checkpointId, 10)
        );
        if (checkpointId === null || checkpointIndex === -1) {
          params.append("checkpointId", result[0].id);
          this.props.history.push({
            search: params.toString()
          });
          this.props.handleClickCheckpoints(result[0].id, result[0].name);
          return;
        }

        this.props.handleClickCheckpoints(
          result[checkpointIndex].id,
          result[checkpointIndex].name
        );
      } else {
        this.setState({
          checkState: {
            isLoaded: { getCheckpoints: true },
            items: []
          }
        });
      }
    };

    getCheckpointsById = (reviewId, categoryId) =>
      this.setState(
        prevState => ({
          ...prevState,
          isLoaded: { ...prevState.isLoaded, getCheckpoints: false }
        }),
        () => {
          if (!reviewId) {
            getCheckpointsByCategoryId(
              this.getCheckpointsByCategoryIdOnSuccess,
              this.onError
            )(categoryId);
          } else {
            getCheckpointsByCategoryIdAndReview(
              this.getCheckpointsByCategoryIdOnSuccess,
              this.onError
            )(reviewId, categoryId);
          }
        }
      );

    handlerSendCategory = () => {};

    getReviewCategoriesOnSuccess = result => {
      this.props.getCategoryActionId(
        result.filter(cat => cat.name === "Action Log")[0].id
      );
      this.setState(prevState => ({
        ...prevState,
        categoryState: {
          ...prevState.categoryState,
          isLoaded: true,
          categories: result
        },
        isLoaded: { ...prevState.isLoaded, getAllCategories: true }
      }));
      const params = new URLSearchParams(this.props.location.search);
      let categoryId = params.get("categoryId");
      if (!categoryId) {
        const actionLog = (result || []).find(
          category => category.name === "Action Log"
        );
        categoryId = (actionLog || {}).id;
      }
      if (categoryId !== null && parseInt(categoryId, 10) !== 0) {
        let categoryIndex =
          result.findIndex(
            cat => parseInt(cat.id, 10) === parseInt(categoryId, 10)
          ) || 0;
        categoryIndex = categoryIndex > -1 ? categoryIndex : 0;
        this.getCheckpointsById(this.props.reviewId, result[categoryIndex].id);
        this.props.handleClickCategory(
          result[categoryIndex].id,
          result[categoryIndex].name
        );
      } else if (parseInt(categoryId, 10) !== 0) {
        this.props.history.push({
          search: `?categoryId=${result[0].id}`
        });
        this.props.handleClickCategory(result[0].id, result[0].name);
      } else {
        this.props.handleMeetingOrganiser(true);
      }
    };

    getAllCategories = reviewId =>
      this.setState(
        prevState => ({
          ...prevState,
          isLoaded: { ...prevState.isLoaded, getAllCategories: false }
        }),
        () => {
          if (this.props.menuGray) {
            getAllCategories(this.getReviewCategoriesOnSuccess, this.onError)();
          } else {
            getReviewCategories(
              this.getReviewCategoriesOnSuccess,
              this.onError
            )(reviewId);
          }
        }
      );

    actionCheckpointMenuOnSuccess = () => {
      this.props.handleReloadcheck();
    };

    reviewActionCheckpoint = reviewActionCheckpoint(
      this.actionCheckpointMenuOnSuccess,
      this.onError
    )(this.props.reviewId);

    actionCheckpointMenu = (checkpointId, pinned) => {
      let checkpoints = [...this.state.checkpoints];
      checkpoints.find(
        checkpoint =>
          checkpoint.id === checkpointId
            ? (checkpoint.pinned = checkpoint.pinned === true ? false : true)
            : null
      );
      this.setState({ checkpoints }, () => {
        this.reviewActionCheckpoint(checkpointId, {
          body: { pinned }
        });
      });
    };

    reviewDeleteCheckpointOnSuccess = () => {
      this.props.handleReloadcheck();
    };
    reviewDeleteCheckpoint = reviewDelectCheckpoint(
      this.reviewDeleteCheckpointOnSuccess,
      this.onError
    );
    deleteCheckpoint = this.reviewDeleteCheckpoint(this.props.reviewId);

    handlePinCheckpoints = (id, pinned) => {
      const checkpointExists = this.state.checkpoints.find(
        checkpoint => checkpoint.id === id
      );
      if (!checkpointExists) {
        this.setState(prevState => ({
          ...prevState,
          checkpoints: prevState.checkpoints.concat({ id, pinned })
        }));
      }
    };

    getReviewByIdOnSuccess = (result, options) => {
      if (result) {
        let review = result;
        if (Array.isArray(result)) {
          review = result[0];
        }
        let reviewDate = new Date(result.date);
        if (this.props.menuGray) {
          this.getReviewsScores(result, options);
        }

        this.setState((prevState, props) => ({
          ...prevState,
          review,
          isLoaded: { ...prevState.isLoaded, getReviewById: true },
          isOldReview: props.currentDateMinus7.getTime() >= reviewDate.getTime()
        }));
      }
    };

    getReviewById = (reviewId, options) => {
      const query = {
        ...options,
        ...(this.props.location.pathname.includes("report") && {
          queryStringParameters: {
            ...options.queryStringParameters,
            report: true
          }
        })
      };
      this.setState(
        prevState => ({
          ...prevState,
          isLoaded: { ...prevState.isLoaded, getReviewById: false }
        }),
        getReviewById(
          result => this.getReviewByIdOnSuccess(result, query),
          this.onError
        )(reviewId, query)
      );
    };

    getReviewsScores = (review, options) =>
      this.setState(
        prevState => ({
          ...prevState,
          isLoaded: { ...prevState.isLoaded, getReviewsScores: false }
        }),
        async () => {
          try {
            let scores = {};
            if (Array.isArray(review)) {
              scores = await getScores(options);
            } else {
              scores = await API.get(
                "UsersAPI",
                `/reviews/scores?lastDate=${review.date}&vendorId=${
                  review.vendorId
                }&limit=10`,
                {}
              );
            }
            this.setState(prevState => ({
              ...prevState,
              reviewsScores: {},
              scores,
              isLoaded: { ...prevState.isLoaded, getReviewsScores: true }
            }));
          } catch (error) {
            this.onError(error);
          }
        }
      );

    allRequestIsLoaded = () => {
      if (this.state.isLoaded.getReviewsScores) return true;
      return (
        Object.values(this.state.isLoaded).filter(value => !value).length === 0
      );
    };

    handleLeaveMeetingOrganiser = categoryId => {
      this.getReviewById(this.state.reviewId);
      this.getCheckpointsById(this.state.reviewId, categoryId);
    };

    render() {
      const handlers = {
        categoryId: this.props.categoryId,
        checkpointId: this.props.checkpoint,
        checkState: this.state.checkState,
        categoryName: this.props.categoryName,
        reloadCheck: this.props.reloadCheck,
        getAllCategories: this.getAllCategories,
        categoryState: this.state.categoryState,
        getCheckpointsById: this.getCheckpointsById,
        handleClickCategory: this.props.handleClickCategory,
        handleClickCheckpoints: this.props.handleClickCheckpoints,
        handlerClickPinned: this.actionCheckpointMenu,
        deleteCheckpoint: this.deleteCheckpoint,
        checkpoints: this.state.checkpoints,
        handlePinCheckpoints: this.handlePinCheckpoints,
        inverseIcon: this.props.inverseIcon,
        categoryActionsId: this.state.categoryActionsId,
        deleteOwnCheckpoint: this.deleteOwnCheckpoint,
        handlerhowMcokup: this.props.handlerhowMcokup,
        handlerShowSwitch: value => this.setState({ showSwitch: value }),
        menuGray: this.props.menuGray,
        showSwitch: this.state.showSwitch,
        isOldReview: this.state.isOldReview,
        isLoaded: this.state.isLoaded,
        reviewsScores: this.state.reviewsScores,
        reviewId: this.props.reviewId,
        review: this.state.review,
        getReviewsScores: this.getReviewsScores,
        handleMeetingOrganiser: this.props.handleMeetingOrganiser,
        meetingOrganiser: this.props.meetingOrganiser,
        handleLeaveMeetingOrganiser: this.handleLeaveMeetingOrganiser,
        scores: this.state.scores,
        requests
      };
      if (this.props.renderLoading && !this.allRequestIsLoaded()) {
        return this.props.renderLoading(!this.allRequestIsLoaded());
      }
      return <WrappedComponent {...handlers} />;
    }
  }
  return withRouter(MainMenuContainer);
}

export default MainMenuContainerFunction;
