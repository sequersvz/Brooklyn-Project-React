import React, { Component } from "react";
import CategoryMenu from "./category.menu";
import CheckMenu from "./checkpoint.menu";
import "./menu.css";

class MainMenu extends Component {
  state = {
    height: window.innerHeight + 100
  };
  setHeight = () => {
    const height = document.body.scrollHeight + 150;
    const prevHeight = this.state.height;
    if (prevHeight !== height) {
      this.setState({ height });
    }
  };
  componentDidMount() {
    window.addEventListener("scroll", this.setHeight);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.setHeight);
  }

  render() {
    const {
      categoryId,
      checkState,
      categoryName,
      categoryState,
      getAllCategories,
      getCheckpointsById,
      handlerClickPinned,
      handleClickCategory,
      handleClickCheckpoints,
      checkpointId,
      reloadCheck,
      deleteCheckpoint,
      checkpoints,
      handlePinCheckpoints,
      inverseIcon,
      handlerhowMcokup,
      showSwitch,
      handlerShowSwitch,
      isOldReview,
      menuGray,
      handleMeetingOrganiser,
      meetingOrganiser,
      reviewId,
      handleLeaveMeetingOrganiser
    } = this.props;
    const handlersCheck = {
      categoryId,
      reloadCheck,
      checkState,
      handlerClickPinned,
      getCheckpointsById,
      handleClickCheckpoints,
      checkpointId,
      deleteCheckpoint,
      checkpoints,
      handlePinCheckpoints,
      isOldReview,
      categoryName,
      menuGray,
      reviewId
    };
    const handlersCategory = {
      categoryState,
      getAllCategories,
      categoryId,
      click: handleClickCategory,
      inverseIcon,
      handlerhowMcokup,
      showSwitch,
      handlerShowSwitch,
      menuGray,
      handleMeetingOrganiser,
      meetingOrganiser,
      handleLeaveMeetingOrganiser
    };

    const menuchild = <CheckMenu {...handlersCheck} />;
    const { height } = this.state;

    return (
      <div className="mainmenu">
        <div
          className="left"
          onMouseEnter={() => {
            if (!meetingOrganiser) {
              handlerShowSwitch(true);
            }
          }}
          onMouseLeave={() => {
            if (!meetingOrganiser) {
              handlerShowSwitch(false);
            }
          }}
          style={{ height, ...(meetingOrganiser && { width: "220px" }) }}
        >
          <CategoryMenu {...handlersCategory} />
        </div>
        {!meetingOrganiser && (
          <div className="row">
            <div className="col-md-12 ckeck">
              <div className="leftCheck" style={{ height }}>
                <div className="checkpointMenuTitle">
                  <p>{categoryName}</p>
                  {categoryName !== "Action Log" && (
                    <p>BrooklynVA Checkpoints</p>
                  )}
                  <hr />
                </div>
                {menuchild}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MainMenu;
