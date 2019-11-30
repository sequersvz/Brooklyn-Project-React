import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";
import Treemap from "./charts/Treemap";
import Trends from "./charts/Trends";
import Risk from "./charts/Risk";
import LoadingSpinnerWithoutBackground, {
  LoadingSpinner
} from "../loading-spinner";
import SearchKit from "../search-kit";
import { connect } from "react-redux";
import { parseSelectedFilters } from "../../Utils";
import Review from "../app/App.layout";
import { withRouter } from "react-router-dom";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    marginBottom: "50px",
    padding: 15
  },
  shadowTabs: {
    boxShadow: "none"
  }
});

const charts = ["treemap", "trends", "risk-matrix", "scores"];

class Reports extends React.Component {
  state = { tab: 0, width: 0, switched: false };

  componentDidUpdate() {
    const div = document.getElementById("transition-div");
    if (div) {
      div.addEventListener("transitionend", this.handleResize);
    }
  }
  componentWillUnmount() {
    const div = document.getElementById("transition-div");
    if (div) {
      div.removeEventListener("transitionend", this.handleResize);
    }
  }
  handleResize = () => {
    const { width } = this.state;
    const tabsDiv = document.getElementById("grid-container");
    if (tabsDiv) {
      const tabsWidth = tabsDiv.offsetWidth;
      if (tabsWidth !== width) {
        this.setState({ width: tabsWidth });
      }
    }
  };
  handleSelectTab = (_, tab) => {
    const currentTab = this.state.tab;
    if (currentTab !== tab) {
      const chart = charts[tab];
      const filters = parseSelectedFilters(this.props.queryFilters);
      this.setState({ tab }, () => {
        this.props.setSwitchState(true);
        if (chart !== "scores") {
          this.props.getReports({
            chart,
            filters,
            clearSort: false
          });
        }
      });
    }
  };

  handleChangePage = ({ page, sort, chart }) => {
    const filters = parseSelectedFilters(this.props.queryFilters);
    this.props.handleChangePage({ page, filters, sort, chart });
  };

  handleChangeRowsPerPage = ({ rowsPerPage, chart }) => {
    const filters = parseSelectedFilters(this.props.queryFilters);
    this.props.handleChangeRowsPerPage({ rowsPerPage, filters, chart });
  };

  renderReview = props => {
    return props.filters ? (
      <div style={{ marginTop: 30 }}>
        <Review {...props} />
      </div>
    ) : (
      <LoadingSpinnerWithoutBackground load />
    );
  };

  handleRiskSwitch = () => {
    const query = { type: !this.props.switched ? "residual" : "net" };
    const filters = parseSelectedFilters(this.props.queryFilters);
    this.props.handleRiskSwitch({
      filters,
      query
    });
  };

  componentDidMount() {
    if ((this.props.location.state || {}).fromStakeholder) {
      this.handleSelectTab(null, 3);
      this.props.setLoading(false);
    }
  }

  render() {
    const { tab, filters } = this.state;
    const { classes, reports } = this.props;
    let hasReports;
    const chart = charts[tab];
    if (["treemap"].includes(chart)) {
      hasReports = (reports || []).length > 0;
    } else if ([3].includes(tab)) {
      hasReports = true;
    } else if (chart === "risk-matrix") {
      hasReports = ((reports || {}).matrix || []).length > 0;
    } else {
      hasReports = ((reports || {}).data || []).length > 0;
    }
    return (
      <div className="col-md-12">
        <SearchKit
          reports={[0, 1].includes(tab)}
          landscapeReport={tab === 0}
          getAllWithFilters={filters => {
            this.setState(prevState => ({ ...prevState, filters }));
            if (tab !== 3) {
              this.props.getReports({ chart, filters });
            }
          }}
        >
          <div className="row">
            <div className="col-md-12">
              <AppBar position="static" color="default">
                <Tabs
                  value={tab}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.handleSelectTab}
                  centered
                >
                  <Tab label="Landscape" className="tabButton" />
                  <Tab label="Trends" className="tabButton" />
                  <Tab label="Risk" className="tabButton" />
                  <Tab label="Scores" className="tabButton" />
                </Tabs>
              </AppBar>
              <div className={classes.root}>
                {this.props.loading && <LoadingSpinner />}
                {!this.props.loading && (
                  <div>
                    {!hasReports ? (
                      <div
                        style={{
                          textAlign: "center",
                          height: "300px",
                          paddingTop: "120px"
                        }}
                      >
                        <Typography>No data to display</Typography>
                      </div>
                    ) : (
                      <React.Fragment>
                        {tab === 0 && <Treemap vendors={this.props.reports} />}
                        {tab === 1 && <Trends reports={this.props.reports} />}
                        {tab === 2 && (
                          <Risk
                            report
                            data={reports}
                            handleSwitch={this.handleRiskSwitch}
                            switched={this.props.switched}
                            loading={this.props.loadingRiskMatrix}
                          />
                        )}
                        {tab === 3 &&
                          this.renderReview({
                            menuGray: true,
                            filters
                          })}
                      </React.Fragment>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SearchKit>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  queryFilters: state.queryFilters
});

export default connect(mapStateToProps)(
  withStyles(styles)(withRouter(Reports))
);
