import React from "react";
import ReportCharts from "../../components/reports";
import { getVendorsReports } from "../service/vendors";
import { makeCancelable } from "../../Utils";

let lastReportsRequest = false;

class Reports extends React.Component {
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
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    },
    loadingRiskMatrix: false,
    switched: true
  };

  getReports = ({ chart = "treemap", filters, query = {}, clearSort } = {}) => {
    this.setState(
      {
        loading: true,
        reports: [],
        ...(clearSort && { orderBy: null, order: {} })
      },
      async () => {
        if (lastReportsRequest) {
          lastReportsRequest.cancel();
        }
        // triggered by search kit / setting rows per page
        if (["action-log"].includes(chart) && Object.keys(query).length === 0) {
          const limit = this.state.pagination.rowsPerPage;
          query = { ...query, ...(limit && { limit }) };
        }
        if (chart === "risk-matrix") {
          query = { ...query, type: this.state.switched ? "residual" : "net" };
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
          if (chart === "treemap") {
            const filteredReports = reports.filter(({ value }) => value);
            this.setState({ loading: false, reports: filteredReports });
          } else if (["action-log", "risk-matrix"].includes(chart)) {
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
          } else {
            this.setState({ loading: false, reports });
          }
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

  openAlert = ({ message, variant, duration }) =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        open: true,
        variant: variant || "success",
        duration: duration || 3000,
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

  handleRiskSwitch = ({ query, filters } = {}) => {
    if (lastReportsRequest) {
      lastReportsRequest.cancel();
    }

    this.setState(
      prevState => ({
        ...prevState,
        loadingRiskMatrix: true,
        switched: !prevState.switched
      }),
      async () => {
        const request = getVendorsReports({
          chart: "risk-matrix",
          filters,
          query
        });
        const cancelableRequest = makeCancelable(request);
        lastReportsRequest = cancelableRequest;
        try {
          const reports = await cancelableRequest.promise;
          lastReportsRequest = false;
          this.setState(prevState => ({
            ...prevState,
            reports: reports.items,
            count: reports.count,
            loadingRiskMatrix: false
          }));
        } catch (error) {
          if (!(error || {}).isCanceled) {
            console.log(error);
            this.setState(prevState => ({
              ...prevState,
              loadingRiskMatrix: false
            }));
          }
        }
      }
    );
  };

  setSwitchState = switched =>
    this.setState(prevState => ({ ...prevState, switched }));

  setLoading = loading =>
    this.setState(prevState => ({ ...prevState, loading }));

  render() {
    return (
      <ReportCharts
        reports={this.state.reports}
        count={this.state.count}
        loading={this.state.loading}
        getReports={this.getReports}
        handleChangePage={this.handleChangePage}
        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        pagination={this.state.pagination}
        order={this.state.order}
        orderBy={this.state.orderBy}
        alert={this.state.alert}
        closeAlert={this.closeAlert}
        handleRiskSwitch={this.handleRiskSwitch}
        loadingRiskMatrix={this.state.loadingRiskMatrix}
        setSwitchState={this.setSwitchState}
        switched={this.state.switched}
        setLoading={this.setLoading}
      />
    );
  }
}

export default Reports;
