import React, { PureComponent } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalAddUser from "../modals/addUser.modal";
import ModalRemoveUser from "../modals/removeUser.modal";
import FixedIcons from "../../fixed-icon/fixed.icons";
import iconsDataStructure from "../structure.icons";
import Alert from "../../snackbar-alert";
import { Row, Col } from "react-bootstrap";
import "./users.css";
import Dropzone from "../../dropzone";
import CompanyName from "../CompanyName";

class TabUsers extends PureComponent {
  state = {
    error: "",
    selectedTab: 0
  };
  render() {
    const { users } = this.props;
    const { handleInputChange, manageAccount } = this.props;
    const {
      openModal,
      closeModal,
      email,
      role,
      disabled,
      phoneNumber,
      nameCreate,
      userToDelete,
      cognitoId
    } = this.props;
    const { accountId, removeVendor } = this.props;
    const { showModalRemoveUser } = this.props;
    const { handleCloseModalAddUserEvent } = this.props;
    const openModalAddUser = () => openModal("showModalAddUser");
    const closeModalAddUser = () => {
      handleCloseModalAddUserEvent();
      closeModal("showModalAddUser");
    };
    const closeModalRemoveUser = () => closeModal("showModalRemoveUser");
    const {
      showModalAddUser,
      showModalFilterVendor,
      putAttachments
    } = this.props;
    const { handlerShowModalFilterVendor, username } = this.props;
    const { handleChangeUsername } = this.props;
    const { handleChangePhoneNumber } = this.props;
    const { notify, closeAlert } = this.props;
    const { handleEditUser, slugEditUser, handleEmailEditUser } = this.props;
    const { isErrorName, isErrorEmail, isErrorRole } = this.props;
    const { showUploadingMessage, handleShowUploadingMessage } = this.props;
    const HandlerModalRemove = {
      show: showModalRemoveUser,
      close: closeModalRemoveUser,
      removeVendor,
      manageAccount,
      username,
      userToDelete
    };
    const HandlerModalAdd = {
      show: showModalAddUser,
      close: closeModalAddUser,
      manageAccount,
      handleInputChange,
      email,
      role,
      disabled,
      phoneNumber,
      nameCreate,
      accountId,
      isErrorName,
      isErrorEmail,
      isErrorRole,
      slugEditUser,
      handleChangePhoneNumber,
      cognitoId
    };
    const handlerIconsStructure = {
      openModalAddUser,
      handlerShowModalFilterVendor,
      showModalFilterVendor
    };
    const { companyName, changeCompanyName } = this.props;
    const iconsData = iconsDataStructure(handlerIconsStructure);
    let logoMain = this.props.accountLogo;
    return (
      <div style={{ paddingTop: 40 }}>
        {notify && (
          <Alert
            open={notify.open}
            message={notify.message}
            duration={notify.duration}
            variant={notify.variant}
            handleClose={closeAlert}
          />
        )}
        <Row className="show-grid ml-5">
          <Col md={8}>
            <Col md={4}>
              <p>Name</p>
            </Col>
            <Col md={4}>
              <p>Email</p>
            </Col>
            <Col md={2} className="align-text">
              <p>Role</p>
            </Col>
            <Col md={1} className="align-text">
              <p>Edit</p>
            </Col>
            <Col md={1} className="align-text">
              <p>Delete</p>
            </Col>
          </Col>

          <Col md={8} className="table-body">
            {users
              ? users.map((user, key) => {
                  let email = user.Attributes.find(x => x.Name === "email")
                    ? user.Attributes.find(x => x.Name === "email").Value
                    : "";
                  let role = user.Attributes.find(x => x.Name === "custom:role")
                    ? user.Attributes.find(x => x.Name === "custom:role").Value
                    : "";
                  let name = user.Attributes.find(x => x.Name === "name")
                    ? user.Attributes.find(x => x.Name === "name").Value
                    : "";
                  const result = (
                    <Row className="table-conten-users" key={key}>
                      <Col md={4}>
                        <span>{name}</span>
                      </Col>
                      <Col md={4}>
                        <span>{email}</span>
                      </Col>
                      <Col md={2} className="align-text">
                        <span>{role}</span>
                      </Col>
                      <Col md={1} className="align-text icon-style">
                        <FontAwesomeIcon
                          icon={faEdit}
                          onClick={e => {
                            e.preventDefault();
                            manageAccount(accountId, "get", { email });
                            openModalAddUser();
                            handleEditUser(true);
                            handleEmailEditUser(email);
                          }}
                        />
                      </Col>
                      <Col md={1} className="align-text icon-style">
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={e => {
                            e.preventDefault();
                            handleChangeUsername(email, user.Username);
                            openModal("showModalRemoveUser");
                          }}
                        />
                      </Col>
                    </Row>
                  );
                  return result;
                })
              : null}
          </Col>
          <Col md={4}>
            <div className="companyLogo">
              <CompanyName
                name={companyName}
                changeCompanyName={changeCompanyName}
              />
              <Dropzone
                accept="image"
                mainLogo={logoMain}
                handleOnDrop={accepted => {
                  handleShowUploadingMessage(true);
                  return putAttachments(accepted);
                }}
                showUploadingMessage={showUploadingMessage}
              />
            </div>
          </Col>
        </Row>
        <FixedIcons iconsData={iconsData} />
        {showModalAddUser && <ModalAddUser {...HandlerModalAdd} />}
        {showModalRemoveUser && <ModalRemoveUser {...HandlerModalRemove} />}
      </div>
    );
  }
}

export default TabUsers;
