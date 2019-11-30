import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import ReactPhoneInput from "react-phone-input-2";
import { Formik } from "formik";
import * as Yup from "yup";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dropzone from "../../dropzone";
import ReactSelectMUI from "../../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";

class AddContactModal extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      show,
      loading,
      error,
      showUploadingMessage,
      contactFiles
    } = this.props;
    return (
      show !== nextProps.show ||
      loading !== nextProps.loading ||
      error !== nextProps.error ||
      showUploadingMessage !== nextProps.showUploadingMessage ||
      contactFiles !== nextProps.contactFiles
    );
  }

  render() {
    const {
      show,
      close,
      addContact,
      loading,
      error,
      contact,
      editContact,
      showUploadingMessage,
      handleOnDrop,
      contactFiles,
      groups
    } = this.props;
    const isEditing = Object.keys(contact).length > 0;
    let contactLogo = contact.profilePic;

    const renderSelect = ({ onChange, values }) => (
      label,
      name,
      className,
      items,
      defaultItems,
      isMulti = false
    ) => {
      return (
        <ReactSelectMUI
          value={values}
          label={label}
          onChange={selection => onChange(name, selection)}
          className={className}
          defaultItems={defaultItems}
          name={name}
          style={{
            textAlign: "left"
          }}
          width={430}
          options={items}
          isMulti={isMulti}
        />
      );
    };
    return (
      <Formik
        enableReinitialize
        initialValues={{
          name: isEditing ? contact.name : "",
          email: isEditing ? contact.email : "",
          phoneNumber: isEditing ? contact.phoneNumber : "",
          organisation: isEditing ? contact.organisation : "",
          groups: isEditing ? contact.groups : "",
          jobtitle: isEditing ? contact.jobtitle : ""
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .trim()
            .required("The name cannot be empty"),
          email: Yup.string()
            .trim()
            .email()
            .nullable(true),
          phoneNumber: Yup.string().trim(),
          organisation: Yup.string()
            .trim()
            .nullable(true)
        })}
        onSubmit={(values, { resetForm }) => {
          if (contactFiles) {
            values.profilePic = contactFiles;
          }
          if (isEditing) {
            editContact(contact.id, values, resetForm);
          } else {
            addContact(values, resetForm);
          }
        }}
        render={props => (
          <Modal
            show={show}
            onHide={() => {
              props.resetForm();
              close();
            }}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header
              style={{ backgroundColor: "#5b2157", color: "white" }}
            >
              <h3>{isEditing ? "Edit" : "Add"} Contact</h3>
            </Modal.Header>
            <Modal.Body>
              <GridItem xs={12} sm={12} md={12}>
                {loading && <LinearProgress />}
                {error && (
                  <p style={{ color: "red", textAlign: "center" }}>
                    {typeof error === "boolean"
                      ? `There was an error ${
                          isEditing ? "editing" : "creating"
                        } the contact`
                      : error}
                  </p>
                )}
                <CustomInput
                  labelText="Full Name"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    name: "name",
                    value: props.values.name,
                    onChange: props.handleChange
                  }}
                  error={props.errors.name && props.touched.name}
                />
                <CustomInput
                  labelText="Email"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    name: "email",
                    value: props.values.email,
                    onChange: props.handleChange
                  }}
                  error={props.errors.email && props.touched.email}
                />
                <ReactPhoneInput
                  name="phoneNumber"
                  placeholder="Phone number"
                  defaultCountry={"uk"}
                  value={props.values.phoneNumber || "+44"}
                  autoFormat={false}
                  autoFocus
                  onChange={value => props.setFieldValue("phoneNumber", value)}
                />
                <CustomInput
                  labelText="Organisation"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    name: "organisation",
                    value: props.values.organisation,
                    onChange: props.handleChange
                  }}
                  error={
                    props.errors.organisation && props.touched.organisation
                  }
                />
                <CustomInput
                  labelText="Job Title"
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    name: "jobtitle",
                    value: props.values.jobtitle,
                    onChange: props.handleChange
                  }}
                  error={props.errors.jobtitle && props.touched.jobtitle}
                />
                {renderSelect({
                  onChange: props.setFieldValue,
                  values: props.values.groups
                })(
                  "Groups I'm interested in",
                  "groups",
                  "",
                  groups || [],
                  contact.groups,
                  true
                )}
                <Dropzone
                  accept="image"
                  mainLogo={contactLogo}
                  dropText={"picture"}
                  handleOnDrop={handleOnDrop}
                  previewFiles={contactFiles}
                  showUploadingMessage={showUploadingMessage}
                />
              </GridItem>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                color="success"
                onClick={props.handleSubmit}
                disabled={loading}
              >
                Save
              </Button>
              <Button
                type="button"
                color="warning"
                onClick={() => {
                  props.resetForm();
                  close();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      />
    );
  }
}

export default AddContactModal;
