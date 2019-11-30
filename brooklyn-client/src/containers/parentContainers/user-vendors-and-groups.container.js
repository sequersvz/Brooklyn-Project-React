import React from "react";
import { API } from "aws-amplify";
import {
  getUserVendors,
  getUserGroups,
  getUserSelectedGroups,
  getUserRoles,
  getUserData
} from "../service/user";
class UserVendorsAndGroups extends React.Component {
  state = {
    selectedVendors: [],
    vendors: [],
    loadingSelectedVendors: true,
    loadingVendors: true,
    groups: [],
    roles: [],
    selectedUserData: {},
    selectedGroups: [],
    loadingGroups: true,
    loadingSelectedGroups: true
  };
  componentDidMount() {
    this.getVendors();
    this.getGroups();
    this.getRoles();
  }

  componentDidUpdate(prevProps) {
    if (this.props.cognitoId && this.props.cognitoId !== prevProps.cognitoId) {
      this.getUserSelectedVendors();
      this.getUserSelectedGroups();
      this.getUserData();
    }
    if (prevProps.show !== this.props.show) {
      this.setState(prevState => ({
        ...prevState,
        selectedVendors: [],
        selectedGroups: []
      }));
    }
  }

  getUserSelectedVendors = async () => {
    const { cognitoId } = this.props;
    try {
      const selectedVendors = await getUserVendors(cognitoId);
      this.setState(prevState => ({
        ...prevState,
        selectedVendors,
        loadingSelectedVendors: false
      }));
    } catch (error) {
      console.log(error);
      this.setState(prevState => ({
        ...prevState,
        selectedVendors: [],
        loadingSelectedVendors: false
      }));
    }
  };

  getVendors = async () => {
    try {
      const vendors = await API.get("UsersAPI", `/vendors`);
      this.setState(prevState => ({
        ...prevState,
        vendors,
        loadingVendors: false
      }));
    } catch (error) {
      console.log(error);
      this.setState(prevState => ({
        ...prevState,
        vendors: [],
        loadingVendors: false
      }));
    }
  };

  getUserSelectedGroups = async () => {
    const { cognitoId } = this.props;
    try {
      const selectedGroups = await getUserSelectedGroups(cognitoId);
      this.setState(prevState => ({
        ...prevState,
        selectedGroups,
        loadingSelectedGroups: false
      }));
    } catch (error) {
      console.log(error);
      this.setState(prevState => ({
        ...prevState,
        selectedGroups: [],
        loadingSelectedGroups: false
      }));
    }
  };

  getUserData = async () => {
    const { cognitoId } = this.props;
    try {
      const selectedUserData = await getUserData(cognitoId);
      this.setState(prevState => ({
        ...prevState,
        selectedUserData,
        loadingselectedUserData: false
      }));
    } catch (error) {
      console.log(error);
      this.setState(prevState => ({
        ...prevState,
        selectedUserData: [],
        loadingselectedUserData: false
      }));
    }
  };

  getGroups = () => {
    getUserGroups(
      groups =>
        this.setState(prevState => ({
          ...prevState,
          groups,
          loadingGroups: false
        })),
      error => {
        console.log(error);
        this.setState(prevState => ({
          ...prevState,
          groups: [],
          loadingGroups: false
        }));
      }
    )();
  };

  getRoles = () => {
    getUserRoles(
      roles =>
        this.setState(prevState => ({
          ...prevState,
          roles,
          loadingRoles: false
        })),
      error => {
        console.log(error);
        this.setState(prevState => ({
          ...prevState,
          roles: [],
          loadingRoles: false
        }));
      }
    )();
  };
  render() {
    const {
      selectedVendors,
      vendors,
      loadingSelectedVendors,
      selectedGroups,
      groups,
      roles,
      selectedUserData,
      loadingSelectedGroups
    } = this.state;
    return this.props.render({
      selectedVendors,
      vendors,
      loadingSelectedVendors,
      selectedGroups,
      groups,
      roles,
      selectedUserData,
      loadingSelectedGroups
    });
  }
}

export default UserVendorsAndGroups;
