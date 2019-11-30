import React from "react";
import PropTypes from "prop-types";
import Papa from "papaparse";
import Moment from "react-moment";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import GetFile from "./getFile";
import ChooseFields from "./chooseFields";
import ShowPreview from "./showPreview";
import Import from "./import";

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
    stage: "chooseFile",
    fileName: null,
    lastModified: null,
    fields: null,
    data: null,
    dataFields: null
  };

  parseCsv = file => {
    this.setState({
      stage: "parsingFile",
      fileName: file.name,
      lastModified: file.lastModifiedDate
    });
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: results => {
        const fields = results.meta.fields.map(field => ({ label: field }));
        this.setState({
          stage: "chooseFields",
          fields: fields,
          data: results.data
        });
      }
    });
  };

  render() {
    const { classes } = this.props;
    const {
      stage,
      fields,
      dataFields,
      data,
      fileName,
      lastModified
    } = this.state;

    let content = null;
    switch (stage) {
      default:
      case "chooseFile":
        content = <GetFile onChange={this.parseCsv} />;
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
        <Typography variant="body2">Import vendor csv</Typography>
        {lastModified !== null && (
          <Typography variant="subheading" gutterBottom>
            {fileName} (<Moment format="DD/MM/YYYY">{lastModified}</Moment>)
          </Typography>
        )}
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
