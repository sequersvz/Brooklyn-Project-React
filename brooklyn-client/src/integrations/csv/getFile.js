import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none !important"
  }
});

const GetFile = props => (
  <React.Fragment>
    <input
      accept=".csv"
      className={props.classes.input}
      id="outlined-button-file"
      type="file"
      onChange={evt => {
        if (evt.target.files.length > 0) {
          props.onChange(evt.target.files[0]);
        }
      }}
    />
    <label htmlFor="outlined-button-file">
      <Button
        variant="contained"
        color="default"
        component="span"
        className={props.classes.button}
      >
        Upload
        <CloudUploadIcon className={props.classes.button} />
      </Button>
    </label>
  </React.Fragment>
);

GetFile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GetFile);
