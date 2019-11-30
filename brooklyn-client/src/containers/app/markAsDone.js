import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { getActionItemData, markActionItemAsDone } from "../service/itemreview";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core";
import { LoadingSpinner } from "../../components/loading-spinner";

const styles = () => ({
  paper: {
    padding: 30,
    marginTop: 100,
    textAlign: "center"
  },

  text: {
    padding: "30px 0"
  }
});

const MarkAsDone = props => {
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [action, setAction] = useState({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getAction = async () => {
      setError(false);
      try {
        const item = await getActionItemData(props.location.search);
        setAction(item);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    };
    getAction();
  }, []);

  const markAsDone = async () => {
    setMarking(true);
    try {
      await markActionItemAsDone(props.location.search);
      setMarking(false);
      setDone(true);
    } catch (error) {
      console.log(error);
      setMarking(false);
      setError(true);
    }
  };

  const Message = ({ children }) => (
    <Typography className={props.classes.text}>{children}</Typography>
  );

  return (
    <Grid container justify="center">
      <Grid item xs={8}>
        <Paper className={props.classes.paper}>
          <Typography variant="h6">Mark Action Item as Done</Typography>
          {loading && <LoadingSpinner />}
          {!loading &&
            error && (
              <Message>{"Your request could not be processed"}</Message>
            )}{" "}
          {!loading &&
            !error &&
            done && <Message>Action item marked as done!</Message>}
          {!loading &&
            !error &&
            !done && (
              <React.Fragment>
                <Message>{`You are trying to mark the item: "${
                  action.title
                }" as done.\n\nDo you want to proceed?`}</Message>
                <Grid container justify="center">
                  <Grid item xs={4}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={markAsDone}
                      disabled={marking}
                    >
                      {marking ? "Please wait..." : "Yes, mark as done"}
                    </Button>
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
        </Paper>
        <p style={{ marginTop: "65px", textAlign: "center" }}>
          Copyright © 2019 Brooklyn Supply Chain Solutions Ltd.{" "}
        </p>

        <div
          style={{
            textAlign: "center",
            background: "#683364",
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          <img
            style={{ padding: "16px" }}
            src="https://s3.eu-west-2.amazonaws.com/brooklyn-attachments/public/uploads/logos/logoBrooklynTransparent.png"
            alt="Brooklyn"
            width="200"
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(MarkAsDone));
