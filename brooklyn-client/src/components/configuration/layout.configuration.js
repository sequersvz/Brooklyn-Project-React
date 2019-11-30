import React, { PureComponent } from "react";
import MuiGrid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core";
import TabUsers from "./tabs/tab.users";
import TabBU from "../../pages/root/businessunits";
import Checkpoints from "../../pages/root/checkpoints";
import Categories from "../../pages/root/categories";
import InternalService from "../../pages/root/internalServices";
import SourcingCategory from "../../pages/root/sourcingCategory";
import UserGroups from "../../pages/root/user/user.groups";
import ScalationMatrix from "../../pages/root/ScalationMatrix";
import Risk from "../../pages/root/risk/Risk";
import ApprovalMatrix from "../../pages/root/ApprovalMatrix";
import KeyProcess from "../../pages/root/keyprocess/keyprocess";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    marginLeft: 15,
    marginRight: 15
  },
  shadowTabs: {
    boxShadow: "none"
  }
});

class LayoutUsers extends PureComponent {
  state = {
    error: "",
    selectedTab: 0
  };
  handleSelectTab = (_, tab) => this.setState({ selectedTab: tab });
  render() {
    const { classes } = this.props;
    const { selectedTab } = this.state;

    return (
      <MuiGrid container justify="center">
        <MuiGrid item xs={12}>
          <div className={classes.root}>
            <AppBar
              position="static"
              color="default"
              className={classes.shadowTabs}
            >
              <Tabs
                value={selectedTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleSelectTab}
                scrollButtons="on"
                variant="scrollable"
              >
                <Tab label="Users" className="tabButton" />
                <Tab label="Business Units" className="tabButton" />
                <Tab label="Categories" className="tabButton" />
                <Tab label="Checkpoints" className="tabButton" />
                <Tab label="Internal Service" className="tabButton" />
                <Tab label="Sourcing Category" className="tabButton" />
                <Tab label="Groups" className="tabButton" />
                <Tab label="Escalation" className="tabButton" />
                <Tab label="Risk" className="tabButton" />
                <Tab label="Approval" className="tabButton" />
                <Tab label="Key Process" className="tabButton" />
              </Tabs>
            </AppBar>
            {selectedTab === 0 && <TabUsers {...this.props} />}
            {selectedTab === 1 && <TabBU {...this.props} />}
            {selectedTab === 2 && <Categories {...this.props} />}
            {selectedTab === 3 && <Checkpoints {...this.props} />}
            {selectedTab === 4 && <InternalService {...this.props} />}
            {selectedTab === 5 && <SourcingCategory {...this.props} />}
            {selectedTab === 6 && <UserGroups {...this.props} />}
            {selectedTab === 7 && <ScalationMatrix />}
            {selectedTab === 8 && <Risk />}
            {selectedTab === 9 && <ApprovalMatrix />}
            {selectedTab === 10 && <KeyProcess />}
          </div>
        </MuiGrid>
      </MuiGrid>
    );
  }
}

export default withStyles(styles)(LayoutUsers);
