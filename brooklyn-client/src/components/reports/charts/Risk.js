import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RiskMatrix from "../../risk-matrix/RiskMatrix";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = () => ({
  root: {
    flexGrow: 1,
    margin: 50
  },
  bodyText: {
    paddingTop: 20,
    paddingBottom: 25
  },
  slider: {
    paddingBottom: 30
  },
  riskTitle: {
    fontSize: "1.4em",
    marginBottom: 15,
    float: "left"
  },
  riskValue: {
    fontSize: "1.4em",
    marginBottom: 15,
    float: "right"
  },
  riskScore: {
    marginTop: 50
  },
  riskScoreDiv: { width: "60%", marginTop: 10 },
  resultLine: {
    width: "65%",
    margin: 1.5,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderColor: "#555"
  },
  riskMatrix: {
    marginTop: 50,
    paddingBottom: 50
  }
});

const getRiskTableDataFromLabel = ({ label, data }) => {
  if (data) {
    let key = "";
    let index = Object.keys(data).findIndex(k => {
      if (k === label) {
        key = k;
        return true;
      }
      return false;
    });
    if (index > -1) {
      return data[key];
    }
    return data.total;
  } else {
    return 0;
  }
};

const Risk = props => {
  const { classes, data, report, handleSwitch, switched, loading } = props;

  const [minHeight, setMinHeight] = useState(window.screen.availHeight - 250);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setMinHeight(window.screen.availHeight - 250)
    );

    return () => {
      window.removeEventListener("resize", () =>
        setMinHeight(window.screen.availHeight - 250)
      );
    };
  }, []);

  return (
    <>
      {loading ? (
        <LinearProgress style={{ marginTop: "-15px" }} />
      ) : (
        <div style={{ marginTop: "-15px", height: "4px" }} />
      )}
      <Grid className={classes.root} style={{ minHeight }}>
        <Grid container className={classes.riskMatrix}>
          <Grid
            container
            item
            xs={4}
            sm={4}
            direction="column"
            className={classes.riskScore}
          >
            {Object.keys(data.table).map(
              (label, i) =>
                label === "total" ? null : (
                  <div key={i} className={classes.riskScoreDiv}>
                    <Typography className={classes.riskTitle} variant="h3">
                      {label}
                    </Typography>
                    <Typography className={classes.riskValue} variant="h3">
                      {getRiskTableDataFromLabel({ label, data: data.table })}
                    </Typography>
                  </div>
                )
            )}
            <hr className={classes.resultLine} />{" "}
            <div className={classes.riskScoreDiv}>
              <Typography className={classes.riskTitle} variant="h3">
                Total
              </Typography>
              <Typography className={classes.riskValue} variant="h3">
                {getRiskTableDataFromLabel({ data: data.table })}
              </Typography>
            </div>
          </Grid>
          <Grid container item xs={8} sm={8} justify="center">
            <RiskMatrix
              {...{
                sliders: data.config,
                cellHeight: 50,
                report,
                riskMatrixData: data.matrix,
                handleSwitch,
                switched,
                loading
              }}
            />
          </Grid>{" "}
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(Risk);
