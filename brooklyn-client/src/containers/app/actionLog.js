import React from "react";
import ActionLogReports from "../../components/action-log/ActionLogReports";
import { getVendorsReports } from "../service/vendors";
import { makeCancelable } from "../../Utils";
import Typography from "@material-ui/core/Typography";
import { LoadingSpinner } from "../../components/loading-spinner";
import SearchKit from "../../components/search-kit";
import { withStyles } from "@material-ui/core";
import FixedIcons from "../../components/fixed-icon/fixed.icons";
import { withRouter } from "react-router-dom";
let lastReportsRequest = false;
const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    marginBottom: "50px"
  }
});

class ActionLog extends React.Component {
  state = {
    loading: true,
    reports: null,
    count: 0,
    pagination: {
      rowsPerPage: 10,
      page: 0
    },
    orderBy: null,
    order: {},
    width: 0
  };

  getReports = ({
    chart = "action-log",
    filters,
    query = {},
    clearSort
  } = {}) => {
    this.setState(
      {
        loading: true,
        reports: [],
        filters,
        ...(clearSort && { orderBy: null, order: {} })
      },
      async () => {
        if (lastReportsRequest) {
          lastReportsRequest.cancel();
        }
        // triggered by search kit / setting rows per page
        if (Object.keys(query).length === 0) {
          const limit = this.state.pagination.rowsPerPage;
          query = { ...query, ...(limit && { limit }) };
        }
        const sort = this.state.orderBy;
        const desc =
          (this.state.order || {})[sort] === "desc"
            ? (this.state.order || {})[sort]
            : undefined;
        query = { ...query, ...(sort && { sort }), ...(desc && { desc }) };
        const request = getVendorsReports({ chart, filters, query });
        const cancelableRequest = makeCancelable(request);
        lastReportsRequest = cancelableRequest;
        try {
          const reports = await cancelableRequest.promise;
          lastReportsRequest = false;

          this.setState(prevState => ({
            ...prevState,
            loading: false,
            reports: reports.items,
            count: reports.count,
            // start from the first page when selecting a filter / setting rows per page
            ...(!Reflect.has(query, "offset") && {
              pagination: { ...prevState.pagination, page: 0 }
            })
          }));
        } catch (error) {
          if (!(error || {}).isCanceled) {
            console.log(error);
            this.setState({ loading: false });
          }
        }
      }
    );
  };

  handleChangePage = ({ page, filters, sort, chart }) => {
    const rows = this.state.pagination.rowsPerPage;

    this.setState(
      prevState => ({
        ...prevState,
        pagination: {
          ...prevState.pagination,
          page
        },
        ...(sort && { orderBy: sort }),
        ...(sort && {
          order: {
            [sort]:
              prevState["order"][sort] || {}
                ? prevState["order"][sort] === "desc"
                  ? "asc"
                  : "desc"
                : "asc"
          }
        })
      }),
      () => {
        const desc = this.state.order[sort] === "desc" ? "desc" : undefined;
        const query = {
          limit: rows,
          ...(page > 0 && { offset: page * rows }),
          ...(sort && { sort }),
          ...(desc && { desc })
        };
        this.getReports({ chart, filters, query });
      }
    );
  };

  handleChangeRowsPerPage = ({ rowsPerPage, filters, chart }) => {
    if (rowsPerPage !== this.state.pagination.rowsPerPage) {
      this.setState(
        prevState => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            rowsPerPage,
            page: 0
          }
        }),
        () => this.getReports({ chart, filters })
      );
    }
  };

  iconsDataStructure = handlers => {
    const { goToRoute } = handlers;
    return [
      {
        iconName: "faArrowLeft",
        iconSize: 20,
        id: 1,
        toolTipInfo: "Timeline view",
        click: goToRoute,
        unique: true
      }
    ];
  };

  render() {
    const {
      count,
      order,
      loading,
      reports,
      orderBy,
      pagination,
      filters
    } = this.state;
    const { classes } = this.props;
    let hasReports = (reports || []).length > 0;
    const goToRoute = () => this.props.history.push("/assurance");
    const handlerIconsStructure = {
      goToRoute
    };

    const iconsData = this.iconsDataStructure(handlerIconsStructure);
    return (
      <div className="col-md-12">
        <SearchKit
          reportActionLogTab={false}
          reports={false}
          landscapeReport={false}
          getAllWithFilters={filters => {
            this.getReports({ chart: "action-log", filters });
          }}
        >
          <div className="row">
            <div className="col-md-12">
              <div className={classes.root}>
                {loading && <LoadingSpinner />}
                {!loading && (
                  <div style={{ marginTop: "15px" }}>
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
                      <ActionLogReports
                        items={reports}
                        count={count}
                        filters={filters}
                        handleChangePage={this.handleChangePage}
                        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                        pagination={pagination}
                        order={order}
                        orderBy={orderBy}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SearchKit>
        <FixedIcons iconsData={iconsData} />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(ActionLog));
