import React, { Component } from "react";
import LayoutConfiguration from "../../components/configuration/layout.configuration";
import { withRouter } from "react-router-dom";
import AWS from "aws-sdk";
import { connect } from "react-redux";
import { Auth } from "aws-amplify/lib/index";
import { API } from "aws-amplify";
import { baseUrlUploads } from "../../config/config";
import { Storage } from "aws-amplify";
import { getAccount, updateAccountLogo } from "../../actions/account";
import { orderAlphabetically } from "../../actions/utils/sortByKey";
import { getLogo } from "../service";
import { changeCompanyName } from "../service/account";

class ContainerConfiguration extends Component {
  constructor(props) {
    super(props);
    this.handlerNotify = this.handlerNotify.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleErrorModalAddUser = this.handleErrorModalAddUser.bind(this);
  }
  state = {
    users: [],
    notify: {
      message: "",
      variant: "info",
      open: false,
      duration: 3000
    },
    showModalFilterVendor: false,
    load: true,
    email: "",
    phoneNumber: undefined,
    accountId: 1,
    slugEditUser: false,
    showUploadingMessage: false,
    cognitoId: "",
    userToDelete: null,
    accountLogo:
      "https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-shadow-fill-circle-512.png",
    companyName: ""
  };

  handlerNotify = (message, type) => {
    let objetNotify = {
      message: message,
      variant: type,
      open: true,
      duration: 3000
    };
    this.setState({ notify: objetNotify });
  };
  componentDidMount() {
    if (Reflect.has(this.props.account, "name")) {
      this.setState({ companyName: this.props.account.name });
    }
    this.manageAccount(this.state.accountId, "list");
    if ((this.props.account || {}).logoPath) {
      this.getAccountLogo();
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.state.companyName === "" &&
      Reflect.has(this.props.account, "name")
    ) {
      this.setState({ companyName: this.props.account.name });
    }
    if (prevProps.account.logoPath !== this.props.account.logoPath) {
      this.getAccountLogo();
    }
    if (prevProps.user !== this.props.user) {
      this.manageAccount(this.state.accountId, "list");
      this.setState({
        accountId: this.props.user.attributes["custom:accountId"]
      });
    }
  }

  getAccountLogo = () => {
    getLogo(this.props.account.logoPath)
      .then(logo => {
        this.setState({ accountLogo: logo });
      })
      .catch(error => console.log(error));
  };

  changeCompanyName = companyName => {
    const oldCompanyName = this.state.companyName;
    this.setState(
      prevState => ({ ...prevState, companyName }),
      async () => {
        try {
          await changeCompanyName(companyName);
        } catch (error) {
          console.log(error);
          this.setState({ companyName: oldCompanyName });
          this.handlerNotify("Could not change the company name", "error");
        }
      }
    );
  };

  handleErrorModalAddUser = isErrorValue => {
    this.setState({
      [isErrorValue]: true
    });
  };

  orderUsersAlphabetically = (user1, user2) => {
    let userName1 = user1.Attributes.find(attr => attr.Name === "name");
    userName1 = (userName1 || {}).Value || "";

    let userName2 = user2.Attributes.find(attr => attr.Name === "name");
    userName2 = (userName2 || {}).Value || "";

    return orderAlphabetically(userName1, userName2);
  };

  editUserApi = async properties => {
    const apiUser = {
      name: properties["nameCreate"],
      email: properties["email"],
      role: properties["role"],
      phoneNumber:
        properties["phoneNumber"] === "+" ? "" : properties["phoneNumber"],
      roleapiId: properties["roleapiId"]
    };
    try {
      await API.patch("UsersAPI", `/user/cognito/${this.state.cognitoId}`, {
        body: apiUser
      });
      if (properties.selectedVendors) {
        await API.post("UsersAPI", `/user/${this.state.cognitoId}/vendors`, {
          body: properties.selectedVendors
        });
      }
      if (properties.selectedGroups) {
        await API.post("UsersAPI", `/user/${this.state.cognitoId}/groups`, {
          body: properties.selectedGroups
        });
      }
      this.closeModal("showModalAddUser");
      this.manageAccount(
        this.props.user.attributes["custom:accountId"],
        "list"
      );
      this.handlerNotify("SUCCESS - User Edited", "success");
    } catch (error) {
      console.log(error);
      this.closeModal("showModalAddUser");
      this.handlerNotify(
        "ERROR -  There was an error editing the user",
        "error"
      );
    }
  };

  manageAccount = (accountId, action, properties = []) => {
    let self = this;
    Auth.currentCredentials().then(credentials => {
      const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
        {
          credentials: Auth.essentialCredentials(credentials),
          region: process.env.REACT_APP_AWS_REGION
        }
      );

      var parameters = {
        UserPoolId: process.env.REACT_APP_USER_POOL_ID,
        Limit: 50
      };
      if (action === "list") {
        CognitoIdentityServiceProvider.listUsers(parameters, (err, data) => {
          this.setState({
            users: ((data || {}).Users || []).sort(
              this.orderUsersAlphabetically
            )
          });
        });
      } else if (action === "create") {
        let paramsCreate = {
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          Username: properties["email"],
          DesiredDeliveryMediums: ["EMAIL"],
          ForceAliasCreation: false,
          UserAttributes: [
            {
              Name: "email",
              Value: properties["email"]
            },
            {
              Name: "custom:accountId",
              Value: String(accountId)
            },
            {
              Name: "custom:role",
              Value: String(properties["role"])
            },
            {
              Name: "name",
              Value: properties["nameCreate"]
            },
            {
              Name: "phone_number",
              Value: properties["phoneNumber"] || ""
            }
          ]
        };

        CognitoIdentityServiceProvider.adminCreateUser(
          paramsCreate,
          async (err, response) => {
            if (err || !response) {
              this.closeModal("showModalAddUser");
              self.handlerNotify("ERROR - " + err.message, "error");
            } else {
              const apiUser = {
                name: properties["nameCreate"],
                email: properties["email"],
                role: properties["role"],
                phoneNumber: properties["phoneNumber"] || "",
                cognitoId: response.User.Username,
                notificationPreference: "none",
                roleapiId: properties["roleapiId"]
              };
              try {
                await API.post("UsersAPI", "/user", { body: apiUser });
                if (properties.selectedVendors) {
                  await API.post(
                    "UsersAPI",
                    `/user/${apiUser.cognitoId}/vendors`,
                    {
                      body: properties.selectedVendors
                    }
                  );
                }
                if (properties.selectedGroups) {
                  await API.post(
                    "UsersAPI",
                    `/user/${apiUser.cognitoId}/groups`,
                    {
                      body: properties.selectedGroups
                    }
                  );
                }
                this.closeModal("showModalAddUser");
                this.manageAccount(accountId, "list");
                this.handlerNotify("SUCCESS - User created", "success");
              } catch (error) {
                console.log(error);
                this.closeModal("showModalAddUser");
                self.handlerNotify(
                  "ERROR - There was an error creating the user ",
                  "error"
                );
              }
            }
          }
        );
      } else if (action === "delete") {
        let paramsDelete = {
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          Username: properties["username"]
        };
        CognitoIdentityServiceProvider.adminDeleteUser(
          paramsDelete,
          async err => {
            if (err) {
              self.closeModal("showModalAddUser");
              self.handlerNotify("ERROR - " + err.message, "error");
            } else {
              try {
                await API.del(
                  "UsersAPI",
                  `/user/cognito/${properties["cognitoId"]}`,
                  {}
                );
                self.closeModal("showModalRemoveUser");
                self.manageAccount(accountId, "list");
                self.handlerNotify("SUCCESS - User deleted", "success");
              } catch (error) {
                // qué hacer si se borra en cognito y no en la api
                self.closeModal("showModalRemoveUser");
                self.handlerNotify("ERROR - " + (error || {}).message, "error");
              }
            }
          }
        );
      } else if (action === "get") {
        let paramsGet = {
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          Username: properties["email"]
        };

        CognitoIdentityServiceProvider.adminGetUser(paramsGet, function(
          err,
          data
        ) {
          if (err) console.log(err, err.stack);
          // an error occurred
          else {
            let email = data.UserAttributes.find(x => x.Name === "email")
              ? data.UserAttributes.find(x => x.Name === "email").Value
              : "";
            let nameCreate = data.UserAttributes.find(x => x.Name === "name")
              ? data.UserAttributes.find(x => x.Name === "name").Value
              : "";
            let role = data.UserAttributes.find(x => x.Name === "custom:role")
              ? data.UserAttributes.find(x => x.Name === "custom:role").Value
              : "";
            let disabled = data.Enabled === true ? false : true;
            let phoneNumber = data.UserAttributes.find(
              x => x.Name === "phone_number"
            )
              ? data.UserAttributes.find(x => x.Name === "phone_number").Value
              : "";
            self.setState({
              email,
              nameCreate,
              role,
              phoneNumber,
              cognitoId: data.Username,
              disabled
            });
          } // successful response
        });
      } else if (action === "edit") {
        let paramsEdit = {
          UserAttributes: [
            {
              Name: "custom:role",
              Value: properties["role"]
            },
            {
              Name: "email",
              Value: properties["email"]
            },
            {
              Name: "name",
              Value: properties["nameCreate"]
            },
            {
              Name: "phone_number",
              Value:
                properties["phoneNumber"] === "+"
                  ? ""
                  : properties["phoneNumber"]
            }
          ],
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          Username: self.state.emailEditUser
        };
        CognitoIdentityServiceProvider.adminUpdateUserAttributes(
          paramsEdit,
          async function(err) {
            if (err) {
              self.closeModal("showModalAddUser");
              self.handlerNotify("ERROR - " + err.message, "error");
            } else {
              let paramsEditDisabled = {
                UserPoolId: process.env.REACT_APP_USER_POOL_ID,
                Username: properties["email"]
              };
              const handleRespose = err => {
                if (err) {
                  self.handlerNotify(
                    "ERROR -  There was an error editing the user" +
                      err.message,
                    "error"
                  );
                  console.error(err);
                } else {
                  self.editUserApi(properties);
                  self.manageAccount(
                    self.props.user.attributes["custom:accountId"],
                    "list"
                  );
                } // successful response
              };

              if (properties["disabled"]) {
                CognitoIdentityServiceProvider.adminDisableUser(
                  paramsEditDisabled,
                  handleRespose
                );
              } else {
                CognitoIdentityServiceProvider.adminEnableUser(
                  paramsEditDisabled,
                  handleRespose
                );
              }
            }
          }
        );
      } else {
        console.log("default");
      }
    });
  };

  putAttachments = files => {
    if (files.length > 0) {
      const accountId = this.props.user.attributes["custom:accountId"];
      const file = files[0];
      const timestamp = Date.now().toString();
      const name = `${timestamp}.${file.name}`;
      const fileName = `uploads/logos/${name}`;
      Storage.put(fileName, file, { contentType: file.type })
        .then(() => {
          this.editAccount(accountId, { logoPath: baseUrlUploads + fileName });
          this.setState({ showUploadingMessage: false });
          this.props.updateLogo({ logoPath: baseUrlUploads + fileName });
        })
        .catch(err => console.log(err));
    }
  };

  _editAccountOnSuccess = accountId => () => {
    this.props.getAccount(accountId);
  };

  editAccount = (accountId, properties) => {
    let options = {
      body: properties
    };
    let onSuccess = this._editAccountOnSuccess(accountId);
    API.patch("UsersAPI", `/accounts/${accountId}`, options)
      .then(onSuccess)
      .catch(this.onError);
  };

  handleCloseModalAddUserEvent = () => {
    this.setState({
      isErrorName: undefined,
      isErrorEmail: undefined,
      isErrorRole: undefined,
      cognitoId: ""
    });
  };
  handleInputChange = event => {
    console.log(event);
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  closeAlert = () =>
    this.setState({
      notify: {
        ...this.state.notify,
        open: false
      }
    });

  openModalAdd = () => {
    this.setState({
      showAdd: true
    });
  };
  queryOrderBy = slug => {
    this.setState({ orderBy: slug });
    this.manageAccount(this.props.user.attributes["custom:accountId"], "list");
  };
  openModal = modalName => this.setState({ [modalName]: true });
  closeModal = modalName => {
    this.setState(prevState => ({
      ...prevState,
      [modalName]: false,
      slugEditUser: false,
      nameCreate: undefined,
      email: undefined,
      phoneNumber: undefined,
      role: undefined,
      vendor: undefined,
      disabled: undefined,
      cognitoId: ""
    }));
  };

  render() {
    const handlers = {
      users: this.state.users,
      account: this.props.account,
      accountLogo: this.state.accountLogo,
      handleInputChange: this.handleInputChange,
      showModalAddUser: this.state.showModalAddUser,
      showModalRemoveUser: this.state.showModalRemoveUser,
      showModalFilterVendor: this.state.showModalFilterVendor,
      slugEditUser: this.state.slugEditUser,
      handleEditUser: value => this.setState({ slugEditUser: value }),
      manageAccount: this.manageAccount,
      openModal: this.openModal,
      closeModal: this.closeModal,
      email: this.state.email,
      name: this.state.name,
      role: this.state.role,
      disabled: this.state.disabled,
      closeAlert: this.closeAlert,
      phoneNumber: this.state.phoneNumber,
      accountId: this.state.accountId,
      notify: this.state.notify,
      username: this.state.username,
      nameCreate: this.state.nameCreate,
      isErrorName: this.state.isErrorName,
      isErrorEmail: this.state.isErrorEmail,
      isErrorRole: this.state.isErrorRole,
      getUserById: this.state.getUserById,
      userToDelete: this.state.userToDelete,
      handleCloseModalAddUserEvent: this.handleCloseModalAddUserEvent,
      handleChangeUsername: (username, userToDelete) =>
        this.setState({ username, ...(userToDelete && { userToDelete }) }),
      handleChangePhoneNumber: value => this.setState({ phoneNumber: value }),
      handleEmailEditUser: value => this.setState({ emailEditUser: value }),
      putAttachments: this.putAttachments,
      showUploadingMessage: this.state.showUploadingMessage,
      handleShowUploadingMessage: value =>
        this.setState({ showUploadingMessage: value }),
      companyName: this.state.companyName,
      changeCompanyName: this.changeCompanyName,
      cognitoId: this.state.cognitoId
    };
    return (
      <div>
        <LayoutConfiguration {...handlers} />
      </div>
    );
  }
}

// con esta function se inserta las variables a los prod del componente instanciado
const mapStateToProps = state => {
  return {
    user: state.user,
    account: state.account
  };
};
//con esta function se sirven las functions para ejecutar en el container, al ejecutar estas functions la function anterior
//inserta los resultados en las props
const mapDispatchToProps = dispatch => {
  return {
    getAccount: accountId => {
      dispatch(getAccount(accountId));
    },
    updateLogo: logo => {
      dispatch(updateAccountLogo(logo));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContainerConfiguration));
