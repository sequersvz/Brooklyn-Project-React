import React from "react";
import TextField from "@material-ui/core/TextField/index";
import { PaperclipIcon } from "./item.icons";

export const ItemNameInput = ({
  item,
  showEdit,
  isOldReview,
  handleOnBlur,
  editshowEdit,
  itemreviewName,
  handleOnKeyDown,
  handleInputChange
}) => {
  return (
    <React.Fragment>
      {editableInput({
        item,
        isOldReview,
        handleOnBlur,
        handleOnKeyDown,
        handleInputChange,
        field: "name",
        value: itemreviewName,
        name: "itemreviewName",
        updateField: editshowEdit,
        showEditingField: showEdit
      })}
    </React.Fragment>
  );
};

export const TimeSlotInput = ({
  item,
  isOldReview,
  handleOnBlur,
  handleOnKeyDown,
  handleInputChange,
  showTimeSlotEdit,
  editTimeSlotEdit,
  itemreviewTimeSlot
}) => {
  return (
    <React.Fragment>
      {editableInput({
        item,
        isOldReview,
        handleOnBlur,
        handleOnKeyDown,
        handleInputChange,
        field: "timeSlot",
        value: itemreviewTimeSlot,
        name: "itemreviewTimeSlot",
        updateField: editTimeSlotEdit,
        showEditingField: showTimeSlotEdit
      })}
    </React.Fragment>
  );
};

export const ByInput = ({
  item,
  itemreviewBy,
  editByEdit,
  showByEdit,
  isOldReview,
  handleOnBlur,
  handleOnKeyDown,
  handleInputChange
}) => {
  return (
    <React.Fragment>
      {editableInput({
        item,
        isOldReview,
        handleOnBlur,
        handleOnKeyDown,
        handleInputChange,
        field: "by",
        value: itemreviewBy,
        name: "itemreviewBy",
        updateField: editByEdit,
        showEditingField: showByEdit
      })}
    </React.Fragment>
  );
};

export const editableInput = ({
  item,
  name,
  field,
  value,
  style,
  updateField,
  isOldReview,
  handleOnBlur,
  handleOnKeyDown,
  showEditingField,
  handleInputChange
}) => {
  const inputsProps = {
    name,
    value: typeof value !== "undefined" ? value : item[field],
    onChange: handleInputChange,
    autoFocus: true,
    onDoubleClick: e => e.stopPropagation(),
    onBlur: handleOnBlur({ field, value, name, updateField }),
    style: {
      width: "80%",
      paddingTop: 0
    }
  };
  return (
    <div style={{ cursor: "pointer" }}>
      {typeof showEditingField !== "undefined" &&
      showEditingField[item.id] === true ? (
        name === "itemreviewAttendees" ? (
          <TextField multiline rows={3} {...inputsProps} />
        ) : (
          <input
            onKeyDown={handleOnKeyDown({
              field,
              value,
              name,
              updateField
            })}
            {...inputsProps}
          />
        )
      ) : (
        <span
          style={{
            ...style,
            marginBottom: 0,
            whiteSpace: name === "itemreviewAttendees" ? "pre-wrap" : null,
            cursor: "text"
          }}
          onClick={() => {
            // showEditingField holds the id of the item currently being edited, and its status
            // we can do a check against that
            const isEditingAnotherField = Object.keys(
              showEditingField || {}
            ).some(key => {
              return (
                parseInt(key, 10) !== parseInt(item.id, 10) &&
                (showEditingField || {})[key]
              );
            });
            if (!isOldReview && !isEditingAnotherField) {
              updateField && updateField(item.id);
            }
          }}
          data-tip={`${messageIsOldReview(isOldReview)}`}
        >
          {(item[field] && item[field].trim() && item[field]) ||
            `Click to edit`}
          {(field === "name" && item.files.length > 0) ||
          (field === "name" &&
            (item.description || "").includes("<img src=")) ? (
            <PaperclipIcon
              {...{
                style: {
                  marginLeft: 8,
                  fontSize: 12,
                  display: "inline"
                },
                isOldReview
              }}
            />
          ) : null}
        </span>
      )}
    </div>
  );
};

const messageIsOldReview = isOldReview => {
  if (isOldReview) return "can not be modified";
  return "";
};
