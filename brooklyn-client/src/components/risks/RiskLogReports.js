import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core";
import TableActions from "../table-actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faDownload } from "@fortawesome/free-solid-svg-icons";
import Grid from "@material-ui/core/Grid";
import { downloadRiskLogCsv } from "../../containers/service/risk";
import ReactTooltip from "react-tooltip";
import Typography from "@material-ui/core/Typography";

const styles = () => ({
  head: {
    fontSize: "1.35rem",
    textAlign: "center"
  },
  cell: {
    fontSize: "1.25rem",
    cursor: "default",
    textAlign: "center"
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
  edit: {
    textAlign: "center"
  },
  downloadGrid: {
    padding: "0px 32px"
  },
  downloadGridItem: {
    float: "right",
    cursor: "pointer",
    margin: "0px 20px"
  }
});

const iconStyle = {
  color: "#683364",
  cursor: "pointer"
};

function RiskLogReports(props) {
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const {
    classes,
    items,
    filters,
    count,
    pagination,
    handleAddRisk,
    handleChangePage,
    handleChangeRowsPerPage,
    handleClickEditRisk
  } = props;
  if (!Array.isArray(items)) {
    return null;
  }
  let hasItems = (items || []).length > 0;

  const tableConfig = [
    { filter: "vendor", label: "Vendor" },
    { filter: "title", label: "Title" },
    { filter: "rating", label: "Rating" },
    { filter: "residualRating", label: "Residual Rating" },
    { filter: "lifecycle", label: "Lifecycle" },
    { filter: "status", label: "Status" }
  ];

  const tableHead = (
    <TableHead>
      <TableRow>
        {tableConfig.map(({ label }, index) => (
          <TableCell key={index} className={classes.head}>
            {label}
          </TableCell>
        ))}
        <TableCell className={classes.edit}>Actions</TableCell>
      </TableRow>
    </TableHead>
  );

  const tableBody = (
    <TableBody>
      {(items || []).map(item => (
        <TableRow key={`risk_${item.id}`}>
          <TableCell>{item.vendorName}</TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell className={classes.cell}>{item.rating || "-"}</TableCell>
          <TableCell className={classes.cell}>
            {item.residualRating || "-"}
          </TableCell>
          <TableCell className={classes.cell}>
            {(item.lifecycle || {}).name || "-"}
          </TableCell>
          <TableCell className={classes.cell}>
            {(item.status || {}).name || "-"}
          </TableCell>
          <TableCell className={classes.edit}>
            <FontAwesomeIcon
              icon={faEdit}
              style={iconStyle}
              onClick={() => handleClickEditRisk({ risk: item, edit: true })}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <div className={classes.paper}>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6} className={classes.downloadGrid}>
          <Button
            variant="contained"
            className={classes.downloadGridItem}
            color="primary"
            onClick={handleAddRisk}
          >
            Add Risk
          </Button>
          {hasItems ? (
            <>
              <FontAwesomeIcon
                icon={faDownload}
                size="3x"
                className={classes.downloadGridItem}
                onClick={async () => {
                  if (!downloadingCSV) {
                    try {
                      setDownloadingCSV(true);
                      await downloadRiskLogCsv();
                      setDownloadingCSV(false);
                    } catch (error) {
                      console.log(error);
                      setDownloadingCSV(false);
                    }
                  }
                }}
                data-tip="Download CSV"
              />
              <ReactTooltip />
            </>
          ) : null}
        </Grid>
      </Grid>
      {!hasItems ? (
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
        <>
          <div className={classes.tableWrapper}>
            <Table>
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
            onChangePage={(_, page) =>
              handleChangePage({ page, chart: "risk-log", filters })
            }
            onChangeRowsPerPage={({ target: { value } }) =>
              handleChangeRowsPerPage({
                rowsPerPage: value,
                chart: "risk-log",
                filters
              })
            }
            ActionsComponent={TableActions}
          />
        </>
      )}
    </div>
  );
}

export default withStyles(styles)(React.memo(RiskLogReports));
