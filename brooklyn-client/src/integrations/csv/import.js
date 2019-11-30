import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { API, Auth } from "aws-amplify";

import asyn from "async";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  textProgress: {
    textAlign: "center",
    margin: theme.spacing.unit
  },
  completed: {
    textAlign: "center",
    margin: theme.spacing.unit
  },
  errorMsg: {
    textAlign: "center",
    margin: theme.spacing.unit
  }
});

class Import extends React.Component {
  state = {
    uploaded: 0,
    errors: []
  };

  async componentDidMount() {
    const { data, dataFields } = this.props;

    let accountId = 1;
    const user = await Auth.currentAuthenticatedUser();
    if (user.attributes.hasOwnProperty("custom:accountId")) {
      accountId = user.attributes["custom:accountId"];
    }

    asyn.eachOfLimit(data, 5, async (item, key, callback) => {
      const options = {
        body: {
          name: item[dataFields["name"]],
          invoiceYtd: item[dataFields["invoice"]],
          costOptimizations: item[dataFields["tco"]],
          numberOfCostOptimizations: item[dataFields["nco"]],
          csat: item[dataFields["csat"]]
        }
      };
      try {
        await API.post("UsersAPI", `/accounts/${accountId}/vendors`, options);
      } catch (e) {
        this.setState({ errors: [...this.state.errors, item] });
      }
      this.setState({ uploaded: this.state.uploaded + 1 });
      callback();
    });
  }

  render() {
    const { classes } = this.props;
    const { uploaded, errors } = this.state;
    const completed = (this.props.data.length / uploaded) * 100;
    return (
      <div className={classes.root}>
        <Typography variant="display1" className={classes.textProgress}>
          {`Uploaded ${uploaded} of ${this.props.data.length}`}
        </Typography>
        <LinearProgress variant="determinate" value={completed} />
        {completed === 100 && (
          <Typography variant="headline" className={classes.completed}>
            Import complete
          </Typography>
        )}
        {errors.length > 0 && (
          <Typography
            variant="headline"
            color="error"
            className={classes.errorMsg}
          >
            {`There were issues importing ${errors.length} vendor(s)`}
          </Typography>
        )}
      </div>
    );
  }
}

Import.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Import);
