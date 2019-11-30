import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SyncIcon from "@material-ui/icons/Sync";
import { LoadingSpinner } from "../../loading-spinner";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    padding: "30px"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "300px"
  },
  fab: {
    margin: theme.spacing.unit
  },
  selectMargin: {
    marginTop: "16px",
    marginBottom: "8px"
  }
});

class Email extends React.Component {
  state = {
    newAlertPref: null,
    updating: false,
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    }
  };

  generateNewMi = async () => {
    await this.props.generateMiEmail();
  };

  generateNewEe = async () => {
    await this.props.generateEeEmail();
  };

  update = () => {
    const { updateConfig, vendorManagerEmail } = this.props;
    const { newEmail } = this.state;
    this.setState({ updating: true }, async () => {
      try {
        await updateConfig({
          vendorManagerEmail: newEmail || vendorManagerEmail,
          alertPref: "immediately"
        });
        this.setState({ updating: false });
        this.openAlert({
          message: "Email settings updated",
          variant: "success",
          duration: 3000
        });
      } catch (error) {
        this.setState({ updating: false });
        this.openAlert({
          message: "Could not update the email settings",
          variant: "error",
          duration: 3000
        });
      }
    });
  };

  openAlert = ({ message, variant, duration }) =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        open: true,
        variant,
        duration,
        message
      }
    }));

  closeAlert = () =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        ...prevState.alert,
        open: false
      }
    }));

  render() {
    let { eeEmail, miEmail, alertPref, classes, loading } = this.props;

    if (loading) {
      return <LoadingSpinner />;
    }

    let { newAlertPref, updating } = this.state;

    if (newAlertPref === null) newAlertPref = alertPref || "";
    if (eeEmail === null) eeEmail = "None set";
    if (miEmail === null) miEmail = "None set";

    return (
      <div className={classes.root}>
        <Grid container justify="space-around">
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <TextField
              disabled
              label="Send MI emails to"
              value={miEmail}
              className={classes.textField}
              margin="normal"
            />
            <Fab
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={() => {
                if (!updating) {
                  this.generateNewMi();
                }
              }}
            >
              <SyncIcon />
            </Fab>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <TextField
              disabled
              label="Send attachment emails to"
              value={eeEmail}
              className={classes.textField}
              margin="normal"
            />
            <Fab
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={() => {
                if (!updating) {
                  this.generateNewEe();
                }
              }}
            >
              <SyncIcon />
            </Fab>
          </Grid>
        </Grid>

        {/* <FormControl
          className={[classes.textField, classes.selectMargin].join(" ")}
        >
          <InputLabel htmlFor="emailFrequency">
            Email alert frequency
          </InputLabel>
          <Select
            disabled={updating}
            className={classes.selectEmpty}
            value={newAlertPref}
            onChange={event =>
              this.setState({ newAlertPref: event.target.value })
            }
            inputProps={{
              name: "emailFrequency",
              id: "emailFrequency"
            }}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="immediately">Immediately</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
          </Select>
        </FormControl> 
        <div className="boxButton">
          <Button
            variant="contained"
            color="primary"
            onClick={this.update}
            disabled={updating}
          >
            {updating ? "Saving..." : "Save"}
          </Button>
        </div>

        <Alert
          open={alert.open}
          message={alert.message}
          duration={alert.duration}
          variant={alert.variant}
          handleClose={this.closeAlert}
        />
          */}
      </div>
    );
  }
}

Email.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Email);
