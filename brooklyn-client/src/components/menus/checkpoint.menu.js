import React, { PureComponent } from "react";
import "./menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import * as icons from "@fortawesome/free-solid-svg-icons";
import FlipMove from "react-flip-move";
import ModalRemoveReviewItem from "../reviews/modals/remove.modal";

const getColor = number => {
  if (number >= 5) {
    return "#F55A0A";
  }
  if (number > 0 && number < 5) {
    return "#FFD800";
  }
  return "#b1b1b1";
};

class CheckMenu extends PureComponent {
  state = {
    checkOver: null,
    modalDeleteCheckpoint: {}
  };

  componentDidUpdate(prevProps) {
    if (
      (this.props.categoryId !== prevProps.categoryId ||
        this.props.reloadCheck !== prevProps.reloadCheck) &&
      this.props.categoryId > 0
    ) {
      if (this.props.isMenuGray) {
        this.props.getCheckpointsById(undefined, this.props.categoryId);
      } else {
        this.props.getCheckpointsById(
          this.props.reviewId,
          this.props.categoryId
        );
      }
    }
  }

  handleDeleteMyCehckpoint = item =>
    this.setState({ modalDeleteCheckpoint: { item, showModalRemoveCK: true } });

  render() {
    const { error, isLoaded, items } = this.props.checkState;
    const click = this.props.handleClickCheckpoints;
    const { checkpointId, handlerClickPinned, deleteCheckpoint } = this.props;
    const { checkpoints, categoryName } = this.props;
    const { isOldReview } = this.props;
    const { isMenuGray, classNames } = this.props;
    const isActionLog = categoryName === "Action Log";
    const noDateOrOverdue = ["Actions (No Date)", "Overdue Actions"];
    const { showModalRemoveCK, item } = this.state.modalDeleteCheckpoint;

    const itemsToRender = items.filter(({ accountId }) => !accountId);

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <React.Fragment>
          <FlipMove
            id="flip-move-items"
            onFinish={() => {
              const flipItems = document.getElementById("flip-move-items");
              // force update to clean the DOM
              if (flipItems.children.length !== itemsToRender.length) {
                this.forceUpdate();
              }
            }}
          >
            {itemsToRender.map(checkpoint => (
              <div
                key={`${checkpoint.name}_${checkpoint.id}`}
                onClick={click.bind(this, checkpoint.id, checkpoint.name)}
                className={
                  checkpointId === checkpoint.id
                    ? !isMenuGray
                      ? "itemcheckChecked"
                      : classNames.itemcheckCheckedMenuGray
                    : !isMenuGray
                      ? "itemcheck"
                      : classNames.itemcheckMenuGray
                }
              >
                <div className="boxCheckpoint">{checkpoint.name}</div>
                {!isMenuGray ? (
                  <div className="boxIcons">
                    <i
                      className="number"
                      {...noDateOrOverdue.includes(checkpoint.name) && {
                        style: {
                          background: getColor(checkpoint.itemreviewsOpen)
                        }
                      }}
                    >
                      {checkpoint.itemreviewsOpen}
                    </i>
                    {!isActionLog && checkpoint.itemreviewsFilesCount > 0 ? (
                      <FontAwesomeIcon
                        style={{
                          fontSize: 14,
                          marginTop: 2,
                          marginRight: 10,
                          color: "b1b1b1"
                        }}
                        icon={faPaperclip}
                        pull="left"
                        inverse={true}
                      />
                    ) : (
                      ""
                    )}
                    {!isActionLog && (
                      <FontAwesomeIcon
                        style={{ fontSize: 18 }}
                        icon={faThumbtack}
                        pull="right"
                        inverse={
                          !!(
                            checkpoints[
                              checkpoints.findIndex(x => x.id === checkpoint.id)
                            ] || {}
                          ).pinned
                        }
                        color="#5b2157"
                        onClick={() => {
                          if (isOldReview) {
                            return;
                          }
                          handlerClickPinned(checkpoint.id, !checkpoint.pinned);

                          return true;
                        }}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </FlipMove>

          {!isActionLog && (
            <div
              className={
                isMenuGray ? "scoreMyCheckpoint" : "checkpointMenuSubTitle"
              }
            >
              <p>My Checkpoints</p>
              <hr />
              <FlipMove>
                {items.filter(({ accountId }) => accountId).map(checkpoint => (
                  <div
                    key={checkpoint.id}
                    onClick={click.bind(this, checkpoint.id)}
                    className={
                      checkpointId === checkpoint.id
                        ? !isMenuGray
                          ? "itemcheckChecked"
                          : "itemcheckCheckedMenuGray"
                        : !isMenuGray
                          ? "itemcheck"
                          : "itemcheckMenuGray"
                    }
                  >
                    <div className="boxCheckpoint">{checkpoint.name}</div>
                    {!isMenuGray && (
                      <div className="boxIcons">
                        <i className="number">{checkpoint.itemreviewsOpen}</i>
                        {checkpoint.itemreviewsFilesCount > 0 && (
                          <FontAwesomeIcon
                            style={{
                              fontSize: 14,
                              marginTop: 2,
                              marginRight: 10,
                              color: "b1b1b1"
                            }}
                            icon={faPaperclip}
                            pull="left"
                            inverse={true}
                          />
                        )}
                        <FontAwesomeIcon
                          style={{ fontSize: 18 }}
                          icon={icons["faTrash"]}
                          pull="right"
                          color="#5b2157"
                          onClick={e => {
                            if (isOldReview) {
                              return;
                            }
                            e.preventDefault();
                            this.handleDeleteMyCehckpoint(checkpoint);
                          }}
                        />
                        <FontAwesomeIcon
                          style={{ fontSize: 18 }}
                          icon={icons["faThumbtack"]}
                          pull="right"
                          inverse={checkpoint.pinned === true ? true : false}
                          color="#5b2157"
                          onClick={() => {
                            if (!isOldReview) {
                              handlerClickPinned(
                                checkpoint.id,
                                !checkpoint.pinned
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </FlipMove>
            </div>
          )}
          {showModalRemoveCK && (
            <ModalRemoveReviewItem
              {...{
                show: showModalRemoveCK,
                closeModal: () => this.setState({ modalDeleteCheckpoint: {} }),
                handlerClick: () => {
                  deleteCheckpoint((item || {}).id);
                  this.setState({ modalDeleteCheckpoint: {} });
                },
                objectName: `"${(item || {}).name}"`,
                name: "modalDeleteCheckpoint",
                modalName: "Checkpoint"
              }}
            />
          )}
        </React.Fragment>
      );
    }
  }
}

export default CheckMenu;
