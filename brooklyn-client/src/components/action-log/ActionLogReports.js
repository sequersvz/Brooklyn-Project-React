import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";
import TableActions from "../table-actions";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Grid from "@material-ui/core/Grid";
import { downloadActionLogCsv } from "../../containers/service/itemreview";
import ReactTooltip from "react-tooltip";

const styles = () => ({
  head: {
    fontSize: "1.35rem"
  },
  cell: {
    fontSize: "1.25rem"
  },
  date: {
    fontSize: "1.25rem",
    minWidth: 150
  },
  paper: {
    padding: "20px"
  },
  tableTitle: {
    paddingTop: "4px"
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    overflowY: "auto"
  },
  table: {
    width: 1200
  },
  downloadGrid: {
    padding: "0px 32px"
  }
});

function ActionLogReports(props) {
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const { classes, items, count, pagination, filters } = props;
  const { handleChangePage, handleChangeRowsPerPage } = props;
  const { orderBy, order } = props;
  const actionLogItems = Array.isArray(items) ? items : [];
  const tableConfig = [
    { filter: "vendorName", label: "Vendor" },
    { filter: "title", label: "Title" },
    { filter: "dueDate", label: "Due Date" },
    { filter: "closed", label: "Status" },
    { filter: "daysPastDue", label: "Days Past Due" },
    { filter: "owner", label: "Owner" },
    { filter: "groupId", label: "Group" }
  ];
  const tableHead = (
    <TableHead>
      <TableRow>
        {tableConfig.map(({ label, filter }, index) => (
          <TableCell key={index} className={classes.head}>
            <TableSortLabel
              active={orderBy === filter}
              direction={order[filter] || "asc"}
              onClick={() =>
                handleChangePage({
                  page: props.pagination.page,
                  sort: filter,
                  order,
                  filters,
                  chart: "action-log"
                })
              }
            >
              {label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const tableBody = (
    <TableBody>
      {(actionLogItems || []).map(item => (
        <TableRow key={item.id}>
          <TableCell className={classes.cell}>{item.vendorName}</TableCell>
          <TableCell className={classes.cell}>
            <Link
              to={`/assurance/review/${item.reviewId}?categoryId=${
                item.categoryId
              }&checkpointId=${item.checkpointId}`}
            >
              {item.title}
            </Link>
          </TableCell>
          <TableCell className={classes.date}>
            {item.dueDate ? moment(item.dueDate).format("DD-MM-YYYY") : "N/A"}
          </TableCell>
          <TableCell className={classes.cell}>
            {item.closed ? "Closed" : "Open"}
          </TableCell>
          <TableCell className={classes.cell}>
            {item.daysPastDue || "N/A"}
          </TableCell>
          <TableCell className={classes.cell}>
            {(item.owner || {}).name || "N/A"}
          </TableCell>
          <TableCell className={classes.cell}>{item.group || "N/A"}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  const handleOnDownloadCsv = async () => {
    if (downloadingCSV) return;
    try {
      setDownloadingCSV(true);
      await downloadActionLogCsv();
      setDownloadingCSV(false);
    } catch (error) {
      console.log(error);
      setDownloadingCSV(false);
    }
  };

  const onChangePage = (_, page) =>
    handleChangePage({ page, chart: "action-log", filters });

  const onChangeRowsPerPage = ({ target: { value } }) =>
    handleChangeRowsPerPage({
      rowsPerPage: value,
      chart: "action-log",
      filters
    });

  return (
    <div className={classes.paper}>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6} className={classes.downloadGrid}>
          <FontAwesomeIcon
            icon={faDownload}
            size="2x"
            style={{ float: "right", cursor: "pointer" }}
            onClick={handleOnDownloadCsv}
            data-tip="Download CSV"
          />
          <ReactTooltip />
        </Grid>
      </Grid>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          {tableHead}
          {tableBody}
        </Table>
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={count}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        ActionsComponent={TableActions}
      />
    </div>
  );
}
export default withStyles(styles)(React.memo(ActionLogReports));
