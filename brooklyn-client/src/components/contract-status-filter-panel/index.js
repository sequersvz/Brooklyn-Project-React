import React from "react";
import { connect } from "react-redux";
import { Popover } from "react-bootstrap";
import {
  selectContractStatus,
  deselectContractStatus,
  clearStatusFilters
} from "../../actions/contractStatus";
import "./popover.css";
import ContractStatusSelect from "./contract-status-select";

class ContractStatusFilterPanel extends React.Component {
  handleSelectStatus = statusId => {
    this.props.selectStatus(statusId);
  };

  handleDeselectStatus = statusId => {
    this.props.deselectStatus(statusId);
  };

  handleClearFilters = () => {
    this.props.clearStatusFilters();
  };

  handleOnChange = (_, { action, option = {}, removedValue = {} }) => {
    switch (action) {
      case "select-option":
        this.handleSelectStatus(option.value);
        break;
      case "remove-value":
        this.handleDeselectStatus(removedValue.value);
        break;
      case "clear":
        this.handleClearFilters();
        break;
      default:
        return;
    }
  };
  render() {
    const { selectedStatuses, statuses, ...popoverProps } = this.props;
    const selectedStatus = selectedStatuses.map(status => ({
      value: status.id,
      label: status.name
    }));
    const statusOptions = statuses.map(status => ({
      value: status.id,
      label: status.name
    }));

    return (
      <Popover
        {...popoverProps}
        positionTop={popoverProps.top ? popoverProps.top : 0}
        id="contract-status-filter-panel"
        title="Filter by status"
        style={{
          ...this.props.style,
          backgroundColor: "#fff",
          width: "250px",
          overflow: "visible"
        }}
      >
        <ContractStatusSelect
          selectedStatus={selectedStatus}
          options={statusOptions}
          onChange={this.handleOnChange}
        />
      </Popover>
    );
  }
}

const mapStateToProps = state => {
  return {
    statuses: state.contractStatus.statuses,
    selectedStatuses: state.contractStatus.selectedStatuses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectStatus: statusId => {
      dispatch(selectContractStatus(statusId));
    },
    deselectStatus: statusId => {
      dispatch(deselectContractStatus(statusId));
    },
    clearStatusFilters: () => {
      dispatch(clearStatusFilters());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractStatusFilterPanel);
