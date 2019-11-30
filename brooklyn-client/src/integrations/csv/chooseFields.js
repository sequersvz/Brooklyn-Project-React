import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

import AutoSelect from "../../components/autoSelect";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

class ChooseFields extends React.Component {
  state = {
    name: null,
    invoice: null,
    tco: null,
    nco: null,
    csat: null
  };

  render() {
    const { classes, suggestions, onChange } = this.props;
    return (
      <React.Fragment>
        <Typography variant="body2">
          Select columns for vendor input values
        </Typography>
        <List component="nav">
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={name => this.setState({ name })}
              label="Name"
              placeHolder="Type then select the name column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={invoice => this.setState({ invoice })}
              label="Invoiced YTD"
              placeHolder="Type then select the invoiced YTD column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={tco => this.setState({ tco })}
              label="Total cost optimizations"
              placeHolder="Type then select the total cost optimizations column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={nco => this.setState({ nco })}
              label="Number of cost optimizations"
              placeHolder="Type then select the number of cost optimizations column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={csat => this.setState({ csat })}
              label="Data Quality"
              placeHolder="Type then select the Data Quality value column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={csat => this.setState({ csat })}
              label="CSAT (%)"
              placeHolder="Type then select the CSAT percentage column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={csat => this.setState({ csat })}
              label="Anual Contract Value"
              placeHolder="Type then select the Anual Contract value column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={csat => this.setState({ csat })}
              label="Contract Start Date"
              placeHolder="Type then select the Contract Start Date value column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={csat => this.setState({ csat })}
              label="Contract End Date"
              placeHolder="Type then select the Contract End Date value column"
            />
          </ListItem>
          <ListItem>
            <AutoSelect
              suggestions={suggestions}
              onChange={csat => this.setState({ csat })}
              label="Total Contract Value"
              placeHolder="Type then select the Total Contract Value column"
            />
          </ListItem>
        </List>
        <Button
          onClick={() => {
            if (onChange) {
              onChange(this.state);
            }
          }}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Next
        </Button>
      </React.Fragment>
    );
  }
}

ChooseFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ChooseFields);
