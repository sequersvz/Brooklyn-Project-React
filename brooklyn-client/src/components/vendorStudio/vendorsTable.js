import React from "react";
import "./vendorStudio.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSearch,
  faRedo,
  faAngleDoubleUp
} from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { LoadingSpinner } from "../loading-spinner";
import TableActions from "../table-actions";

const styles = () => ({
  root: {
    width: "100%",
    overflowX: "auto",
    marginBottom: "30px"
  },
  headCell: {
    fontSize: "1.25rem"
  },
  cell: {
    fontSize: "1.3125rem"
  }
});

const iconStyle = {
  color: "#683364",
  cursor: "pointer"
};

const getTier = vendor => vendor.profile[0].tierId;
const getNextReviewDate = vendor =>
  vendor.nextReview
    ? Moment(vendor.nextReview.date).format("DD-MM-YYYY")
    : "none";
const deleteButton = ({ onClickDelete, vendor }) => (
  <FontAwesomeIcon
    icon={faTrash}
    style={iconStyle}
    onClick={() => onClickDelete(vendor)}
  />
);

class VendorsTable extends React.Component {
  state = {
    sizePerPage: 50,
    name: null,
    page: 0
  };

  componentDidUpdate(prevProps) {
    // navigate to first page when totalSize changes (search / filter is applied)
    if (this.props.totalSize !== prevProps.totalSize && this.state.page !== 0) {
      this.setState({ page: 0 });
    }
  }

  onChangeSizePerPage = ({ target: { value } }) => {
    const { name } = this.state;
    this.setState(
      {
        sizePerPage: value,
        page: 0
      },
      () => {
        this.props.getVendors(null, { limit: value, ...(name && { name }) });
      }
    );
  };
  onChangePage = (_, page) => {
    const { name, sizePerPage } = this.state;
    const offset = page * sizePerPage;
    this.setState({ page }, () => {
      this.props.getVendors(null, {
        changePage: true,
        limit: sizePerPage,
        ...(offset && { offset }),
        ...(name && { name })
      });
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  onSearch = name => {
    this.setState({ name, page: 0 }, () => {
      this.props.getVendors(null, {
        limit: this.state.sizePerPage,
        name,
        reset: name === ""
      });
    });
  };

  render() {
    const { vendors, onClickDelete, loading, totalSize, classes } = this.props;
    const { sizePerPage, page } = this.state;
    const isEmpty = vendors.length === 0;

    const vendorsTableHead = (
      <TableHead>
        <TableRow>
          <TableCell className={classes.headCell}>Name</TableCell>
          <TableCell className={classes.headCell} align="center">
            Tier
          </TableCell>
          <TableCell
            className={classes.headCell}
            align="center"
            padding="dense"
          >
            Next Review
          </TableCell>
          <TableCell className={classes.headCell} align="center">
            Delete
          </TableCell>
          <TableCell className={classes.headCell} align="center">
            Journey
          </TableCell>
        </TableRow>
      </TableHead>
    );

    const vendorsTableBody = vendors.map((vendor, index) => (
      <TableRow key={index}>
        <TableCell className={classes.headCell}>
          <Link
            to={`/vendor/${vendor.id}/tier`}
            style={{ color: "rgba(0, 0, 0, 0.87)" }}
          >
            {vendor.name}
          </Link>
        </TableCell>
        <TableCell className={classes.cell} align="center">
          <Link
            to={`/vendor/${vendor.id}/tier`}
            style={{ color: "rgba(0, 0, 0, 0.87)" }}
          >
            {getTier(vendor)}
          </Link>
        </TableCell>
        <TableCell className={classes.cell} align="center" padding="dense">
          {getNextReviewDate(vendor)}
        </TableCell>
        <TableCell className={classes.cell} align="center">
          {deleteButton({ onClickDelete, vendor })}
        </TableCell>
        <TableCell className={classes.cell} align="center">
          <Link to={`/vendor/${vendor.id}/journey`}>
            <FontAwesomeIcon icon={faAngleDoubleUp} style={iconStyle} />
          </Link>
        </TableCell>
      </TableRow>
    ));

    return (
      <Paper className={classes.root}>
        <Grid item xs={6}>
          <Formik
            initialValues={{
              name: ""
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .trim()
                .required("Type something to search")
            })}
            onSubmit={({ name }) => {
              this.onSearch(name);
            }}
            render={props => {
              return (
                <form onSubmit={props.handleSubmit}>
                  <div className="boxSearch">
                    <TextField
                      error={
                        props.touched.name && props.errors.name ? true : false
                      }
                      id="standard-error"
                      label={
                        props.touched.name && props.errors.name
                          ? props.errors.name
                          : ""
                      }
                      margin="normal"
                      name="name"
                      value={props.values.name}
                      placeholder="Search vendor..."
                      onChange={props.handleChange}
                      disabled={loading}
                      fullWidth
                      inputProps={{
                        style: {
                          fontSize: "1.35rem"
                        }
                      }}
                    />
                    <FontAwesomeIcon
                      className="iconSearch"
                      icon={faSearch}
                      disabled={loading}
                      onClick={props.handleSubmit}
                    />
                    <div className="boxReset">
                      <Button
                        color="primary"
                        type="button"
                        onClick={() => {
                          props.resetForm();
                          this.onSearch("");
                        }}
                        disabled={loading}
                      >
                        Reset{" "}
                        <FontAwesomeIcon icon={faRedo} className="iconReset" />
                      </Button>
                    </div>
                  </div>
                </form>
              );
            }}
          />
        </Grid>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Table>
            {vendorsTableHead}
            <TableBody>{vendorsTableBody}</TableBody>
          </Table>
        )}
        {!loading && isEmpty ? (
          <div style={{ height: "200px", textAlign: "center" }}>
            <p style={{ paddingTop: "75px" }}>No data to display</p>
          </div>
        ) : null}
        {!loading && !isEmpty ? (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalSize}
            rowsPerPage={sizePerPage}
            page={page}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeSizePerPage}
            ActionsComponent={TableActions}
          />
        ) : null}
      </Paper>
    );
  }
}

export default withStyles(styles)(VendorsTable);

VendorsTable.propTypes = {
  vendors: PropTypes.array.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  getVendors: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

VendorsTable.defaultProps = {
  vendors: [],
  loading: false
};
