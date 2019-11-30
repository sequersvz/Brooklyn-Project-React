import React from "react";
import Button from "@material-ui/core/Button";

const SendInviteButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="outlined"
    color="primary"
    style={{ width: "200px" }}
  >
    Send Invite
  </Button>
);
export default SendInviteButton;
