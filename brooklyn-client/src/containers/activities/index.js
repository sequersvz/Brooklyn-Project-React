import React from "react";
import { getAllBy } from "../service/root.service";
// import { makeCancelable } from "../../Utils";
import { getAttachments } from "../service/itemreview";
import { connect } from "react-redux";
import { setQueryFilters } from "../../actions/queryFilters";

let lasActRequest = false;

class vendorEmailContainer extends React.Component {
  state = {
    activities: [],
    loading: true,
    pagination: {
      rowsPerPage: 10,
      page: 0
    }
  };

  getStoredFilters = () => {
    const filters = JSON.parse(
      localStorage.getItem(`filters-${this.props.user.username}`)
    );
    return filters || {};
  };

  getActivitiesOnSuccess = filters => activities => {
    this.setState({
      activities,
      filters,
      loading: false
    });
  };
  getAllActivities = ({ filters, query }) =>
    getAllBy(`vendors/${this.props.vendorId}/activity`)(
      this.getActivitiesOnSuccess(filters)
    )({ filters, query });

  handleChangePage = ({ page, filters, sort }) => {
    const rows = this.state.pagination.rowsPerPage;

    this.setState(
      prevState => ({
        ...prevState,
        pagination: {
          ...prevState.pagination,
          page
        },
        ...(sort && { orderBy: sort })
        // ...(sort && {
        //   order: {
        //     [sort]:
        //       prevState["order"][sort] || {}
        //         ? prevState["order"][sort] === "desc"
        //           ? "asc"
        //           : "desc"
        //         : "asc"
        //   }
        // })
      }),
      () => {
        // const desc = this.state.order[sort] === "desc" ? "desc" : undefined;
        const query = {
          limit: rows,
          ...(page > 0 && { offset: page * rows })
          // ...(sort && { sort }),
          // ...(desc && { desc })
        };
        this.getActivities({ filters, query });
      }
    );
  };

  getSignedAttachment = async file => {
    const onError = e => console.log("Error", e);
    const onSuccess = result => window.open(result);
    await getAttachments(onSuccess, onError)(file);
  };

  resetfilter = (filters, filterInStorage) => {
    (Object.keys(filters || {}) || []).forEach(filter => {
      if (filters[filter][0] === "") {
        console.log(filter);
        delete filters[filter];
        delete filterInStorage[filter];
      }
    });
    return { ...filters, ...filterInStorage };
  };

  getActivities = ({ filters, query = {} } = {}) => {
    let filterInStorage = (this.getStoredFilters() || {}).activity;
    filters = this.resetfilter(filters, filterInStorage);
    this.setState({ loading: true }, async () => {
      if (lasActRequest) {
        lasActRequest.cancel();
      }
      if (Object.keys(query).length === 0) {
        const limit = this.state.pagination.rowsPerPage;
        query = { ...query, ...(limit && { limit }) };
      }
      this.props.setQueryFilters({
        user: this.props.user.username,
        activity: { ...filters }
      });
      this.getAllActivities({ filters, query });
      // const sort = this.state.orderBy;
      // const desc =
      //   (this.state.order || {})[sort] === "desc"
      //     ? (this.state.order || {})[sort]
      //     : undefined;
      // query = { ...query, ...(sort && { sort }), ...(desc && { desc }) };
      // const request = new Promise ((resolve,reject)=>{
      //   resolve();
      // });
    });
  };

  handleChangeRowsPerPage = ({ rowsPerPage, filters }) => {
    if (rowsPerPage !== this.state.pagination.rowsPerPage) {
      this.setState(
        prevState => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            rowsPerPage
          }
        }),
        () => this.getActivities({ filters })
      );
    }
  };
  componentDidMount() {
    this.getActivities();
  }

  render() {
    const { activities, loading, pagination, filters } = this.state;
    const { children } = this.props;
    return children({
      activities,
      loading,
      pagination,
      handleChangePage: this.handleChangePage,
      handleChangeRowsPerPage: this.handleChangeRowsPerPage,
      getActivities: this.getActivities,
      getSignedAttachment: this.getSignedAttachment,
      filters
    });
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setQueryFilters: filters => {
      dispatch(setQueryFilters(filters));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(vendorEmailContainer);
