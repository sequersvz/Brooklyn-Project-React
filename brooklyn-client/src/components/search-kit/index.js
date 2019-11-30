import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faLessThan,
  faGreaterThan
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { API } from "aws-amplify";
import { connect } from "react-redux";
import { setQueryFilters } from "../../actions/queryFilters";
import { orderAlphabetically } from "../../actions/utils/sortByKey";
import { makeCancelable, parseSelectedFilters } from "../../Utils";
import {
  globalFilters,
  reportsFilters,
  globalSetFilters,
  reportsFiltersActionLog
} from "./filters";
import SearchKitPanel from "./SearchKitPanel";
import SearchKitPanelOption from "./SearchKitPanelOption";
import { getSearchKitData } from "../../containers/service/account";

let lastVendorRequest = undefined;
let lastCheckpointRequest;
class Searchkit extends Component {
  state = {
    isCollapsed: false,
    isLoadingVendors: false,
    vendorsTimeout: null,
    loadingCategories: false,
    checkpointsTimeout: null,
    isLoadingCheckpoints: false,
    globalFilters: [],
    reportsFilters: [],
    globalSetFilters: []
  };
  isWdihtdt =
    this.props.location.pathname === "/assurance/what-do-i-have-to-do-today";
  isAssurance = this.props.location.pathname === "/assurance";
  isHome = this.props.location.pathname === "/home";
  isVendorProfile = this.props.location.pathname === "/vendor";
  isReports = this.props.location.pathname === "/report";

  componentDidMount() {
    this.setFiltersOnLoad();
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.user.id !== this.props.user.id && this.isWdihtdt) ||
      prevProps.reportActionLogTab !== this.props.reportActionLogTab
    ) {
      this.setFiltersOnLoad();
    }
  }

  setFiltersOnLoad = () => {
    let filters = this.getStoredFilters();
    if ((this.props.location.state || {}).fromStakeholder) {
      const vendor = this.props.location.state.vendor;
      const group = this.props.location.state.group;
      filters.vendorId = [vendor];
      if ((group || {}).value) {
        filters.groupId = [group];
      }
    }
    let selectedGlobalFilters = this.getSelectedFiltersFromArray(
      globalFilters,
      filters
    );
    if (this.isVendorProfile || this.isHome) {
      selectedGlobalFilters = selectedGlobalFilters.slice(0, 7);
    }
    const selectedReportsFilters = this.getSelectedFiltersFromArray(
      reportsFilters,
      filters
    );
    const selectedGlobalSetFilters = this.getSelectedFiltersFromArray(
      globalSetFilters,
      filters
    );
    selectedGlobalFilters = this.setDefaultManager(selectedGlobalFilters);

    if (this.props.reportActionLogTab) {
      selectedGlobalFilters = selectedGlobalFilters.concat(
        reportsFiltersActionLog
      );
    }
    this.setState(
      prevState => ({
        ...prevState,
        globalFilters: selectedGlobalFilters,
        reportsFilters: selectedReportsFilters,
        globalSetFilters: selectedGlobalSetFilters
      }),
      () => {
        // make API calls once the filters are set
        this.onloadPage();
      }
    );
  };

  onloadPage = async () => {
    const data = await getSearchKitData();
    this.getUsersOnsusccess(data.owners);
    this.getUsersVendorManagersOnsusccess(data.managers);
    this.getUsersGroupsOnsusccess(data.groups);
    this.loadCategoriesOnSuccess(data.categories);
    this.getBusinessunitssOnsusccess(data.businessunits);
    this.processFilters();
  };

  getStoredFilters = () => {
    const filters = JSON.parse(
      localStorage.getItem(`filters-${this.props.user.username}`)
    );
    return filters || {};
  };

  // merges default empty filters with selected filters from storage
  getSelectedFiltersFromArray = (array, filters) =>
    array.slice().map(filter => ({
      ...filter,
      ...(filter.type === "select" &&
        filter.isRemote && { options: filters[filter.name] || [] }),
      selected: filters[filter.name] || [],
      open: (filters[filter.name] || []).length > 0
    }));

  setDefaultManager = filters => {
    const manager = {
      value: this.props.user.id,
      label: this.props.user.attributes["name"],
      wdihtdt: true
    };

    return filters.map(filter => {
      if (filter.name === "manager") {
        const managerExists = filter.selected.find(
          ({ value }) => value === manager.value
        );
        if (!managerExists && this.props.user.id && this.isWdihtdt) {
          const selected = filter.selected.concat(manager);
          filter.selected = selected;
          filter.open = true;
        } else if (!this.isWdihtdt) {
          filter.selected = filter.selected
            .slice()
            .filter(({ wdihtdt }) => !wdihtdt);
          filter.open = filter.selected.length > 0;
        }
      }
      return filter;
    });
  };
  getAllWithFilters = (filters = {}) => this.props.getAllWithFilters(filters);

  loadCategoriesOnSuccess = result => {
    const categories = result
      .filter(({ enabled }) => enabled)
      .map(category => ({
        label: category.name,
        value: category.id
      }))
      .sort((category1, category2) =>
        orderAlphabetically(category1.label, category2.label)
      );
    this.handleLoadFilterOptions({
      filters: "reportsFilters",
      name: "category",
      options: categories
    });
  };

  // returns an object with the selected filters
  getSelectedFilters = filters => {
    return filters.reduce(
      (acc, currentFilter) =>
        currentFilter.selected.length > 0
          ? { ...acc, [currentFilter.name]: currentFilter.selected }
          : acc,
      {}
    );
  };

  // NOTE: to be used in the setState callback
  processFilters = () => {
    // selected filters in the form of { [filter]: [{label, value}] }
    let selectedFilters = this.getSelectedFilters([
      ...this.state.globalFilters.slice(),
      ...this.state.reportsFilters.slice(),
      ...this.state.globalSetFilters.slice()
    ]);

    // parsed filters in the form of { [filter]: [value, value, value] }
    const parsedSelectedFilters = parseSelectedFilters(selectedFilters);

    this.props.setQueryFilters({
      user: this.props.user.username,
      ...selectedFilters
    });
    this.getAllWithFilters(parsedSelectedFilters);
  };

  handleOnClick = () => {
    this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }));
  };

  getVendors = name => {
    this.setState({ isLoadingVendors: true }, async () => {
      try {
        if (lastVendorRequest) {
          lastVendorRequest.cancel();
        }
        name = name ? `?name=${name}` : "";
        const request = API.get(
          "UsersAPI",
          `/accounts/${
            this.props.user.attributes["custom:accountId"]
          }/vendors${name}`,
          {}
        );

        const cancellableRequest = makeCancelable(request);
        lastVendorRequest = cancellableRequest;

        let vendors = await cancellableRequest.promise;
        const vendorsOptions = vendors.map(vendor => ({
          label: vendor.name,
          value: vendor.id
        }));

        this.handleLoadFilterOptions({
          filters: "globalFilters",
          name: "vendorId",
          options: vendorsOptions,
          otherProps: { isLoadingVendors: false }
        });
      } catch (error) {
        console.log(error);
        if (!(error || {}).isCanceled) {
          this.setState({ isLoadingVendors: false });
        }
      }
    });
  };

  handleInputChange = ({ input, name, callback }) => {
    const debounceTimeout = this.state[`${input}Timeout`];
    name = name.trim();
    if (name.length > 0) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      const timeout = setTimeout(() => {
        this.setState({ [`${input}Timeout`]: null }, () => callback(name));
      }, 300);
      this.setState({ [`${input}Timeout`]: timeout });
    }
  };

  getUsersOnsusccess = result => {
    result = (result || []).sort((user1, user2) =>
      orderAlphabetically(user1.name, user2.name)
    );

    const owners = (result || []).map(manager => ({
      label: `${manager.name} 
              ${
                manager.organisation !== null
                  ? "- " + manager.organisation
                  : manager.vendor !== null
                    ? "- " + manager.vendor.name
                    : ""
              }`,
      value: manager.id
    }));

    this.handleLoadFilterOptions({
      filters: "globalFilters",
      name: "ownerId",
      options: owners
    });
  };

  getUsersVendorManagersOnsusccess = result => {
    result = (result || []).sort((user1, user2) =>
      orderAlphabetically(user1.name, user2.name)
    );
    let managers = (result || []).map(manager => ({
      label: manager.name,
      value: manager.id
    }));
    managers.push({ label: "No manager", value: "null" });

    this.handleLoadFilterOptions({
      filters: "globalFilters",
      name: "manager",
      options: managers
    });
  };

  getUsersGroupsOnsusccess = result => {
    const groupOptions = result.map(({ id, name }) => ({
      label: name,
      value: id
    }));
    this.handleLoadFilterOptions({
      filters: "globalFilters",
      name: "groupId",
      options: groupOptions
    });
  };

  getBusinessunitssOnsusccess = businessunits => {
    const businessUnitOptions = businessunits.slice().map(bu => ({
      label: bu.name,
      value: bu.id
    }));
    this.handleLoadFilterOptions({
      filters: "globalFilters",
      name: "businessunit",
      options: businessUnitOptions
    });
  };

  getCheckpoints = name => {
    this.setState({ isLoadingCheckpoints: true }, async () => {
      try {
        if (lastCheckpointRequest) {
          lastCheckpointRequest.cancel();
        }
        name = name ? `?name=${name}` : "";
        const request = API.get("UsersAPI", `/checkpoints/all${name}`, {});

        const cancellableRequest = makeCancelable(request);
        lastCheckpointRequest = cancellableRequest;

        let checkpoints = await cancellableRequest.promise;
        checkpoints = checkpoints.slice().map(checkpoint => ({
          label: checkpoint.name,
          value: checkpoint.id
        }));

        this.handleLoadFilterOptions({
          filters: "reportsFilters",
          name: "checkpoint",
          options: checkpoints,
          otherProps: { isLoadingCheckpoints: false }
        });
      } catch (error) {
        console.log(error);
        if (!(error || {}).isCanceled) {
          this.setState({ isLoadingCheckpoints: false });
        }
      }
    });
  };

  // filters array is one of: globalFilters, reportsFilters, globalSetFilters
  handlePanelState = ({ filtersArray, optionId }) => {
    this.setState(prevState => ({
      ...prevState,
      [filtersArray]: prevState[filtersArray].map(item => {
        if (item.name === optionId) {
          item.open = !item.open;
        }
        return item;
      })
    }));
  };

  handleSelectOption = ({ type, filtersArray, optionId, option }) => {
    let selected = [];
    if (type === "checkbox") {
      const [stateFilter] = this.state[filtersArray].filter(
        ({ name }) => name === optionId
      );

      const optionIsChecked = stateFilter.selected.find(
        ({ label }) => label === option.label
      );
      if (optionIsChecked) {
        selected = stateFilter.selected.filter(
          ({ label }) => label !== option.label
        );
      } else {
        selected = stateFilter.selected.concat(option);
      }
    } else if (type === "select") {
      const action = option.action.action;

      if (action === "select-option") {
        // when the react-select option isMulti=false the selected option is an object
        selected = Array.isArray(option.optionsSelected)
          ? option.optionsSelected
          : [option.optionsSelected];
      } else if (action === "remove-value") {
        selected = option.optionsSelected.slice();
      }
      // clear action is handled by default
    }
    this.setState(
      prevState => ({
        ...prevState,
        [filtersArray]: prevState[filtersArray].map(item => {
          if (item.name === optionId) {
            item.selected = selected;
          }
          return item;
        })
      }),
      () => this.processFilters()
    );
  };

  handleLoadFilterOptions = ({ filters, name, options, otherProps }) => {
    this.setState(prevState => ({
      ...prevState,
      ...(otherProps && { ...otherProps }),
      [filters]: prevState[filters].map(filter => {
        if (filter.name === name) {
          filter.options = options;
        }
        return filter;
      })
    }));
  };

  render() {
    const { reports, landscapeReport } = this.props;
    const { globalFilters, reportsFilters, globalSetFilters } = this.state;
    let { isLoadingVendors, isCollapsed } = this.state;
    return (
      <React.Fragment>
        <div className={`filterbar slide${isCollapsed ? "Out" : "In"}`}>
          <span>
            <div style={{ fontSize: "14px" }}>
              <FontAwesomeIcon
                {...(isCollapsed ? { "data-tip": "Filters" } : null)}
                style={{ marginRight: 5 }}
                icon={faFilter}
                color="#555555"
              />
              {isCollapsed ? <ReactTooltip /> : "Filters"}
              <FontAwesomeIcon
                className="hidden-md hidden-lg hidden-sm fa-rotate-90"
                style={{ marginTop: 5, cursor: "pointer" }}
                icon={isCollapsed ? faGreaterThan : faLessThan}
                pull="right"
                color="#555555"
                onClick={this.handleOnClick}
              />
              <FontAwesomeIcon
                className="hidden-xs"
                style={{ marginTop: 5, cursor: "pointer" }}
                icon={isCollapsed ? faGreaterThan : faLessThan}
                pull="right"
                color="#555555"
                onClick={this.handleOnClick}
              />
            </div>
          </span>
          <hr className="hrFilters" />
          <SearchKitPanel collapsed={isCollapsed}>
            {globalFilters.map((panelOption, index) => (
              <SearchKitPanelOption
                key={`${panelOption.label}_${index}`}
                {...panelOption}
                handlePanelState={() =>
                  this.handlePanelState({
                    filtersArray: "globalFilters",
                    optionId: panelOption.name
                  })
                }
                handleSelectOption={option =>
                  this.handleSelectOption({
                    filtersArray: "globalFilters",
                    optionId: panelOption.name,
                    type: panelOption.type,
                    option
                  })
                }
                selectProps={{
                  closeMenuOnSelect: false,
                  isMulti: true,
                  onInputChange: name => {
                    if (panelOption.name === "vendorId") {
                      this.handleInputChange({
                        name,
                        input: "vendors",
                        callback: this.getVendors
                      });
                    }
                  },
                  isLoading: panelOption.name === "vendorId" && isLoadingVendors
                }}
              />
            ))}
          </SearchKitPanel>
          {/* REPORTS FILTERS */}
          {reports && (
            <React.Fragment>
              <SearchKitPanel collapsed={isCollapsed}>
                {reportsFilters.map(
                  (filter, index) =>
                    !landscapeReport && filter.label === "Aspect" ? null : (
                      <SearchKitPanelOption
                        key={`${filter.label}_${index}`}
                        {...filter}
                        handlePanelState={() =>
                          this.handlePanelState({
                            filtersArray: "reportsFilters",
                            optionId: filter.name
                          })
                        }
                        handleSelectOption={option =>
                          this.handleSelectOption({
                            filtersArray: "reportsFilters",
                            optionId: filter.name,
                            type: filter.type,
                            option
                          })
                        }
                        selectProps={{
                          closeMenuOnSelect: filter.label === "Aspect",
                          isMulti: filter.label !== "Aspect",
                          onInputChange: name => {
                            if (filter.name === "checkpoint") {
                              this.handleInputChange({
                                name,
                                input: "checkpoints",
                                callback: this.getCheckpoints
                              });
                            }
                          },
                          isLoading:
                            (filter.name === "category" &&
                              this.state.loadingCategories) ||
                            (filter.name === "checkpoint" &&
                              this.state.isLoadingCheckpoints)
                        }}
                      />
                    )
                )}
              </SearchKitPanel>
              <SearchKitPanel collapsed={isCollapsed}>
                {globalSetFilters.map((filter, index) => (
                  <SearchKitPanelOption
                    key={`${filter.label}_${index}`}
                    {...filter}
                    handlePanelState={() =>
                      this.handlePanelState({
                        filtersArray: "globalSetFilters",
                        optionId: filter.name
                      })
                    }
                    handleSelectOption={option =>
                      this.handleSelectOption({
                        filtersArray: "globalSetFilters",
                        optionId: filter.name,
                        type: filter.type,
                        option
                      })
                    }
                  />
                ))}
              </SearchKitPanel>
            </React.Fragment>
          )}
        </div>
        <div
          id="transition-div"
          style={{
            transition: "all 450ms ease-in"
          }}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}
// con esta function se inserta las variables a los prod del componente instanciado
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
//con esta function se sirven las functions para ejecutar en el container, al ejecutar estas functions la function anterior
//inserta los resultados en las props
const mapDispatchToProps = dispatch => {
  return {
    setQueryFilters: filters => {
      dispatch(setQueryFilters(filters));
    }
  };
};

//se validan las propiedades del componente
Searchkit.propTypes = {
  user: PropTypes.object.isRequired
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Searchkit)
);
