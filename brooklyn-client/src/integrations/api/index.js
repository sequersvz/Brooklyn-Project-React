import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ChooseFields from "../csv/chooseFields";
import Import from "../csv/import";
import ShowPreview from "../csv/showPreview";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";

import { getObjetsFromApi } from "../../containers/service/integration";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: 500,
    margin: "0 auto"
  },
  content: {
    paddingTop: theme.spacing.unit * 2
  }
});

class ImportCsv extends React.Component {
  state = {
    stage: "getApi",
    lastModified: null,
    fields: null,
    data: null,
    dataFields: null
  };

  render() {
    const { classes } = this.props;
    const { stage, fields, dataFields, data } = this.state;
    const { url, user, password } = this.state;

    const onSucces = response => {
      if (response.result.length > 0) {
        const fields = Object.keys(response.result[0]).map(field => ({
          label: field
        }));
        this.setState({
          dataFields: response.result,
          fields,
          data: response.result,
          stage: "chooseFields"
        });
      }
    };
    const onError = error => console.log(error);
    const _getVendors = getObjetsFromApi(onSucces, onError);

    let content = null;
    switch (stage) {
      default:
      case "getApi":
        content = (
          <React.Fragment>
            <Typography variant="headline">
              Please provide your Service Now instance URL, username & password
            </Typography>
            <List component="nav">
              <ListItem>
                <input
                  onChange={event => this.setState({ url: event.target.value })}
                  label="Full Url Api"
                  placeholder="https://..."
                />
              </ListItem>
              <ListItem>
                <input
                  onChange={event =>
                    this.setState({ user: event.target.value })
                  }
                  label="User"
                  placeholder="Username"
                />
              </ListItem>
              <ListItem>
                <input
                  type="password"
                  onChange={event =>
                    this.setState({ password: event.target.value })
                  }
                  label="Password"
                  placeholder="Password"
                />
              </ListItem>
            </List>
            <Button
              onClick={() => _getVendors(url, user, password)}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Next
            </Button>
          </React.Fragment>
        );
        break;

      case "chooseFields":
        content = (
          <ChooseFields
            suggestions={fields}
            onChange={resp =>
              this.setState({ dataFields: resp, stage: "showPreview" })
            }
          />
        );
        break;

      case "showPreview":
        content = (
          <ShowPreview
            onReady={() => this.setState({ stage: "importing" })}
            dataFields={dataFields}
            data={data.slice(0, 3)}
          />
        );
        break;

      case "importing":
        content = <Import dataFields={dataFields} data={data} />;
        break;
    }

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="body2">Import vendors from Service Now</Typography>
        <Divider />
        <div className={classes.content}>{content}</div>
      </Paper>
    );
  }
}

ImportCsv.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImportCsv);
