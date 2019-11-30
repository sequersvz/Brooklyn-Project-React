import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "../../loading-spinner";
import { withStyles } from "@material-ui/core";
import AddContactModal from "../modals/AddContactModal";
import DeleteContactModal from "../modals/DeleteContactModal";
import { API, Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import Alert from "../../snackbar-alert";
import { baseUrlUploads } from "../../../config/config";
import { getLogo, putLogo } from "../../../containers/service";
import TableActions from "../../table-actions";
import AWS from "aws-sdk";
import { capitalize } from "../../../Utils";

const styles = () => ({
  head: {
    fontSize: "1.35rem",
    padding: "5px 20px"
  },
  cell: {
    fontSize: "1.25rem",
    padding: "5px 20px"
  },
  paper: {
    padding: "30px"
  },
  addContactButton: {
    textAlign: "right"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  avatar: {
    height: 60,
    width: 60
  }
});

const actionButton = (action, onClick) => (
  <FontAwesomeIcon
    icon={action === "delete" ? faTrash : faEdit}
    style={{
      color: "#683364",
      cursor: "pointer"
    }}
    onClick={() => onClick()}
  />
);

class ContactsTable extends React.Component {
  state = {
    contacts: null,
    contactFiles: undefined,
    showUploadingMessage: false,
    modal: {
      addContact: false,
      deleteContact: false,
      editContact: false
    },
    request: {
      loadContacts: false,
      addContact: false,
      deleteContact: false,
      editContact: false
    },
    errors: {
      loadContacts: false,
      addContact: false,
      deleteContact: false,
      editContact: false,
      createLoginCredentials: false
    },
    contactToDelete: null,
    pagination: {
      count: 0,
      page: 0,
      rowsPerPage: 5
    },
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    },
    contactToEdit: {}
  };

  componentDidMount() {
    if (this.props.vendorId) {
      this.loadContacts();
    }
    this.loadGroups();
  }

  componentDidUpdate() {
    if (
      this.props.vendorId &&
      !this.state.contacts &&
      !this.state.request.loadContacts
    ) {
      this.loadContacts();
    }
  }

  handleInputChange = event => {
    if (Array.isArray(event)) {
      this.setState({
        contactFiles: event,
        showUploadingMessage: false
      });
    }
  };
  handleShowUploadingMessage = value =>
    this.setState({ showUploadingMessage: value });

  handleOnDrop = accepted => {
    if (accepted.length > 0) {
      this.handleShowUploadingMessage(true);
      return this.handleInputChange(accepted);
    }
    this.setState({
      errors: "Only jpeg, jpg and png images are permitted"
    });
    setTimeout(() => this.setState({ errors: "" }), 3000);
  };

  addContact = (contact, done) => {
    this.handleStartRequest("addContact", async () => {
      try {
        const vendorId = parseInt(this.props.vendorId, 10);
        const apiContact = {
          ...contact,
          groups: (contact.groups || []).map(group => group.value),
          email: contact.email ? contact.email : null,
          role: "user",
          cognitoId: "",
          notificationPreference: "none"
        };

        if (
          Array.isArray(contact.profilePic) &&
          contact.profilePic.length > 0
        ) {
          let fileName = await putLogo(contact.profilePic);
          apiContact.profilePic = baseUrlUploads + fileName;
        }
        await API.post("UsersAPI", `/vendors/${vendorId}/contacts`, {
          body: apiContact
        });
        this.openAlert({
          message: "Contact Added",
          variant: "success",
          duration: 3000
        });
        this.loadContacts();
        this.setState(prevState => ({
          ...prevState,
          request: {
            ...prevState.request,
            addContact: false
          },
          modal: {
            ...prevState.modal,
            addContact: false
          },
          contactFiles: undefined
        }));
        done();
      } catch (error) {
        console.log(error);
        this.handleRequestError("addContact");
      }
    });
  };

  deleteContactCallback = async ({ contact, loadPreviousPage, page }) => {
    await API.del("UsersAPI", `/user/${contact.id}`, {});
    if (loadPreviousPage) {
      this.setState(
        prevState => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            page: page - 1
          }
        }),
        () => {
          this.loadContacts();
        }
      );
    } else {
      this.loadContacts();
    }
    this.handleModalDeleteContact(false, null);
    this.setState(prevState => ({
      ...prevState,
      request: {
        ...prevState.request,
        deleteContact: false
      }
    }));
    this.openAlert({
      message: "Contact Deleted",
      variant: "success",
      duration: 3000
    });
  };

  deleteContact = contact => {
    const { page } = this.state.pagination;
    const loadPreviousPage =
      page > 0 && (this.state.contacts || []).length === 1;
    this.handleStartRequest("deleteContact", async () => {
      try {
        if (contact.cognitoId) {
          const credentials = await Auth.currentCredentials();
          const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
            {
              credentials: Auth.essentialCredentials(credentials),
              region: process.env.REACT_APP_AWS_REGION
            }
          );
          let params = {
            UserPoolId: process.env.REACT_APP_USER_POOL_ID,
            Username: contact.cognitoId
          };
          await CognitoIdentityServiceProvider.adminDeleteUser(
            params,
            async err => {
              if (err) {
                this.handleRequestError("deleteContact");
              } else {
                await this.deleteContactCallback({
                  contact,
                  loadPreviousPage,
                  page
                });
              }
            }
          );
        } else {
          await this.deleteContactCallback({ contact, loadPreviousPage, page });
        }
      } catch (error) {
        this.handleRequestError("deleteContact");
      }
    });
  };

  loadContacts = () => {
    this.handleStartRequest("loadContacts", async () => {
      try {
        const { page, rowsPerPage } = this.state.pagination;
        const offset = page * rowsPerPage;
        const vendorId = this.props.vendorId;
        let {
          data,
          headers: { count }
        } = await API.get(
          "UsersAPI",
          `/vendors/${vendorId}/contacts?limit=${rowsPerPage}${
            page > 0 ? "&offset=" + offset : ""
          }`,
          {
            response: true,
            headers: {
              Accept: "application/json, text/plain, */*, count"
            }
          }
        );
        const contacts = await Promise.all(
          data.map(async contact => {
            const { profilePic } = contact;
            if (profilePic) {
              contact.profilePic = await getLogo(profilePic);
            }
            if (contact.groups.length) {
              contact.groups = contact.groups.map(group => ({
                label: group.name,
                value: group.id
              }));
            }
            return contact;
          })
        );

        this.setState(prevState => ({
          ...prevState,
          request: {
            ...prevState.request,
            loadContacts: false
          },
          contacts,
          pagination: {
            ...prevState.pagination,
            count
          }
        }));
      } catch (error) {
        this.openAlert({
          message: "Could not load the contacts",
          duration: null,
          variant: "error"
        });
        this.handleRequestError("loadContacts");
      }
    });
  };

  loadGroups = () => {
    this.handleStartRequest("loadGroups", async () => {
      try {
        let groups = await API.get("UsersAPI", `/user/groups`, {});
        groups = groups.map(group => ({ label: group.name, value: group.id }));
        this.setState(prevState => ({
          ...prevState,
          request: {
            ...prevState.request,
            loadGroups: false
          },
          groups
        }));
      } catch (error) {
        this.openAlert({
          message: "Could not load the Groups",
          duration: null,
          variant: "error"
        });
        this.handleRequestError("loadGroups");
      }
    });
  };
  handleStartRequest = (request, callback) =>
    this.setState(
      prevState => ({
        ...prevState,
        request: {
          ...prevState.request,
          [request]: true
        },
        errors: {
          ...prevState.errors,
          [request]: false
        }
      }),
      callback
    );

  handleRequestError = (request, message) =>
    this.setState(prevState => ({
      ...prevState,
      request: {
        ...prevState.request,
        [request]: false
      },
      errors: {
        ...prevState.errors,
        [request]: message || true
      }
    }));

  setModalState = (modal, modalState) =>
    this.setState(prevState => ({
      ...prevState,
      modal: { ...prevState.modal, [modal]: modalState },
      errors: { ...prevState.errors, [modal]: false }
    }));

  handleModalDeleteContact = (status, contact) => {
    this.setState(prevState => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        deleteContact: status
      },
      errors: {
        ...prevState.errors,
        // open errorless modal
        deleteContact: false
      },
      contactToDelete: contact
    }));
  };

  handleChangePage = (event, page) => {
    this.setState(
      prevState => ({
        ...prevState,
        pagination: {
          ...prevState.pagination,
          page
        }
      }),
      () => this.loadContacts()
    );
  };

  handleChangeRowsPerPage = ({ target: { value } }) => {
    if (value !== this.state.pagination.rowsPerPage) {
      this.setState(
        prevState => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            rowsPerPage: value,
            page: 0
          }
        }),
        () => this.loadContacts()
      );
    }
  };

  openAlert = ({ message, variant, duration }) =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        open: true,
        variant,
        duration,
        message
      }
    }));

  closeAlert = () =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        ...prevState.alert,
        open: false
      }
    }));

  handleModalEditContact = (status, contact) =>
    this.setState(prevState => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        editContact: status
      },
      errors: {
        ...prevState.errors,
        editContact: false
      },
      contactToEdit: contact
    }));

  editContact = (contactId, contactProperties, done) => {
    let { ...apiContact } = contactProperties;
    this.handleStartRequest("editContact", async () => {
      try {
        const vendorId = parseInt(this.props.vendorId, 10);
        if (
          Array.isArray(contactProperties.profilePic) &&
          contactProperties.profilePic.length > 0
        ) {
          let fileName = await putLogo(contactProperties.profilePic);

          apiContact.profilePic = baseUrlUploads + fileName;
        }
        const apiContactedit = {
          ...apiContact,
          groups: (apiContact.groups || []).map(group => group.value)
        };
        await API.patch(
          "UsersAPI",
          `/vendors/${vendorId}/contacts/${contactId}`,
          { body: apiContactedit }
        );
        this.openAlert({
          message: "Contact Edited",
          variant: "success",
          duration: 3000
        });
        const newContacts = await Promise.all(
          (this.state.contacts || []).map(async stateContact => {
            if (stateContact.id === contactId) {
              let newContact = {
                ...stateContact,
                ...apiContact
              };
              newContact.profilePic = await getLogo(newContact.profilePic);
              return newContact;
            }
            return stateContact;
          })
        );
        this.setState(prevState => ({
          ...prevState,
          request: {
            ...prevState.request,
            editContact: false
          },
          modal: {
            ...prevState.modal,
            editContact: false
          },
          contacts: newContacts,
          contactToEdit: {},
          contactFiles: undefined
        }));
        done();
      } catch (error) {
        this.handleRequestError("editContact");
      }
    });
  };

  createContactLoginCredentials = contact => {
    this.setState(
      prevState => ({
        ...prevState,
        contacts: (prevState.contacts || []).map(stateContact => {
          if (stateContact.id === contact.id) {
            stateContact.createLoginCredentials = true;
          }
          return stateContact;
        }),
        errors: {
          ...prevState.errors,
          createLoginCredentials: false
        }
      }),
      async () => {
        try {
          const credentials = await Auth.currentCredentials();
          const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
            {
              credentials: Auth.essentialCredentials(credentials),
              region: process.env.REACT_APP_AWS_REGION
            }
          );

          let paramsCreate = {
            UserPoolId: process.env.REACT_APP_USER_POOL_ID,
            Username: contact.email,
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
              {
                Name: "email",
                Value: contact.email
              },
              {
                Name: "custom:accountId",
                Value: String(1)
              },
              {
                Name: "custom:role",
                Value: contact.role
              },
              {
                Name: "name",
                Value: contact.name
              },
              {
                Name: "phone_number",
                Value: contact.phoneNumber
              }
            ]
          };

          CognitoIdentityServiceProvider.adminCreateUser(
            paramsCreate,
            async (err, response) => {
              if (err || !response) {
                this.handleRequestError(
                  "createLoginCredentials",
                  "Could not create the contact login credentials"
                );
              } else {
                const apiUser = {
                  cognitoId: response.User.Username
                };
                try {
                  await API.patch("UsersAPI", `/user/${contact.id}`, {
                    body: apiUser
                  });
                  await API.post(
                    "UsersAPI",
                    `/user/${apiUser.cognitoId}/vendors`,
                    { body: [contact.vendorId] }
                  );
                  this.openAlert({
                    message: "Contact credentials created",
                    variant: "success",
                    duration: 3000
                  });
                  this.setState(prevState => ({
                    ...prevState,
                    contacts: (prevState.contacts || []).map(stateContact => {
                      if (stateContact.id === contact.id) {
                        stateContact.cognitoId = apiUser.cognitoId;
                        stateContact.createLoginCredentials = false;
                      }
                      return stateContact;
                    })
                  }));
                } catch (error) {
                  console.log(error);
                  this.handleRequestError("createLoginCredentials");
                }
              }
            }
          );
        } catch (error) {
          this.handleRequestError("createLoginCredentials");
        }
      }
    );
  };

  render() {
    if (!this.props.vendorId) {
      return <LoadingSpinner />;
    }
    const { classes } = this.props;
    const {
      contacts,
      request,
      errors,
      modal,
      contactToDelete,
      pagination,
      alert,
      contactToEdit,
      groups
    } = this.state;
    const noContacts = (contacts || []).length === 0;
    const isEditing = Object.keys(contactToEdit).length > 0;

    const tableHead = (
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell className={classes.head}>Full Name</TableCell>
          <TableCell className={classes.head}>Email</TableCell>
          <TableCell className={classes.head}>Phone Number</TableCell>
          <TableCell className={classes.head}>Organisation</TableCell>
          <TableCell className={classes.head}>Job Title</TableCell>
          <TableCell className={classes.head}>Groups</TableCell>
          <TableCell className={classes.head}>Login Credentials</TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      </TableHead>
    );

    const tableBody = (
      <TableBody>
        {(contacts || []).map(contact => (
          <TableRow key={contact.id}>
            <TableCell>
              {contact.profilePic ? (
                <img
                  style={{ borderRadius: "50%" }}
                  alt={contact.name}
                  src={contact.profilePic}
                  className={classes.avatar}
                />
              ) : null}
            </TableCell>
            <TableCell className={classes.cell}>{contact.name}</TableCell>
            <TableCell className={classes.cell}>{contact.email}</TableCell>
            <TableCell className={classes.cell}>
              {contact.phoneNumber}
            </TableCell>
            <TableCell className={classes.cell}>
              {contact.organisation}
            </TableCell>
            <TableCell className={classes.cell}>{contact.jobtitle}</TableCell>
            <TableCell className={classes.cell}>
              {(contact.groups || []).map(group => group.label).join(", ")}
            </TableCell>
            <TableCell style={{ textAlign: "center" }}>
              {!contact.cognitoId && contact.email ? (
                <Button
                  style={{ fontSize: "0.7em" }}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    this.createContactLoginCredentials(contact);
                  }}
                >
                  {contact.createLoginCredentials
                    ? "Creating credentials..."
                    : "Create Credentials"}
                </Button>
              ) : (
                <React.Fragment>{`${capitalize(contact.role)}`}</React.Fragment>
              )}
            </TableCell>
            <TableCell className={classes.cell}>
              {actionButton("edit", () =>
                this.handleModalEditContact(true, contact)
              )}
            </TableCell>
            <TableCell className={classes.cell}>
              {actionButton("delete", () =>
                this.handleModalDeleteContact(true, contact)
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );

    return (
      <React.Fragment>
        <div className={classes.paper}>
          <Grid container>
            <Grid item xs={6} />
            <Grid item xs={6} className={classes.addContactButton}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.setModalState("addContact", true)}
              >
                Add Contact
              </Button>
            </Grid>
          </Grid>
          <div className={classes.tableWrapper}>
            <Table>
              {tableHead}
              {!request.loadContacts ? tableBody : null}
            </Table>
          </div>

          {request.loadContacts && (
            <LoadingSpinner text="Loading contacts..." />
          )}

          {!request.loadContacts &&
            noContacts && (
              <div style={{ height: "150px" }}>
                <p style={{ textAlign: "center", paddingTop: "70px" }}>
                  There are no contacts
                </p>
              </div>
            )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={Number(pagination.count)}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            ActionsComponent={TableActions}
          />
        </div>
        {(modal.addContact || modal.editContact) && (
          <AddContactModal
            show={modal.addContact || modal.editContact}
            close={() => {
              if (isEditing) {
                this.handleModalEditContact(false, {});
              } else {
                this.setModalState("addContact", false);
              }
            }}
            contactFiles={this.state.contactFiles}
            showUploadingMessage={this.state.showUploadingMessage}
            handleOnDrop={this.handleOnDrop}
            handleInputChange={this.handleInputChange}
            addContact={this.addContact}
            loading={request.addContact || request.editContact}
            error={errors.addContact || errors.editContact}
            contact={contactToEdit}
            editContact={this.editContact}
            groups={groups}
          />
        )}
        <DeleteContactModal
          show={modal.deleteContact}
          close={() => this.handleModalDeleteContact(false, null)}
          deleteContact={contact => this.deleteContact(contact)}
          loading={request.deleteContact}
          error={errors.deleteContact}
          contact={contactToDelete || {}}
        />
        <Alert
          open={alert.open}
          message={alert.message}
          duration={alert.duration}
          variant={alert.variant}
          handleClose={this.closeAlert}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(ContactsTable));
