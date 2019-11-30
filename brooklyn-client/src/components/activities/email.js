import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tick from "@material-ui/icons/CheckCircle";
import Cross from "@material-ui/icons/HighlightOff";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";

import Green from "@material-ui/core/colors/green";

import MiEmail from "./miEmail";

const styles = theme => ({
  root: {
    width: "100%"
  },
  check: {
    color: Green[100],
    fontSize: "inherit",
    verticalAlign: "text-top"
  },
  cross: {
    color: theme.palette.error.main,
    fontSize: "inherit",
    verticalAlign: "text-top"
  }
});

const EmailSecurity = withStyles(styles)(props => {
  const { classes } = props;
  let errorMessage = "test";
  let failed = [];
  if (props.body.spam !== "PASS") {
    failed.push("spam");
  }
  if (props.body.dkim !== "PASS") {
    failed.push("dkim");
  }
  if (props.body.spf !== "PASS") {
    failed.push("spf");
  }
  if (props.body.dmarc !== "PASS") {
    failed.push("dmarc");
  }
  if (failed.length) {
    errorMessage = `This email failed the following checks; ${failed.join(
      ","
    )}`;
  }
  const emailSecure =
    failed.length === 0 ? (
      <Tick className={classes.check} />
    ) : (
      <Tooltip title={errorMessage}>
        <Cross className={classes.cross} />
      </Tooltip>
    );
  return <Typography variant="body2">Secure Email: {emailSecure}</Typography>;
});

export default withStyles(styles)(props => (
  <div className={props.classes.root}>
    <Typography variant="body2">From: {props.body.source}</Typography>
    <Typography variant="body2">To: {props.body.recipients[0]}</Typography>
    <Typography variant="body2">Subject: {props.body.emailSubject}</Typography>
    <Typography variant="caption">{props.body.emailBody}</Typography>
    <Divider variant="fullWidth" />
    {props.body.emailType === "mi" && <MiEmail {...props} />}
    <EmailSecurity {...props} />
  </div>
));
