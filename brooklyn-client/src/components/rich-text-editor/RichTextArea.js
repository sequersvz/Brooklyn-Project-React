import React, { useState } from "react";
import RichTextEditor from "./index";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";
import "./text-area.css";
const styles = () => ({
  boxTextField: {
    margin: 10
  },
  textField: {
    width: 400
  },
  numberField: {
    width: 260
  },
  nameTextField: {
    width: 400
  },
  inputLabel: {
    color: "#0000008a",
    fontSize: "1m"
  },
  inputLabelSelected: {
    color: "#683364",
    fontSize: "1m"
  }
});
const RichTextArea = ({
  text,
  name,
  title,
  classes,
  disabled,
  handleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = (_, editing) => setIsEditing(editing);
  return (
    <div className={["rich-text-area", isEditing ? "editing" : ""].join(" ")}>
      <Typography
        variant="caption"
        display="block"
        gutterBottom
        className={isEditing ? classes.inputLabelSelected : classes.inputLabel}
      >
        {title}
      </Typography>
      <RichTextEditor
        {...{
          text,
          name,
          isEditing,
          disabled,
          handleEdit,
          handleChange,
          renderOverview: function Overview(htmlString) {
            return (
              <div
                className="text-area-overview"
                onClick={() => handleEdit(null, true)}
              >
                {htmlString || `Click to edit ${title}`}
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default withStyles(styles)(RichTextArea);
