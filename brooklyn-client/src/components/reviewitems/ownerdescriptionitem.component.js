import React, { PureComponent } from "react";
import "../reviews/itemreviews.css";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import DatePicker from "material-ui-pickers/DatePicker";
import { getDateFormat } from "../../Utils";
import { orderAlphabetically } from "../../actions/utils/sortByKey";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

class OwnerDescriptionComponent extends PureComponent {
  render() {
    const {
      item,
      owners,
      parentState,
      setParentState,
      editItemreview,
      isOldReview
    } = this.props;

    const orderedOwners = owners.sort((owner1, owner2) => {
      return orderAlphabetically(owner1.name, owner2.name);
    });

    const onSelectChange = e => {
      const value = e.target.value;
      return editItemreview(item.id, { ownerId: value });
    };

    const onChangeDate = date => {
      setParentState("showDueDateEdit", false);
      return editItemreview(item.id, { dueDate: date });
    };

    const handleOnOpen = () => {
      if (!parentState.showOwnerEdit) setParentState("showOwnerEdit", true);
    };

    const handleOnClose = () => {
      if (parentState.showOwnerEdit) setParentState("showOwnerEdit", false);
    };

    const selectWithUsers = (
      <Select
        name="owner"
        open={parentState.showOwnerEdit}
        onOpen={handleOnOpen}
        onClose={handleOnClose}
        value={item.ownerId !== null ? item.ownerId : "0"}
        onChange={onSelectChange}
        label="Owner"
        placeholder="Type then select the name column"
      >
        <MenuItem value="0">
          <em>Select</em>
        </MenuItem>
        {orderedOwners.map(owner => {
          return (
            <MenuItem key={owner.id} value={owner.id}>
              {owner.name}
            </MenuItem>
          );
        })}
      </Select>
    );

    const RenderDatePiker = (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          className={"datapikerSelector"}
          value={item.dueDate !== null ? item.dueDate : new Date()}
          format={"DD-MM-YYYY"}
          style={{ marginTop: 10, width: "100%" }}
          onChange={onChangeDate}
          onClose={() => setParentState("showDueDateEdit", false)}
          ref={node => {
            if (node !== null) {
              node.open();
            }
          }}
        />
      </MuiPickersUtilsProvider>
    );

    return (
      <div className="boxContainer">
        <React.Fragment>
          {item.itemreviewParent && (
            <div>
              <p className="title">Created from</p>
              <a
                href={`/assurance/review/${
                  item.reviewItemParent.review.id
                }?categoryId=${
                  item.reviewItemParent.reviewcheckpoint.checkpoint.category.id
                }&checkpointId=${
                  item.reviewItemParent.reviewcheckpoint.checkpoint.id
                }`}
              >{`
              ${item.reviewItemParent.review.notes} / ${
                item.reviewItemParent.reviewcheckpoint.checkpoint.category.name
              } / ${
                item.reviewItemParent.reviewcheckpoint.checkpoint.name
              }`}</a>
            </div>
          )}
          <div>
            <p className="title">Due Date / Next Update</p>
            {parentState.showDueDateEdit === true &&
            !item.closed &&
            !isOldReview ? (
              RenderDatePiker
            ) : (
              <div
                onClick={() => setParentState("showDueDateEdit", true)}
                data-tip={isOldReview ? "can not be modified" : ""}
              >
                {item.dueDate !== null ? (
                  <span>{getDateFormat(item.dueDate)}</span>
                ) : !item.closed ? (
                  <span>Select date</span>
                ) : (
                  "can not be modified "
                )}
              </div>
            )}
          </div>
          <div
            style={{ cursor: item.doneByTheOwner ? "default" : "pointer" }}
            onClick={() => {
              if (!item.doneByTheOwner && !isOldReview) {
                handleOnOpen();
              }
            }}
          >
            <p className="title">Owner</p>
            {parentState.showOwnerEdit === true &&
            !item.closed &&
            !isOldReview ? (
              selectWithUsers
            ) : (
              <div data-tip={isOldReview ? "can not be modified" : ""}>
                {item.user !== null && item.user ? (
                  <span>
                    {item.user.name}{" "}
                    {item.doneByTheOwner && (
                      <>
                        <FontAwesomeIcon
                          style={{ color: "#5cb80a" }}
                          icon={faCheck}
                          data-tip="The owner has marked this task as completed"
                        />
                        <ReactTooltip />
                      </>
                    )}
                  </span>
                ) : !item.closed ? (
                  selectWithUsers
                ) : (
                  "can not be modified "
                )}
              </div>
            )}
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OwnerDescriptionComponent;
