import React from "react";
import { withStyles } from "@material-ui/core/styles";
// import Email from "./email";
import { LoadingSpinner } from "../loading-spinner";
import TableActions from "../table-actions";
// import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
// import { Link } from "react-router-dom";
import moment from "moment";
import Table from "@material-ui/core/Table";
import { Row, Col } from "react-bootstrap";
import ReactSelectMUI from "../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";
import "./style.activity.css";

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
    padding: "20px",
    textAlign: "center"
  },
  addContactButton: {
    textAlign: "right"
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
  avatar: {
    height: 60,
    width: 60
  }
});

// function Detail(props) {
//   switch (props.type) {
//     case "email":
//       return <Email {...props} />;
//     default:
//       return null;
//   }
// }

export default withStyles(styles)(props => {
  let state = {};
  const {
    activities,
    classes,
    loading,
    getActivities,
    getSignedAttachment,
    filters
  } = props;
  const { count } = activities || {};
  const { items, typeOptions } = activities || {};
  const { pagination, handleChangePage, handleChangeRowsPerPage } = props;
  // const { orderBy, order } = props;

  if (loading) {
    return <LoadingSpinner />;
  }
  const tableConfig = [
    { filter: "title", label: "File" },
    { filter: "date", label: "Date" },
    { filter: "type", label: "Type", options: typeOptions },
    { filter: "contractMetric", label: "Metric" },
    { filter: "agreedTarget", label: "Agreed Target" },
    { filter: "targetIsMinOrMax", label: "Target Type" },
    { filter: "value", label: "Value" },
    {
      filter: "pass",
      label: "Pass",
      options: [{ label: "Yes", value: true }, { label: "No", value: false }]
    }
  ];
  const renderSelect = (name, label, options) => (
    <ReactSelectMUI
      value={
        filters[name]
          ? options.find(item => item.value === filters[name][0])
          : ""
      }
      label={label}
      onChange={selection => {
        getActivities({
          filters: {
            [name]: [selection.value]
          }
        });
      }}
      placeHolder={label}
      width={200}
      name={name}
      onBlur={() => {
        if (state[name]) {
          getActivities({
            filters: {
              [name]: [state[name].value]
            }
          });
        }
      }}
      options={[{ label: "reset", value: "" }, ...(options || [])]}
    />
  );
  const tableHead = (
    <TableHead>
      <TableRow>
        {tableConfig.map(({ label, filter, options }, index) => (
          <TableCell key={index} className={classes.head}>
            {/* <TableSortLabel
              active={orderBy === filter}
              direction={order[filter] || "asc"}
              onClick={() =>
                handleChangePage(this.props.pagination.page, filter, order)
              }
            >
            </TableSortLabel> */}
            {[2, 7].includes(index)
              ? renderSelect(filter, label, options)
              : label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const tableBody = (
    <TableBody>
      {(items || []).map(item => {
        const {
          id,
          title,
          date,
          type,
          contractMetric,
          agreedTarget,
          targetIsMinOrMax,
          value,
          pass
        } = item;
        const prettyTitle = title.split("/")[2];
        return (
          <TableRow key={id}>
            <TableCell className={classes.cell}>
              <span
                className="spanlikealink"
                onClick={() => getSignedAttachment(prettyTitle)}
              >
                {prettyTitle}
              </span>
            </TableCell>
            <TableCell className={classes.date}>
              {date ? moment(date).format("DD-MM-YYYY") : "N/A"}
            </TableCell>
            <TableCell className={classes.cell}>{type}</TableCell>
            <TableCell className={classes.cell}>{contractMetric}</TableCell>
            <TableCell className={classes.cell}>{agreedTarget}</TableCell>
            <TableCell className={classes.cell}>{targetIsMinOrMax}</TableCell>
            <TableCell className={classes.cell}>{value}</TableCell>
            <TableCell className={classes.cell}>
              {pass ? "Yes" : "No"}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );

  return (
    <div className={classes.paper}>
      <Row>
        <Col>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              {tableHead}
              {tableBody}
            </Table>
          </div>
        </Col>
      </Row>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={count || 0}
        rowsPerPage={pagination.rowsPerPage || 10}
        page={pagination.page || 0}
        onChangePage={(_, page) => handleChangePage({ page })}
        onChangeRowsPerPage={({ target: { value } }) =>
          handleChangeRowsPerPage({ rowsPerPage: value, filters })
        }
        ActionsComponent={TableActions}
      />
    </div>
  );
});
