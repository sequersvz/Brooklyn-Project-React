import React, { PureComponent } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import ReactPhoneInput from "react-phone-input-2";
import "../users.css";
import Switch from "@material-ui/core/Switch";
import { Formik } from "formik";
import * as Yup from "yup";
import UserVendorsAndGroups from "../../../containers/parentContainers/user-vendors-and-groups.container";
import CustomSelect from "../../../assets/materialComponents/CustomInput/CustomSelectMultiNivel.jsx";

class ModalAddUser extends PureComponent {
  render() {
    const { show, close, manageAccount, email, disabled } = this.props;
    const { nameCreate, role, accountId } = this.props;
    const { slugEditUser, phoneNumber, cognitoId } = this.props;
    let user = this.props.user
      ? this.props.user
      : { email: "", edit: false, nameCreate: "", phoneNumber: "+44" };

    const renderSelect = (
      items,
      values,
      label,
      name,
      setFieldValue,
      loadingSelectedGroups,
      selectedUserData,
      isMulti = true
    ) => {
      items = items.map(item => ({
        value: item.id,
        label: item.name
      }));

      let _values = !isMulti
        ? items.find(item => item.value === values[name])
        : items.filter(item => {
            return (values[name] || []).indexOf(item.value) > -1;
          });
      return (
        <div style={{ marginTop: "16px" }}>
          <CustomSelect
            disabled={loadingSelectedGroups}
            value={_values}
            label={label}
            onChange={(values, { action }) => {
              if (["select-option", "remove-value"].includes(action)) {
                if ("value" in values) {
                  return setFieldValue(name, values.value);
                }
                const selectedValues = values.map(item => item.value);
                setFieldValue(name, selectedValues);
              } else if (action === "clear") {
                setFieldValue(name, []);
              }
            }}
            options={items}
            defaultValue={items.find(
              item => item.value === selectedUserData[name]
            )}
            name={name}
            isMulti={isMulti}
            labelStyle={{ width: "100%" }}
            width="100%"
          />
        </div>
      );
    };

    return (
      <div>
        <UserVendorsAndGroups
          cognitoId={cognitoId}
          show={show}
          render={({
            selectedVendors,
            vendors,
            loadingSelectedVendors,
            selectedGroups,
            groups,
            loadingSelectedGroups,
            roles,
            selectedUserData,
            loadingSelectedRoles
          }) => (
            <Formik
              enableReinitialize
              initialValues={{
                nameCreate: nameCreate || user.nameCreate,
                email: email || user.email,
                phoneNumber: phoneNumber || "",
                role: role || user.role || "",
                selectedVendors: selectedVendors.map(vendor => vendor.id),
                selectedGroups: selectedGroups.map(group => group.id),
                roleapiId:
                  selectedUserData.roleapiId && selectedUserData.roleapiId,
                disabled: !!disabled
              }}
              validationSchema={Yup.object().shape({
                nameCreate: Yup.string(),
                email: Yup.string().email(),
                phoneNumber: Yup.string(),
                role: Yup.string(),
                selectedVendors: Yup.array().of(Yup.number()),
                selectedGroups: Yup.array().of(Yup.number())
              })}
              onSubmit={values => {
                const { roleCognito } =
                  roles.find(role => role.id === values.roleapiId) || {};
                values.role = roleCognito || "";
                manageAccount(
                  accountId,
                  slugEditUser ? "edit" : "create",
                  values
                );
              }}
              render={props => {
                return (
                  <Modal
                    show={show}
                    onHide={() => {
                      close();
                    }}
                    container={this}
                    aria-labelledby="contained-modal-title"
                  >
                    <Modal.Header
                      style={{ backgroundColor: "#5b2157", color: "white" }}
                    >
                      <h3>
                        {" "}
                        {slugEditUser === false ? "New user" : "Edit user"}
                      </h3>
                    </Modal.Header>
                    <Modal.Body>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Name"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            name: "nameCreate",
                            value: props.values.nameCreate,
                            onChange: props.handleChange
                          }}
                          error={
                            props.touched.nameCreate && props.errors.nameCreate
                          }
                        />
                        <CustomInput
                          labelText="Email"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            name: "email",
                            value: props.values.email,
                            onChange: props.handleChange
                          }}
                          error={props.touched.email && props.errors.email}
                        />
                        <ReactPhoneInput
                          name={"phoneNumber"}
                          placeholder={"Phone number"}
                          value={props.values.phoneNumber || "+44"}
                          autoFormat={false}
                          autoFocus={true}
                          onChange={value =>
                            props.setFieldValue("phoneNumber", value)
                          }
                        />
                        <div style={{ marginTop: "16px" }}>
                          {renderSelect(
                            vendors,
                            props.values,
                            "Vendors",
                            "selectedVendors",
                            props.setFieldValue,
                            loadingSelectedVendors,
                            selectedUserData,
                            true
                          )}
                        </div>
                        <div style={{ marginTop: "16px" }}>
                          {renderSelect(
                            groups,
                            props.values,
                            "Groups",
                            "selectedGroups",
                            props.setFieldValue,
                            loadingSelectedGroups,
                            selectedUserData,
                            true
                          )}
                        </div>
                        <div style={{ marginTop: "16px" }}>
                          {renderSelect(
                            roles,
                            props.values,
                            "Role",
                            "roleapiId",
                            props.setFieldValue,
                            loadingSelectedRoles,
                            selectedUserData,
                            false
                          )}
                        </div>
                        <div
                          style={{
                            display: slugEditUser === true ? "block" : "none"
                          }}
                        >
                          <label>
                            Disabled
                            <Switch
                              checked={props.values.disabled}
                              onChange={(_, value) =>
                                props.setFieldValue("disabled", value)
                              }
                              name="disabled"
                              value="disabled"
                              color="primary"
                            />
                          </label>
                        </div>
                      </GridItem>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        type="button"
                        color="success"
                        onClick={props.handleSubmit}
                      >
                        Save
                      </Button>
                      <Button type="button" color="warning" onClick={close}>
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>
                );
              }}
            />
          )}
        />
      </div>
    );
  }
}

export default ModalAddUser;
