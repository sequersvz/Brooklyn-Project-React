import React from "react";
import StakeholderNavigator from "../../components/stakeholder-navigator";
import {
  getVendorsNames,
  getVendorStakeholderInformation
} from "../service/vendors";
import { getLogo } from "../service";
import { getUserGroups } from "../service/user";
import { withRouter } from "react-router-dom";

class StakeholderNavigatorContainer extends React.Component {
  state = {
    vendors: [],
    vendor: null,
    selectedVendor: null,
    loadingVendors: true,
    loadingGroups: true,
    groups: [],
    selectedGroup: null,
    loading: true,
    loadingVendorInformation: false
  };
  componentDidMount() {
    this.getVendors();
    this.getGroups();
  }

  getVendors = () => {
    this.setState(
      prevState => ({ ...prevState, loadingVendors: true }),
      async () => {
        try {
          const result = await getVendorsNames();
          const vendors = result.map(vendor => ({
            label: vendor.name,
            value: vendor.id
          }));
          this.setState(prevState => ({
            ...prevState,
            vendors,
            loadingVendors: false,
            loading: prevState.loadingGroups
          }));
        } catch (error) {
          this.setState(prevState => ({
            ...prevState,
            loadingVendors: false,
            loading: prevState.loadingGroups
          }));
        }
      }
    );
  };

  getGroups = () => {
    this.setState(
      prevState => ({ ...prevState, loadingGroups: true }),
      () => {
        getUserGroups(
          result => {
            const groups = result.map(group => ({
              label: group.name,
              value: group.id
            }));
            this.setState(prevState => ({
              ...prevState,
              groups,
              loadingGroups: false,
              loading: prevState.loadingVendors
            }));
          },
          () => {
            this.setState(prevState => ({
              ...prevState,
              loadingGroups: false,
              loading: prevState.loadingVendors
            }));
          }
        )();
      }
    );
  };

  getVendorInformation = async ({ vendorId }) => {
    this.setState(
      prevState => ({
        ...prevState,
        loadingVendorInformation: true,
        vendor: null
      }),
      async () => {
        try {
          let options = {};
          if ((this.state.selectedGroup || {}).value) {
            options.queryStringParameters = {
              groupId: this.state.selectedGroup.value
            };
          }
          const vendor = await getVendorStakeholderInformation({
            vendorId,
            options
          });
          if (vendor.logo) {
            const logo = await getLogo(vendor.logo);
            vendor.logo = logo;
          }
          this.setState(prevState => ({
            ...prevState,
            vendor,
            loadingVendorInformation: false
          }));
        } catch (error) {
          this.setState(prevState => ({
            ...prevState,
            loadingVendorInformation: false
          }));
        }
      }
    );
  };

  handleSelectVendor = selectedVendor => {
    this.setState(
      prevState => ({ ...prevState, selectedVendor }),
      () => {
        this.getVendorInformation({ vendorId: selectedVendor.value });
      }
    );
  };
  handleSelectGroup = selectedGroup => {
    this.setState(
      prevState => ({ ...prevState, selectedGroup }),
      () => {
        if (this.state.selectedVendor) {
          this.getVendorInformation({
            vendorId: this.state.selectedVendor.value
          });
        }
      }
    );
  };

  render() {
    return (
      <StakeholderNavigator
        loading={this.state.loading}
        vendors={this.state.vendors}
        vendor={this.state.vendor}
        handleSelectVendor={this.handleSelectVendor}
        selectedVendor={this.state.selectedVendor}
        groups={this.state.groups}
        selectedGroup={this.state.selectedGroup}
        handleSelectGroup={this.handleSelectGroup}
        loadingVendorInformation={this.state.loadingVendorInformation}
      />
    );
  }
}

export default withRouter(StakeholderNavigatorContainer);
