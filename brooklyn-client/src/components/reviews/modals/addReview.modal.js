import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import DatePicker from "material-ui-pickers/DatePicker";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { API } from "aws-amplify";
import moment from "moment";
import { LoadingSpinner } from "../../loading-spinner";
import { getAllEntities } from "../../../containers/service/root.service";
import ReactSelectMUI from "../../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";

const getGroups = getAllEntities("user/groups");
const getAllKeyprocess = getAllEntities("keyprocess");

const validationSchema = Yup.object().shape({
  notes: Yup.string(),
  date: Yup.date().required(),
  vendorId: Yup.string().required(),
  keyprocessId: Yup.string().required()
});

class AddReviewModal extends React.Component {
  state = {
    vendors: [],
    loadingVendors: false,
    errorLoadingVendors: false
  };

  mounted = false;

  async componentDidMount() {
    this.mounted = true;
    await this.modalInitializer();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  modalInitializer = () => {
    return new Promise(resolve => {
      const initializers = [
        this.getVendors,
        this.getGroups,
        this.getAllKeyprocess
      ];
      this.setState(
        {
          loadingVendors: true,
          loadingGroups: true,
          loadingKeyprocess: true,
          errorLoadingVendors: false,
          errorloadingGroups: false,
          errorLoadingKeyprocess: false
        },
        async () => {
          const resolvedPromises = await Promise.all(
            initializers.map(fn => fn())
          );
          const newState = resolvedPromises.reduce(
            (acc, values) => ({ ...acc, ...values }),
            {}
          );
          if (this.mounted) {
            this.setState(
              prevState => ({
                ...prevState,
                ...newState,
                loadingVendors: false,
                loadingGroups: false,
                loadingKeyprocess: false
              }),
              () => resolve()
            );
          }
        }
      );
    });
  };

  getVendors = () => {
    return new Promise(async resolve => {
      try {
        const result = await API.get("UsersAPI", `/vendors`, {});
        const vendors = result.sort((a, b) => {
          var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        resolve({ vendors });
      } catch (error) {
        console.log(error);
        resolve({ errorLoadingVendors: error });
      }
    });
  };
  getGroups = () => {
    return new Promise(resolve => {
      getGroups(
        groups => {
          resolve({ groups });
        },
        error => {
          console.log(error);
          resolve({ errorloadingGroups: error });
        }
      )();
    });
  };
  getAllKeyprocess = () => {
    return new Promise(resolve => {
      getAllKeyprocess(
        keyprocess => {
          resolve({ keyprocess });
        },
        error => {
          console.log(error);
          resolve({ errorLoadingKeyprocess: error });
        }
      )();
    });
  };

  renderFild = (name, childComponent) => (
    <Field
      name={name}
      render={({ field, form }) => childComponent({ field, form })}
    />
  );

  renderSelect = props => (items, name, label, loading, erroLoading) =>
    this.renderFild(name, ({ form }) => {
      return (
        <>
          <ReactSelectMUI
            id={name}
            name={name}
            label={label}
            className={form.errors[name] && form.touched[name] ? "error" : ""}
            disabled={props.isSubmitting}
            value={props.values[name] || []}
            onChange={event => {
              props.setFieldValue(name, event);
            }}
            options={(items || []).map(item => ({
              value: item.id,
              label: item.name
            }))}
            width="100%"
            // {...field}
          />
          {erroLoading && (
            <p style={{ color: "red" }}>
              There was an error loading the {label}
            </p>
          )}
        </>
      );
    });

  render() {
    const {
      addReview,
      show,
      closeModalEvent,
      vendorId,
      keyprocessId
    } = this.props;
    const { vendors, loadingVendors, errorLoadingVendors } = this.state;
    const { groups, loadingGroups, errorloadingGroups } = this.state;
    const {
      keyprocess,
      loadingKeyprocess,
      errorLoadingKeyprocess
    } = this.state;

    const loadingModalData =
      loadingVendors || loadingGroups || loadingKeyprocess;
    const errorLoadingModalData = !!(
      errorLoadingVendors ||
      errorloadingGroups ||
      errorLoadingKeyprocess
    );

    const { name, id } =
      (keyprocess || []).find(
        item =>
          keyprocessId
            ? item.id === keyprocessId
            : item.name === "Vendor Review"
      ) || {};
    const keyprocessDefault = { label: name, value: id };
    const vendorDefault = vendors
      .map(v => ({ label: v.name, value: v.id }))
      .find(vendor => vendor.value === vendorId);
    return (
      <Formik
        enableReinitialize
        initialValues={{
          notes: "",
          date: new Date(),
          vendorId: vendorId ? vendorDefault : "",
          groupId: "",
          keyprocessId: keyprocessDefault
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const today = moment(new Date());
          let reviewDate = moment(values.date);
          reviewDate.hours(today.hours());
          reviewDate.minutes(today.minutes());
          reviewDate.seconds(today.seconds());
          const review = {
            ...values,
            date: reviewDate,
            notes: values.notes.trim() || "Vendor Review",
            vendorId: values.vendorId.value,
            groupId: values.groupId.value,
            keyprocessId: values.keyprocessId.value
          };
          addReview(review, setSubmitting);
        }}
        render={props => {
          const _renderSelect = this.renderSelect(props);

          return (
            <Form>
              <Modal
                show={show}
                onHide={closeModalEvent}
                container={this}
                aria-labelledby="contained-modal-title"
                enforceFocus={false}
              >
                <Modal.Header
                  style={{ backgroundColor: "#5b2157", color: "white" }}
                >
                  <h3> New Review </h3>
                </Modal.Header>
                <Modal.Body>
                  {!loadingModalData &&
                    !errorLoadingModalData && (
                      <GridItem xs={12} sm={12} md={12}>
                        {_renderSelect(
                          vendors,
                          "vendorId",
                          "Vendor",
                          loadingVendors,
                          errorLoadingVendors
                        )}
                        {_renderSelect(
                          groups,
                          "groupId",
                          "Group",
                          loadingGroups,
                          errorloadingGroups
                        )}
                        {_renderSelect(
                          keyprocess,
                          "keyprocessId",
                          "Key Process",
                          loadingKeyprocess,
                          errorLoadingKeyprocess
                        )}
                        <Field
                          name="date"
                          render={({ field }) => (
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                              <DatePicker
                                {...field}
                                format={"DD-MM-YYYY"}
                                style={{ marginTop: 10, width: "100%" }}
                                onChange={date =>
                                  props.setFieldValue("date", date)
                                }
                                ref={node => {
                                  if (node !== null) {
                                    node.setState({ open: false });
                                  }
                                }}
                                disabled={props.isSubmitting}
                              />
                            </MuiPickersUtilsProvider>
                          )}
                        />
                        <Field
                          name="notes"
                          render={({ field, form }) => (
                            <CustomInput
                              {...field}
                              labelText="Title"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: "notes",
                                value: field.value,
                                onChange: field.onChange,
                                disabled: props.isSubmitting
                              }}
                              error={form.errors.notes && form.touched.notes}
                            />
                          )}
                        />
                        {Object.keys(props.touched).filter(
                          key =>
                            props.touched[key] === true &&
                            key !== "notes" &&
                            props.touched[key] === true &&
                            key !== "groupId"
                        ).length ? (
                          <p style={{ color: "red" }}>
                            This field is required{" "}
                            {Object.keys(props.touched)
                              .filter(
                                key =>
                                  props.touched[key] === true &&
                                  key !== "notes" &&
                                  props.touched[key] === true &&
                                  key !== "groupId"
                              )
                              .map(
                                key =>
                                  key === "keyprocessId"
                                    ? "Key Process"
                                    : key === "vendorId"
                                      ? "Vendor"
                                      : ""
                              )
                              .join(", ")}
                          </p>
                        ) : null}
                      </GridItem>
                    )}
                  {loadingModalData && (
                    <LoadingSpinner height={200} size={100} />
                  )}
                  {errorLoadingModalData && (
                    <div style={{ textAlign: "center", height: "200px" }}>
                      <p style={{ paddingTop: "90px" }}>
                        There was an error loading the required data
                      </p>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    type="submit"
                    color="success"
                    disabled={props.isSubmitting || loadingModalData}
                    onClick={() =>
                      errorLoadingModalData
                        ? this.modalInitializer()
                        : props.handleSubmit
                    }
                  >
                    {errorLoadingModalData ? "RELOAD" : "SAVE"}
                  </Button>
                  <Button
                    type="button"
                    color="warning"
                    onClick={closeModalEvent}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          );
        }}
      />
    );
  }
}

export default AddReviewModal;

AddReviewModal.propTypes = {
  addReview: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  closeModalEvent: PropTypes.func.isRequired,
  vendor: PropTypes.object
};

AddReviewModal.defaultProps = {
  show: false
};
