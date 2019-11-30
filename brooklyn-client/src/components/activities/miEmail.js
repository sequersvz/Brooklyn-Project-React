import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = {};

export default withStyles(styles)(props => {
  const { failedMetrics, count } = props.body;
  let failedCount = 0;
  for (let i = 0, l = (failedMetrics || []).length; i < l; i++) {
    const vendor = failedMetrics[i];
    failedCount += (vendor.data || []).length;
  }
  return (
    <>
      <Typography variant="body2">Failed Metrics: {failedCount}</Typography>
      <Typography variant="body2">Metrics Processed: {count}</Typography>
    </>
  );
});
