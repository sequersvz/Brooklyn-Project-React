import React from "react";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import DatePicker from "material-ui-pickers/DatePicker";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import { API, Storage } from "aws-amplify";
import VendorProfileHeader from "./VendorProfileHeader";
import { withStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import LinearProgress from "@material-ui/core/LinearProgress";
import { LoadingSpinner } from "../../loading-spinner";
import { baseUrlUploads } from "../../../config/config";
import "../vendor.css";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import ReactSelectMUI from "../../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";
import { getLogo } from "../../../containers/service";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  boxTextField: {
    width: "100%"
  },
  textField: {
    width: "100%"
  },
  numberField: {
    width: "100%"
  },
  nameTextField: {
    width: "100%"
  },
  input: {
    display: "flex",
    padding: 0
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

const getChangedValues = (profile, formValues) => {
  let profileChangedValues = Object.keys(formValues).reduce(
    (changedValues, field) => {
      let index = false;
      if (field === "sourcingCategories") {
        formValues[field].forEach(iditem => {
          index = profile[field].findIndex(item => item.id === iditem);
        });
        if (index === -1) {
          return { ...changedValues, name: formValues[field] };
        }
      }
      if (field === "name") {
        return { ...changedValues, name: formValues["name"] };
      }
      if (!profile[field] && !formValues[field]) {
        return changedValues;
      }
      if (profile[field] !== formValues[field]) {
        return { ...changedValues, [field]: formValues[field] };
      }
      return changedValues;
    },
    {}
  );

  const {
    invoiceYtd,
    costOptimizations,
    csat,
    numberOfCostOptimizations,
    annualContractValue,
    totalContractValue,
    contractEndReview,
    manager,
    internalAccountableOwner,
    accountManager
  } = profileChangedValues;
  return {
    ...profileChangedValues,
    ...(typeof invoiceYtd !== "undefined" && {
      invoiceYtd: isNaN(parseFloat(invoiceYtd)) ? 0 : parseFloat(invoiceYtd)
    }),
    ...(typeof costOptimizations !== "undefined" && {
      costOptimizations: isNaN(parseFloat(costOptimizations))
        ? 0
        : parseFloat(costOptimizations)
    }),
    ...(typeof csat !== "undefined" && {
      csat: isNaN(parseFloat(csat)) ? 0 : parseFloat(csat)
    }),
    ...(typeof numberOfCostOptimizations !== "undefined" && {
      numberOfCostOptimizations: isNaN(parseInt(numberOfCostOptimizations, 10))
        ? 0
        : parseInt(numberOfCostOptimizations, 10)
    }),
    ...(typeof annualContractValue !== "undefined" && {
      annualContractValue: isNaN(parseFloat(annualContractValue))
        ? 0
        : parseFloat(annualContractValue)
    }),
    ...(typeof totalContractValue !== "undefined" && {
      totalContractValue: isNaN(parseFloat(totalContractValue))
        ? 0
        : parseFloat(totalContractValue)
    }),
    ...(contractEndReview && {
      contractEndReview: parseInt(contractEndReview, 10)
    }),
    ...(manager && {
      manager: parseInt(manager, 10)
    }),
    ...(internalAccountableOwner && {
      internalAccountableOwner: parseInt(internalAccountableOwner, 10)
    }),
    ...(accountManager && {
      accountManager: parseInt(accountManager, 10)
    })
  };
};

class VendorProfile extends React.Component {
  state = {
    request: {
      loadContacts: false,
      editVendorProfile: false,
      loadVendorProfile: false,
      loadUsers: false
    },
    errors: {
      loadContacts: false,
      editVendorProfile: false,
      loadVendorProfile: false,
      uploadLogo: false,
      loadUsers: false
    },
    contacts: [],
    users: [],
    vendor: {},
    vendorLogo: null
  };

  reloadVendorData = () => {
    const { vendorId, accountId } = this.props;
    const promises = [
      () => this.loadContacts(vendorId),
      () => this.loadVendorProfile(accountId, vendorId),
      this.loadUsers,
      this.loadServices,
      this.loadSourcienCateogy,
      this.loadBusinessUnits
    ];

    Promise.all(promises.map(p => Promise.resolve(p()).catch(() => null)));
  };

  componentDidMount() {
    const { vendorId, accountId } = this.props;
    if (vendorId && accountId) {
      this.reloadVendorData({ vendorId, accountId });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.vendorId !== this.props.vendorId) {
      this.reloadVendorData();
    }
  }

  handleOnSuccess = (field, properties) => {
    this.setState(prevState => ({
      ...prevState,
      request: {
        ...prevState.request,
        [field]: false
      },
      [field]: properties
    }));
  };

  loadDatos = (name, route, handlerOnSuccess) => {
    this.handleStartRequest(name, async () => {
      try {
        const result = await API.get("UsersAPI", `/${route}`, {});
        handlerOnSuccess(name, result, name);
      } catch (error) {
        this.props.openAlert({
          message: `Could not load the ${name}`,
          variant: "error",
          duration: 3000
        });
        this.handleRequestError(name);
      }
    });
  };

  loadServices = () =>
    this.loadDatos("loadService", "servicearea", this.handleOnSuccess);
  loadSourcienCateogy = () =>
    this.loadDatos(
      "loadSourcingcategory",
      "sourcingcategory",
      this.handleOnSuccess
    );
  loadBusinessUnits = () =>
    this.loadDatos("loadBusinessUnits", "businessUnits", this.handleOnSuccess);
  loadContacts = vendorId =>
    this.loadDatos(
      "loadContacts",
      `vendors/${vendorId}/contacts`,
      this.handleOnSuccess
    );
  loadUsers = () =>
    this.loadDatos("loadUsers", `user/all`, this.handleOnSuccess);
  loadProfileHandleOnSuccess = async (name, result) => {
    if (result.logo) {
      const logo = await getLogo(result.logo);
      result.logo = logo;
    }
    this.handleOnSuccess(name, result);
  };
  loadVendorProfile = (accountId, vendorId) =>
    this.loadDatos(
      "loadVendorProfile",
      `accounts/${accountId}/vendors/${vendorId}`,
      this.loadProfileHandleOnSuccess
    );

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

  submitChanges = details => {
    this.handleStartRequest("editVendorProfile", async () => {
      try {
        const { name, ...changes } = details;
        const { vendorId, getVendorById } = this.props;
        const { loadVendorProfile } = this.state;
        const vendor = loadVendorProfile || {};
        let logo = null;
        if (this.state.vendorLogo) {
          logo = await this.uploadLogo();
        }
        if (name !== vendor.name || logo) {
          await API.patch("UsersAPI", `/vendors/${vendorId}`, {
            body: {
              ...(name !== vendor.name && { name }),
              ...(logo && { logo })
            }
          });
        }
        if (Object.keys(changes).length > 0) {
          await API.patch("UsersAPI", `/vendors/${vendorId}/profile`, {
            body: changes
          });
          this.props.openAlert({
            message: "Vendor profile updated",
            variant: "success",
            duration: 3000
          });
        }
        let [vendorProfile] = vendor.profile;
        vendorProfile = {
          ...vendorProfile,
          ...changes
        };
        this.setState(prevState => ({
          ...prevState,
          request: {
            ...prevState.request,
            editVendorProfile: false
          },
          loadVendorProfile: {
            ...prevState.loadVendorProfile,
            name,
            ...(logo && { logo }),
            profile: [vendorProfile]
          }
        }));
        getVendorById(vendorId);
      } catch (error) {
        console.log(error);
        this.props.openAlert({
          message: "Could not update the vendor profile",
          variant: "error",
          duration: 5000
        });
        this.handleRequestError("editVendorProfile");
      }
    });
  };

  uploadLogo = async () => {
    const [file] = this.state.vendorLogo;
    const timestamp = Date.now().toString();
    const name = `${timestamp}.${file.name}`;
    const fileName = `uploads/logos/${name}`;
    await Storage.put(fileName, file, { contentType: file.type });
    return baseUrlUploads + fileName;
  };

  handleUploadLogo = vendorLogo => {
    this.setState(prevState => ({
      ...prevState,
      vendorLogo,
      errors: {
        ...prevState.errors,
        uploadLogo: false
      }
    }));
  };
  handleErrorUploadingLogo = () =>
    this.setState(prevState => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        uploadLogo: true
      }
    }));

  loadOptionsByServiceAndSourcingCategory = datos => {
    return (datos || []).filter(dato => !dato.parentId).map(dato => {
      let item = {};
      item = {
        label: dato.name,
        options: (datos || [])
          .filter(_dato => _dato.parentId === dato.id)
          .map(__dato => ({ label: __dato.name, value: __dato.id }))
      };
      return item;
    });
  };
  getItemSelected = (origen, valueId) => {
    if (Array.isArray(valueId)) {
      let values = valueId.map(value => {
        const selectedService = (origen || []).find(({ id }) => id === value);
        return {
          label: (selectedService || {}).name,
          value: (selectedService || {}).id
        };
      });
      return values;
    }
    valueId = parseInt(valueId, 10);
    if (valueId) {
      const selectedService = (origen || []).find(({ id }) => id === valueId);
      return {
        label: (selectedService || {}).name,
        value: (selectedService || {}).id
      };
    }
  };

  render() {
    const { classes } = this.props;
    const {
      loadContacts,
      loadVendorProfile,
      loadService,
      loadBusinessUnits,
      loadSourcingcategory,
      vendorLogo,
      request,
      errors,
      loadUsers
    } = this.state;
    const vendor = loadVendorProfile || {};
    const users = loadUsers || [];
    const [vendorProfile] = vendor.profile || [];
    const isLoading =
      request.loadVendorProfile || request.loadContacts || request.loadUsers;
    const isEditing = request.editVendorProfile;
    const noVendor = Object.keys(vendor).length === 0;

    const optionsInternalService = this.loadOptionsByServiceAndSourcingCategory(
      loadService
    );
    const optionsSourcingCategory = this.loadOptionsByServiceAndSourcingCategory(
      loadSourcingcategory
    );
    const optionsBusinessUnits = (loadBusinessUnits || []).map(unit => ({
      value: unit.id,
      label: unit.name
    }));

    if (!isLoading && noVendor) {
      return (
        <div style={{ height: "250px", textAlign: "center" }}>
          <p style={{ paddingTop: "100px" }}>No vendor information loaded</p>
          <p>Please check your internet connection and/or reload the page</p>
        </div>
      );
    }
    const renderFormControl = ({ touched, fieldName }) => component => (
      <FormControl
        className={classes.boxTextField}
        error={errors[fieldName] && touched[fieldName]}
      >
        {component}
        {touched[fieldName] &&
          errors[fieldName] && (
            <FormHelperText id={`${fieldName}-text`}>
              {errors[fieldName]}
            </FormHelperText>
          )}
      </FormControl>
    );

    const renderSelect = ({ touched, values, setFieldValue }) => (
      title,
      fieldName,
      _options,
      origen,
      isMulti = false
    ) => {
      const _renderForControl = renderFormControl({
        touched,
        values,
        setFieldValue,
        title,
        fieldName
      });
      return _renderForControl(
        <ReactSelectMUI
          id={fieldName}
          name={fieldName}
          label={title}
          className={classes.textField}
          disabled={isEditing}
          value={this.getItemSelected(origen, values[fieldName])}
          onChange={event => {
            if (!isMulti) {
              const { value } = event;
              return setFieldValue(fieldName, value);
            }
            const value = event.map(({ value }) => value);
            setFieldValue(fieldName, value);
          }}
          options={_options}
          isMulti={isMulti}
          width="100%"
        />
      );
    };

    const renderInput = ({
      touched,
      values,
      setFieldValue,
      handleChange,
      handleBlur
    }) => (title, fieldName, type, _class, StartAdornment) => {
      const _renderForControl = renderFormControl({
        touched,
        values,
        setFieldValue,
        title,
        fieldName
      });
      return _renderForControl(
        <TextField
          label={title}
          type={type}
          id={fieldName}
          name={fieldName}
          className={classes[_class]}
          disabled={isEditing}
          value={values[fieldName]}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={`${fieldName}-text`}
          InputProps={{
            startAdornment: <StartAdornment />
          }}
        />
      );
    };
    return isLoading ? (
      <LoadingSpinner />
    ) : (
      <React.Fragment>
        {isEditing ? <LinearProgress /> : null}
        <VendorProfileHeader
          vendor={vendor}
          vendorLogo={vendorLogo}
          handleUploadLogo={this.handleUploadLogo}
          handleErrorUploadingLogo={this.handleErrorUploadingLogo}
          errorUploadingLogo={errors.uploadLogo}
          disabled={isEditing}
        />
        <Formik
          enableReinitialize
          initialValues={{
            name: vendor.name || "",
            costOptimizations: (vendorProfile || {}).costOptimizations || "",
            csat: (vendorProfile || {}).csat || "",
            numberOfCostOptimizations:
              (vendorProfile || {}).numberOfCostOptimizations || "",
            invoiceYtd: (vendorProfile || {}).invoiceYtd || "",
            critical: (vendorProfile || {}).critical || false,
            performanceImprovementPlan:
              (vendorProfile || {}).performanceImprovementPlan || false,
            strategic: (vendorProfile || {}).strategic || false,
            contractedService: (vendorProfile || {}).contractedService || "",
            sourcingCategory: vendorProfile.sourcingCategory
              ? vendorProfile.sourcingCategory
              : ((vendorProfile || {}).sourcingCategories || []).map(
                  item => item.id
                ) || "",
            businessUnit: (vendorProfile || {}).businessUnit || "",
            annualContractValue:
              (vendorProfile || {}).annualContractValue || "",
            totalContractValue: (vendorProfile || {}).totalContractValue || "",
            contractStartDate: (vendorProfile || {}).contractStartDate || null,
            contractEndDate: (vendorProfile || {}).contractEndDate || null,
            contractEndReview: (vendorProfile || {}).contractEndReview || "",
            manager: (vendorProfile || {}).manager || "",
            internalAccountableOwner:
              (vendorProfile || {}).internalAccountableOwner || "",
            accountManager: (vendorProfile || {}).accountManager || ""
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .required("The vendor name cannot be empty"),
            costOptimizations: Yup.number()
              .typeError("Invalid number")
              .label("Total Cost Optimizations"),
            invoiceYtd: Yup.number()
              .typeError("Invalid number")
              .label("Invoice YTD"),
            csat: Yup.number()
              .max(100)
              .typeError("Invalid number")
              .label("CSAT"),
            numberOfCostOptimizations: Yup.number()
              .typeError("Invalid number")
              .label("Number of cost optimizations"),
            contractedService: Yup.string().trim(),
            annualContractValue: Yup.number()
              .typeError("Invalid number")
              .label("Annual Contract Value"),
            totalContractValue: Yup.number()
              .typeError("Invalid number")
              .label("Total Contract Value"),
            contractStartDate: Yup.date().nullable(),
            contractEndDate: Yup.date().nullable(),
            contractEndReview: Yup.number().oneOf([1, 3, 6, 12]),
            manager: Yup.number().positive(),
            internalAccountableOwner: Yup.number().positive(),
            accountManager: Yup.number().positive()
          })}
          onSubmit={values => {
            let vendorDetails = getChangedValues(vendorProfile, values);
            this.submitChanges(vendorDetails);
          }}
          render={({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            setFieldValue
          }) => {
            const handlers = {
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
              setFieldValue
            };
            const renderMySelect = renderSelect(handlers);
            const renderMyInput = renderInput(handlers);
            return (
              <form onSubmit={handleSubmit} style={{ padding: 30 }}>
                <Grid item xs={12}>
                  <Grid container spacing={32}>
                    <Grid item xs={12} sm={3}>
                      {renderMyInput(
                        "Name",
                        "name",
                        "text",
                        "nameTextField",
                        () => null
                      )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        className={classes.boxTextField}
                        control={
                          <Switch
                            name="critical"
                            checked={values.critical}
                            onChange={handleChange}
                            disabled={isEditing}
                            value="critical"
                            color="primary"
                          />
                        }
                        label="Critical"
                      />{" "}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        className={classes.boxTextField}
                        control={
                          <Switch
                            name="strategic"
                            checked={values.strategic}
                            onChange={handleChange}
                            disabled={isEditing}
                            value="strategic"
                            color="primary"
                          />
                        }
                        label="Strategic"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        className={classes.boxTextField}
                        control={
                          <Switch
                            name="performanceImprovementPlan"
                            checked={values.performanceImprovementPlan}
                            onChange={handleChange}
                            disabled={isEditing}
                            value="performanceImprovementPlan"
                            color="primary"
                          />
                        }
                        label="Performance Improvement Plan"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={32}>
                    <Grid item xs={12} sm={4}>
                      {renderMyInput(
                        "Total Cost Optimizations",
                        "costOptimizations",
                        "number",
                        "numberField",
                        () => (
                          <InputAdornment position="start">£</InputAdornment>
                        )
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {renderMyInput(
                        "Invoiced YTD",
                        "invoiceYtd",
                        "number",
                        "numberField",
                        () => (
                          <InputAdornment position="start">£</InputAdornment>
                        )
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {renderMyInput(
                        "CSAT",
                        "csat",
                        "number",
                        "numberField",
                        () => (
                          <InputAdornment position="start">%</InputAdornment>
                        )
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={32}>
                    <Grid item xs={12} sm={4}>
                      {renderMyInput(
                        "Annual Contract Value",
                        "annualContractValue",
                        "number",
                        "numberField",
                        () => (
                          <InputAdornment position="start">£</InputAdornment>
                        )
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {renderMyInput(
                        "Total Contract Value",
                        "totalContractValue",
                        "number",
                        "numberField",
                        () => (
                          <InputAdornment position="start">£</InputAdornment>
                        )
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {renderMyInput(
                        "Number of cost optimizations",
                        "numberOfCostOptimizations",
                        "number",
                        "numberField",
                        () => (
                          <InputAdornment position="start">#</InputAdornment>
                        )
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={32}>
                    <Grid item xs={12} sm={4}>
                      {renderMySelect(
                        "Internal Service",
                        "contractedService",
                        optionsInternalService,
                        loadService
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {renderMySelect(
                        "Sourcing Category",
                        "sourcingCategory",
                        optionsSourcingCategory,
                        loadSourcingcategory,
                        true
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {renderMySelect(
                        "Business Unit",
                        "businessUnit",
                        optionsBusinessUnits,
                        loadBusinessUnits
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={32}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <Grid item xs={12} sm={4}>
                        <DatePicker
                          className={[
                            classes.textField,
                            classes.boxTextField
                          ].join(" ")}
                          disabled={isEditing}
                          value={values.contractStartDate}
                          onChange={date => {
                            setFieldValue("contractStartDate", date);
                            setFieldValue(
                              "contractEndDate",
                              values.contractEndDate < date
                                ? null
                                : values.contractEndDate
                            );
                          }}
                          format="DD-MM-YYYY"
                          label="Contract Start Date"
                          autoOk
                          emptyLabel=""
                          error={
                            errors.contractStartDate &&
                            touched.contractStartDate
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <DatePicker
                          className={[
                            classes.textField,
                            classes.boxTextField
                          ].join(" ")}
                          minDate={values.contractStartDate}
                          disabled={isEditing}
                          value={values.contractEndDate}
                          onChange={date => {
                            setFieldValue("contractEndDate", date);
                          }}
                          format="DD-MM-YYYY"
                          label="Contract End Date"
                          autoOk
                          error={
                            errors.contractEndDate && touched.contractEndDate
                          }
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={[
                          classes.textField,
                          classes.boxTextField
                        ].join(" ")}
                        error={
                          errors.contractEndReview && touched.contractEndReview
                        }
                      >
                        <InputLabel htmlFor="contractEndReview">
                          Contract End Review
                        </InputLabel>
                        <Select
                          disabled={isEditing}
                          value={values.contractEndReview}
                          onChange={handleChange}
                          name="contractEndReview"
                        >
                          {[1, 3, 6, 12].map(months => (
                            <MenuItem
                              key={months}
                              value={months}
                            >{`${months} month${
                              months > 1 ? "s" : ""
                            } left`}</MenuItem>
                          ))}
                        </Select>
                        {touched.contractEndReview &&
                          errors.contractEndReview && (
                            <FormHelperText>
                              {errors.contractEndReview}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={32}>
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={[
                          classes.textField,
                          classes.boxTextField
                        ].join(" ")}
                        error={errors.manager && touched.manager}
                      >
                        <InputLabel htmlFor="manager">SRM Lead</InputLabel>
                        <Select
                          disabled={isEditing}
                          value={values.manager}
                          onChange={handleChange}
                          name="manager"
                        >
                          {users.length === 0 ? (
                            <MenuItem value="">No Users</MenuItem>
                          ) : null}
                          {users.map((user = {}) => (
                            <MenuItem key={user.id} value={user.id}>
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.manager &&
                          errors.manager && (
                            <FormHelperText>{errors.manager}</FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={[
                          classes.textField,
                          classes.boxTextField
                        ].join(" ")}
                        error={
                          errors.internalAccountableOwner &&
                          touched.internalAccountableOwner
                        }
                      >
                        <InputLabel htmlFor="internalAccountableOwner">
                          Internal Accountable Owner
                        </InputLabel>
                        <Select
                          disabled={isEditing}
                          value={values.internalAccountableOwner}
                          onChange={handleChange}
                          name="internalAccountableOwner"
                        >
                          {users.length === 0 ? (
                            <MenuItem value="">No Users</MenuItem>
                          ) : null}
                          {users.map((user = {}) => (
                            <MenuItem key={user.id} value={user.id}>
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.internalAccountableOwner &&
                          errors.internalAccountableOwner && (
                            <FormHelperText>
                              {errors.internalAccountableOwner}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={[
                          classes.textField,
                          classes.boxTextField
                        ].join(" ")}
                        error={errors.accountManager && touched.accountManager}
                      >
                        <InputLabel htmlFor="accountManager">
                          Account Manager
                        </InputLabel>
                        <Select
                          disabled={isEditing}
                          value={values.accountManager}
                          onChange={handleChange}
                          name="accountManager"
                        >
                          {(loadContacts || []).length === 0 ? (
                            <MenuItem value="">No Contacts</MenuItem>
                          ) : null}
                          {(loadContacts || []).map((contact = {}) => (
                            <MenuItem key={contact.id} value={contact.id}>
                              {contact.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.accountManager &&
                          errors.accountManager && (
                            <FormHelperText>
                              {errors.accountManager}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={32}>
                    <Grid item xs={12}>
                      <div className="boxButton">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isEditing}
                        >
                          {isEditing ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  accountId: ((state.user || {}).attributes || {})["custom:accountId"]
});

export default withStyles(styles)(
  connect(mapStateToProps)(withRouter(VendorProfile))
);
