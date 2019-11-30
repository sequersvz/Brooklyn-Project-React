import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ReactPhoneInput from "react-phone-input-2";
import ReactSelectMUI from "../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";

const envelopeIcon = (
  <FontAwesomeIcon icon="envelope" style={{ margin: "0 10px" }} />
);
const mobileAltIcon = (
  <FontAwesomeIcon icon="mobile-alt" style={{ margin: "0 11px 0 13px" }} />
);

const invalidPhoneNumber = number => {
  return number === "0" || number === "+0" || number === "" || !number;
};

const spinner = <FontAwesomeIcon icon="spinner" spin />;

class ProfileData extends React.Component {
  state = {
    editing: "",
    activeRequest: {
      name: false,
      email: false,
      phoneNumber: false,
      notificationPreference: false
    }
  };

  editField = field => this.setState({ editing: field });
  doneEditing = () => this.setState({ editing: "" });

  sendRequest = (field, next) =>
    this.setState(
      prevState => ({
        ...prevState,
        activeRequest: { ...prevState.activeRequest, [field]: true }
      }),
      next
    );
  requestSent = field =>
    this.setState(prevState => ({
      ...prevState,
      activeRequest: { ...prevState.activeRequest, [field]: false }
    }));
  onChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  onSelectChange = (name, selection) => {
    this.setState({ [name]: selection });
  };

  render() {
    const { user, errors, groups } = this.props;
    const { editing, activeRequest } = this.state;
    const renderSelect = (
      label,
      name,
      className,
      items,
      defaultItems,
      isMulti = false
    ) => (
      <ReactSelectMUI
        disabled={!editing === name}
        value={this.state[name] || defaultItems}
        label={label}
        onChange={selection => this.onSelectChange(name, selection)}
        className={className}
        name={name}
        style={{
          width: "100%",
          textAlign: "left"
        }}
        onBlur={() => {
          let values = { [name]: this.state[name] };
          this.sendRequest(name, () =>
            this.props.submitChanges(values, () => this.requestSent(name))
          );
          this.doneEditing();
        }}
        options={items}
        isMulti={isMulti}
      />
    );
    return (
      <React.Fragment>
        {editing === "name" ? (
          <Formik
            initialValues={{ name: user.name }}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .trim()
                .min(4, "The name is too short")
                .required("The name cannot be empty")
            })}
            onSubmit={values => {
              if (values.name !== user.name) {
                this.sendRequest("name", () =>
                  this.props.submitChanges(values, () =>
                    this.requestSent("name")
                  )
                );
              }
              this.doneEditing();
            }}
            render={props => (
              <Form>
                <Field
                  name="name"
                  className="inputTitle"
                  onBlur={props.handleSubmit}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "5px",
                    marginTop: "20px",
                    fontSize: "14px"
                  }}
                />
                {/* mensaje de error */}
                {props.errors.name && <p>{props.errors.name}</p>}
              </Form>
            )}
          />
        ) : (
          <React.Fragment>
            <p
              style={{
                fontSize: "2.25rem",
                color: "gray",
                marginTop: "20px",
                cursor: "pointer",
                textAlign: "left"
              }}
              onClick={() => {
                if (!activeRequest.name) {
                  this.editField("name");
                }
              }}
            >
              {user.name} {activeRequest.name ? spinner : null}
            </p>
            {errors.name && (
              <p style={{ color: "red" }}>
                There was an error updating the name
              </p>
            )}
          </React.Fragment>
        )}
        <p
          style={{
            fontSize: "1.8rem",
            marginTop: "25px",
            color: "#9b7193",
            textAlign: "left"
          }}
        >
          {user.role}
        </p>
        <p
          style={{
            fontSize: "2rem",
            color: "gray",
            marginTop: "35px",
            marginBottom: "20px",
            textAlign: "left"
          }}
        >
          User Data
        </p>
        {editing === "email" ? (
          <Formik
            initialValues={{ email: user.email }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .trim()
                .email("You must enter a valid email address")
                .required("The email is required")
            })}
            onSubmit={values => {
              if (values.email !== user.email) {
                this.sendRequest("email", () =>
                  this.props.submitChanges(values, () =>
                    this.requestSent("email")
                  )
                );
              }
              this.doneEditing();
            }}
            render={props => (
              <Form>
                <Field
                  name="email"
                  className="inputTitle"
                  onBlur={props.handleSubmit}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "5px",
                    fontSize: "14px",
                    textAlign: "left"
                  }}
                />
                {/* mensaje de error */}
                {props.errors.email && <p>{props.errors.email}</p>}
              </Form>
            )}
          />
        ) : (
          <React.Fragment>
            <p
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                textAlign: "left"
              }}
              onClick={() => {
                if (!activeRequest.email) {
                  this.editField("email");
                }
              }}
            >
              {envelopeIcon}
              {user.email} {activeRequest.email ? spinner : null}
            </p>
            {errors.email && (
              <p style={{ color: "red" }}>
                There was an error updating the email
              </p>
            )}
          </React.Fragment>
        )}

        {editing === "phoneNumber" ? (
          <Formik
            enableReinitialize
            initialValues={{
              phoneNumber: invalidPhoneNumber(user.phoneNumber)
                ? "+44"
                : user.phoneNumber
            }}
            validationSchema={Yup.object().shape({
              phoneNumber: Yup.string()
                .trim()
                //validacion con regexp?
                .min(6, "The phone number is too short")
                .required("The phone number is required")
            })}
            onSubmit={values => {
              if (values.phoneNumber !== user.phoneNumber) {
                this.sendRequest("phoneNumber", () =>
                  this.props.submitChanges(values, () =>
                    this.requestSent("phoneNumber")
                  )
                );
              }
              this.doneEditing();
            }}
            render={props => (
              <ReactPhoneInput
                name="phoneNumber"
                placeholder="Phone number"
                value={props.values.phoneNumber}
                autoFormat={false}
                autoFocus
                onChange={value => props.setFieldValue("phoneNumber", value)}
                onBlur={props.handleSubmit}
              />
            )}
          />
        ) : (
          <React.Fragment>
            <p
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                textAlign: "left"
              }}
              onClick={() => {
                if (!activeRequest.phoneNumber) {
                  this.editField("phoneNumber");
                }
              }}
            >
              {mobileAltIcon}
              {user.phoneNumber} {activeRequest.phoneNumber ? spinner : null}
            </p>
            {errors.phoneNumber && (
              <p style={{ color: "red" }}>
                There was an error updating the phone number
              </p>
            )}
          </React.Fragment>
        )}

        {renderSelect(
          "Notification Preference",
          "notificationPreference",
          "inputTitle",
          [
            { label: "none", value: 1 },
            { label: "email", value: 2 },
            { label: "sms", value: 3 },
            { label: "both", value: 4 }
          ],
          [{ label: user.notificationPreference }]
        )}
        {renderSelect(
          "Groups I'm interested in",
          "groups",
          "inputTitle",
          groups || [],
          user.groups,
          true
        )}
      </React.Fragment>
    );
  }
}
export default ProfileData;
