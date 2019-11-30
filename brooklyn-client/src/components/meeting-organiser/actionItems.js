import React, { PureComponent } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SummaryMinutes from "./summaryMinutes";

const styles = theme => ({
  root: {
    width: "100%"
  },
  grid: {
    flexGrow: 1,
    textAlign: "left"
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular
  }
});
class ActionItems extends PureComponent {
  state = {
    editing: {
      panel1: false,
      panel2: false,
      panel3: false
    }
  };
  handleEdit = (field, value) => {
    this.setState({
      editing: {
        ...this.state.editing,
        [field]: value
      }
    });
  };
  handleChangePanel = panel => (event, expanded) => {
    this.handleEdit(panel, expanded);
  };

  render() {
    const { items } = this.props;
    if (!items || (items && items.length === 0)) return null;
    const actionCheckpoints = items.reduce(
      (prev, item) => {
        prev[item.checkpointName].items.push(item);
        prev[item.checkpointName].id = item.checkpointId;
        return { ...prev };
      },
      {
        "New Actions": { items: [], id: undefined },
        "Overdue Actions": { items: [], id: undefined },
        "Actions (No Date)": { items: [], id: undefined },
        "Future Actions": { items: [], id: undefined }
      }
    );
    return (
      <div>
        {Object.keys(actionCheckpoints).map((actionName, index) =>
          this.renderCustomPanel(
            actionName,
            `panel${index}`,
            actionCheckpoints[actionName]
          )
        )}
      </div>
    );
  }

  renderCustomPanel = (title, panel, checkpoint) => {
    const { editing } = this.state;
    const { classes, itemHandler, handleOnAddActionItem } = this.props;
    const options = {
      name: "",
      by: "",
      timeSlot: "",
      description: "",
      attendeesAndComments: "",
      reviewId: itemHandler.reviewId,
      order: 1000,
      itemreviewParent: null
    };
    const handleOnAddMeetingItem = handleOnAddActionItem(
      checkpoint.id,
      options
    );
    return (
      <ExpansionPanel
        expanded={editing[panel]}
        onChange={this.handleChangePanel(panel)}
        key={`${title}-${panel}`}
      >
        <ExpansionPanelSummary>
          <ExpandMoreIcon />{" "}
          <Typography className={classes.heading}>{title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid item xs={12} sm={12}>
            <SummaryMinutes
              {...{
                ...itemHandler,
                items: checkpoint.items,
                handleOnAddMeetingItem,
                categoryNAME: "Action Log"
              }}
            />
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };
}

export default withStyles(styles)(ActionItems);
