import React from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import Button from "../../../assets/materialComponents/CustomButtons/Button.jsx";
import CustomInput from "../../../assets/materialComponents/CustomInput/CustomInput.jsx";
import GridItem from "../../../assets/materialComponents/Grid/GridItem.jsx";
import DatePicker from "material-ui-pickers/DatePicker";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import Grid from "@material-ui/core/Grid";
import "../home.css";

const contractValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  amount: Yup.string().required(),
  vendorId: Yup.number().required(),
  statusId: Yup.number().required(),
  start: Yup.date().required(),
  end: Yup.date().required()
});

class ModalAddInitiatives extends React.Component {
  render() {
    const {
      show,
      close,
      addInitiatives,
      editInitiatives,
      rawVendors,
      deleteInitiative,
      contractStatuses,
      initiativeToEdit
    } = this.props;

    const isEditing = Object.keys(initiativeToEdit).length > 0;

    const deleteButton = isEditing ? (
      <Button
        type="button"
        color="danger"
        onClick={e => {
          e.preventDefault();
          deleteInitiative(initiativeToEdit.id);
        }}
      >
        Delete
      </Button>
    ) : null;

    const statusOptions = contractStatuses
      ? contractStatuses.map(status => (
          <option key={status.id} value={status.id}>
            {status.name}
          </option>
        ))
      : null;
    const notionalStatus = (contractStatuses || []).find(
      status => ((status || {}).name || "").toLowerCase().trim() === "notional"
    );
    const notionalStatusId = (notionalStatus || {}).id || "";
    return (
      <Formik
        enableReinitialize
        initialValues={{
          name: isEditing ? initiativeToEdit.name : "",
          amount: isEditing ? initiativeToEdit.amount : "",
          vendorId: isEditing ? initiativeToEdit.vendor : "",
          statusId: isEditing ? initiativeToEdit.status : notionalStatusId,
          start: isEditing ? initiativeToEdit.start : null,
          end: isEditing ? initiativeToEdit.end : null
        }}
        validationSchema={contractValidationSchema}
        onSubmit={(values, { resetForm }) => {
          const initiative = {
            ...values,
            amount: parseFloat(values.amount),
            vendorId: parseInt(values.vendorId, 10),
            statusId: parseInt(values.statusId, 10)
          };
          if (isEditing) {
            editInitiatives({ initiative, id: initiativeToEdit.id });
          } else {
            addInitiatives(initiative, () => resetForm());
          }
        }}
        render={props => (
          <Form>
            <Modal
              show={show}
              onHide={close}
              container={this}
              enforceFocus={false}
              aria-labelledby="contained-modal-title"
            >
              <Modal.Header
                style={{ backgroundColor: "#5b2157", color: "white" }}
              >
                <h3>{isEditing ? "Edit" : "New"} Initiative</h3>
              </Modal.Header>
              <Modal.Body>
                <Grid container spacing={10}>
                  <GridItem xs={12} sm={12} md={12}>
                    <Field
                      name="vendorId"
                      render={({ field, form }) => (
                        <select
                          {...field}
                          style={{ padding: 10, width: "100%" }}
                          className={
                            form.errors.vendorId && form.touched.vendorId
                              ? "error"
                              : ""
                          }
                        >
                          <option value="">Select One Vendor</option>
                          {(rawVendors || []).map(vendor => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <Field
                      name="name"
                      render={({ field, form }) => {
                        return (
                          <CustomInput
                            {...field}
                            labelText="Name"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              name: "name",
                              onChange: field.onChange,
                              value: field.value
                            }}
                            error={form.errors.name && form.touched.name}
                          />
                        );
                      }}
                    />
                    <Field
                      name="amount"
                      render={({ field, form }) => {
                        return (
                          <CustomInput
                            {...field}
                            labelText="Amount (m)"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              name: "amount",
                              onChange: field.onChange,
                              value: field.value
                            }}
                            error={form.errors.amount && form.touched.amount}
                          />
                        );
                      }}
                    />
                    <Field
                      name="statusId"
                      render={({ field, form }) => (
                        <select
                          {...field}
                          style={{ padding: 10, width: "100%" }}
                          className={
                            form.errors.statusId && form.touched.statusId
                              ? "error"
                              : ""
                          }
                        >
                          <option value="">Select One Status</option>
                          {statusOptions}
                        </select>
                      )}
                    />
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Field
                      name="start"
                      render={({ field }) => (
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <DatePicker
                            value={field.value}
                            onChange={date => {
                              props.setFieldValue("start", date);
                              props.setFieldValue(
                                "end",
                                props.values.end < date
                                  ? null
                                  : props.values.end
                              );
                            }}
                            format={"DD-MM-YYYY"}
                            label="Start date"
                            style={{ marginTop: 10, width: "100%" }}
                            autoOk={true}
                            ref={node => {
                              if (node !== null) {
                                node.setState({ open: false });
                              }
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      )}
                    />
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Field
                      name="end"
                      render={({ field }) => (
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <DatePicker
                            value={field.value}
                            minDate={props.values.start}
                            onChange={date => props.setFieldValue("end", date)}
                            format={"DD-MM-YYYY"}
                            label="End date"
                            style={{ marginTop: 10, width: "100%" }}
                            autoOk={true}
                            ref={node => {
                              if (node !== null) {
                                node.setState({ open: false });
                              }
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      )}
                    />
                  </GridItem>
                </Grid>
              </Modal.Body>
              <Modal.Footer>
                {deleteButton}
                <Button type="button" color="warning" onClick={close}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  color="success"
                  onClick={props.handleSubmit}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        )}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    contractStatuses: state.contractStatus.rawContractStatuses
  };
};

export default connect(mapStateToProps)(ModalAddInitiatives);
