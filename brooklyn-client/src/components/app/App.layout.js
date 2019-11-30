import React, { Component } from "react";
import { connect } from "react-redux";
import MainMenuContainer from "../../containers/menus/index";
import MeetingOrganiser from "../../containers/app/meetingOrganiser";
import Itemreview from "../../containers/app/reviews";
import { withRouter } from "react-router-dom";
import LayoutMenuGray from "../../components/menus/layout.menu-gray";
import LayoutMenu from "../../components/menus/layout.menu";
import { setSelectedCheckpointName } from "../../actions/checkpoints";
import Loading from "../loading-spinner";
import moment from "moment";

const MainMenuGray = MainMenuContainer(LayoutMenuGray);
const MainMenu = MainMenuContainer(LayoutMenu);

class AppLayout extends Component {
  state = {
    checkpoint: 0,
    reloadCheck: 0,
    reloadReviewitem: 0,
    categoryId: 0,
    categoryName: "",
    inverseIcon: {},
    categoryActionId: null,
    menuGray: false,
    showPopoverScore: false,
    showTooltipData: false,
    meetingOrganiser: false,
    currentDateMinus7: moment(new Date())
      .subtract(7, "days")
      .toDate()
  };

  handleClickCheckpoints = (checkpoint, checkpointName) => {
    // to disable add review item button based on checkpoint name
    this.props.setSelectedCheckpointName(checkpointName);
    this.setState({
      checkpoint,
      checkpointName
    });
    let params = new URLSearchParams(this.props.location.search);
    params.set("checkpointId", checkpoint);
    this.props.history.push({
      search: params.toString()
    });
  };
  handleClickCategory = (categoryId, categoryName) => {
    this.setState({
      categoryId,
      categoryName
    });
    let params = new URLSearchParams(this.props.location.search);
    params.set("categoryId", categoryId);
    this.props.history.push({
      search: params.toString()
    });
  };
  reloadCheck = () => {
    this.setState({
      reloadCheck: (Math.random() * 10000).toFixed(0)
    });
  };
  reloadReviewItem = () => {
    this.setState({
      reloadReviewitem: (Math.random() * 10000).toFixed(0)
    });
  };
  getCategoryActionId = id => {
    this.setState({ categoryActionId: id });
  };

  setInverseIcon = (categoryId, animate) => {
    this.setState({
      inverseIcon: {
        [categoryId]:
          categoryId in this.state.inverseIcon
            ? !this.state.inverseIcon[categoryId]
            : true,
        animate: animate ? true : false
      }
    });
  };

  handleMeetingOrganiser = (state, action) => {
    const { categoryId } = this.state;
    if (this.state.meetingOrganiser !== state) {
      // from meeting organiser to scorecard
      if (!categoryId && action === "toScore") {
        let params = new URLSearchParams(this.props.location.search);
        params.set("categoryId", 1);
        this.props.history.push({
          search: params.toString()
        });
      }
      this.setState({ meetingOrganiser: state });
    }
  };

  handlerShowMockup = value => {
    this.setState({ menuGray: value });
  };
  render() {
    const {
      checkpoint,
      checkpointName,
      meetingOrganiser,
      currentDateMinus7
    } = this.state;
    const hadlesItemreview = {
      reviewId: this.props.match.params.id,
      itemreview: checkpoint,
      checkpointName,
      handleReloadcheck: this.reloadCheck,
      reloadReviewitem: this.state.reloadReviewitem,
      handleReloadReviewitem: this.reloadReviewItem,
      categoryId: this.state.categoryId,
      categoryName: this.state.categoryName,
      categoryActionId: this.state.categoryActionId,
      handlerhowMcokup: this.handlerShowMockup,
      setInverseIconActions: this.setInverseIcon,
      currentDateMinus7: currentDateMinus7
    };
    const handlesMenu = {
      reviewId: this.props.match.params.id,
      reloadCheck: this.state.reloadCheck,
      handleReloadcheck: this.reloadCheck,
      checkpoint: this.state.checkpoint,
      handleClickCheckpoints: this.handleClickCheckpoints,
      handleClickCategory: this.handleClickCategory,
      categoryId: this.state.categoryId,
      categoryName: this.state.categoryName,
      inverseIcon: this.state.inverseIcon,
      getCategoryActionId: this.getCategoryActionId,
      handlerhowMcokup: this.handlerShowMockup,
      menuGray: this.state.menuGray || this.props.menuGray,
      currentDateMinus7: currentDateMinus7,
      handleMeetingOrganiser: this.handleMeetingOrganiser,
      meetingOrganiser: this.state.meetingOrganiser,
      filters: this.props.filters
    };
    if (this.state.menuGray === true || this.props.menuGray === true) {
      return (
        <div className="rootContainer menu-gray">
          <MainMenuGray
            renderLoading={isLoaded => <Loading load={isLoaded} />}
            {...handlesMenu}
            menuGray={true}
          />
        </div>
      );
    }
    return (
      <div
        className="rootContainer"
        style={{ display: this.state.menuGray !== true ? "block" : "none" }}
      >
        <div className="sidemenu">
          <MainMenu {...handlesMenu} />
        </div>

        <div className="row">
          <div className="col-md-12">
            {meetingOrganiser ? (
              <MeetingOrganiser {...hadlesItemreview} />
            ) : (
              <Itemreview {...hadlesItemreview} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSelectedCheckpointName: checkpoint => {
    dispatch(setSelectedCheckpointName(checkpoint));
  }
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(AppLayout)
);
