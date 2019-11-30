import React from "react";
import RiskLogReports from "../../components/risks/RiskLogReports";
import { getVendorsReports } from "../service/vendors";
import { editRisk, addRisk } from "../service/risk";
import { makeCancelable } from "../../Utils";
import EditRisk from "../../components/risks/EditRisk";
import Alert from "../../components/snackbar-alert";
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

class Risks extends React.Component {
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
    editingRisk: false,
    risk: null,
    savingRisk: false,
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    }
  };

  getReports = ({
    chart = "risk-log",
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

  handleAddRisk = async () => {
    const { filters, pagination, order, orderBy } = this.state;
    const { rowsPerPage, page } = pagination;
    const sort = orderBy;
    const desc =
      (order || {})[sort] === "desc" ? (order || {})[sort] : undefined;
    const query = {
      limit: rowsPerPage,
      ...(page > 0 && { offset: page * rowsPerPage }),
      ...(sort && { sort }),
      ...(desc && { desc })
    };
    try {
      await addRisk({ title: "", description: "" });
      await this.getReports({ chart: "risk-log", filters, query });
      this.openAlert({ message: "Risk created" });
    } catch (error) {
      this.openAlert({
        message: "Could not create the risk",
        variant: "error"
      });
    }
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

  handleClickEditRisk = ({ risk, edit }) => {
    this.setState(prevState => ({
      ...prevState,
      editingRisk: edit,
      risk
    }));
  };

  handleSaveRisk = ({ setSubmitting, ...data }) => {
    try {
      this.setState(
        prevState => ({
          ...prevState,
          savingRisk: true
        }),
        async () => {
          const {
            owner,
            status,
            label,
            treatment,
            lifecycle,
            toprisks,
            riskImpact,
            riskProbability,
            residualRiskImpact,
            residualRiskProbability,
            ...risk
          } = data;
          await editRisk(risk);
          setSubmitting(false);
          const { filters } = this.state;
          await this.getReports({ chart: "risk-log", filters });
          this.setState(
            prevState => ({
              ...prevState,
              savingRisk: false,
              editingRisk: false,
              risk: {},
              reports: prevState.reports
                .map(item => {
                  if (item.id === data.id) {
                    return {
                      ...item,
                      ...data,
                      ...(owner && { owner }),
                      ...(status && { status }),
                      ...(label && { label }),
                      ...(treatment && { treatment }),
                      ...(lifecycle && { lifecycle }),
                      ...(toprisks && { toprisks }),
                      ...(riskImpact && { riskImpact }),
                      ...(riskProbability && { riskProbability }),
                      ...(residualRiskImpact && { residualRiskImpact }),
                      ...(residualRiskProbability && {
                        residualRiskProbability
                      })
                    };
                  }
                  return item;
                })
                .sort(
                  (a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0)
                )
            }),
            () => {
              this.openAlert({ message: "Risk saved" });
            }
          );
        }
      );
    } catch (error) {
      console.log(error);
      this.setState(prevState => ({ ...prevState, savingRisk: false }));
      this.openAlert({ message: "Could not save the risk", variant: "error" });
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

  concatRiskFiles = ({ id, files }) => {
    this.setState(prevState => ({
      ...prevState,
      reports: prevState.reports.map(report => {
        if (report.id === id) {
          report.files = report.files.concat(files);
        }
        return report;
      })
    }));
  };

  filterRiskFile = ({ riskId, fileId }) => {
    this.setState(prevState => ({
      ...prevState,
      reports: prevState.reports.map(report => {
        if (report.id === riskId) {
          report.files = report.files.filter(file => file.id !== fileId);
        }
        return report;
      })
    }));
  };

  render() {
    const {
      risk,
      alert,
      count,
      order,
      loading,
      reports,
      orderBy,
      filters,
      savingRisk,
      pagination,
      editingRisk
    } = this.state;
    const { classes } = this.props;
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
            this.getReports({ chart: "risk-log", filters });
          }}
        >
          <div className="row">
            <div className="col-md-12">
              <div className={classes.root}>
                {loading && <LoadingSpinner />}
                {!loading && (
                  <div style={{ marginTop: "15px" }}>
                    <>
                      {editingRisk ? (
                        <EditRisk
                          risk={risk}
                          save={this.handleSaveRisk}
                          edit={this.handleClickEditRisk}
                          saving={savingRisk}
                          concatRiskFiles={this.concatRiskFiles}
                          filterRiskFile={this.filterRiskFile}
                        />
                      ) : (
                        <RiskLogReports
                          items={reports}
                          count={count}
                          handleChangePage={this.handleChangePage}
                          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                          handleAddRisk={this.handleAddRisk}
                          filters={filters}
                          pagination={pagination}
                          order={order}
                          orderBy={orderBy}
                          handleClickEditRisk={this.handleClickEditRisk}
                        />
                      )}

                      <Alert
                        open={alert.open}
                        message={alert.message}
                        duration={alert.duration}
                        variant={alert.variant}
                        handleClose={this.closeAlert}
                      />
                    </>
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

export default withRouter(withStyles(styles)(Risks));
