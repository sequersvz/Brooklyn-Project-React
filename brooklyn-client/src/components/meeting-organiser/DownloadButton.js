import React from "react";
import Button from "@material-ui/core/Button";

const DownloadButton = props => (
  <Button
    variant="outlined"
    color="primary"
    style={{ width: "200px", marginTop: "10px" }}
    {...props}
  >
    {props.text || "Download Minutes"}
  </Button>
);
export default DownloadButton;
