import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiFormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import DatePicker from "material-ui-pickers/DatePicker";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import { withStyles } from "@material-ui/core";
import { getUserOwners } from "../../containers/service/user";
import { getAllEntities } from "../../containers/service/root.service";
import {
  getRiskStatuses,
  getRisksLabels,
  getTopRisks,
  getRisksTreatments,
  getRisksLifeCycles
} from "../../containers/service/risk";
import { getAccount } from "../../containers/service/account";
import { LoadingSpinner } from "../loading-spinner";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { formatToUnits } from "../../Utils";
import RichTextArea from "../rich-text-editor/RichTextArea";
import ReactSelectMUI from "../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";
import RiskAttachments from "./RiskAttachments";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  titleDivider: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: 20
  }
});

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  description: Yup.string(),
  impact: Yup.number(),
  probability: Yup.number(),
  rating: Yup.number(),
  projectImpact: Yup.string(),
  symptoms: Yup.string(),
  triggers: Yup.string(),
  responseStrategy: Yup.string(),
  contingencyPlan: Yup.string(),
  residualProbability: Yup.number(),
  residualImpact: Yup.number(),
  residualRating: Yup.number(),
  dueDate: Yup.date().nullable(),
  ownerId: Yup.number().nullable(),
  controls: Yup.string()
});

const FormControl = ({ children, error, classes }) => (
  <MuiFormControl className={classes.boxTextField}>
    {children}
    {error && <FormHelperText>{error}</FormHelperText>}
  </MuiFormControl>
);

const getChangedValues = (initialValues, formValues) => {
  const values = Object.keys(formValues).reduce((acc, value) => {
    if (!formValues[value] && !initialValues[value]) {
      return acc;
    }
    if (formValues[value] !== initialValues[value]) {
      return { ...acc, [value]: formValues[value] };
    }
    return acc;
  }, {});
  return values;
};

class EditRisk extends React.Component {
  state = {
    owners: [],
    loadingOwners: false,
    error: false,
    loadingRiskData: false,
    statuses: [],
    account: null,
    loadingAccount: false,
    labels: [],
    top: [],
    treatments: [],
    lifecycles: [],
    panels: {
      identify: false,
      analyse: false,
      responsePlan: false,
      monitor: false,
      files: false
    }
  };
  getAllVebdors = getAllEntities("vendors");
  componentDidMount() {
    this.setState(
      {
        loadingOwners: true,
        loadingRiskData: true,
        loadingAccount: true,
        error: false
      },
      async () => {
        if (this.props.risk.reviewId === null) {
          this.getAllVebdors(vendors => {
            this.setState({ vendors });
          })();
        }
        getUserOwners(
          owners => {
            this.setState({ owners, loadingOwners: false });
          },
          () => {
            this.setState({ loadingOwners: false, error: true });
          }
        )(this.props.risk.reviewId);
        try {
          const statuses = await getRiskStatuses();
          const account = await getAccount(1);
          const labels = await getRisksLabels();
          const top = await getTopRisks();
          const treatments = await getRisksTreatments();
          const lifecycles = await getRisksLifeCycles();
          this.setState(prevState => ({
            ...prevState,
            statuses,
            account,
            labels,
            top,
            treatments,
            lifecycles,
            loadingRiskData: false,
            loadingAccount: false
          }));
        } catch (error) {
          console.log(error);
          this.setState(prevState => ({
            ...prevState,
            loadingRiskData: false,
            loadingAccount: false
          }));
        }
      }
    );
  }
  handleChangePanel = name => () => {
    let value = this.state.panels[name];
    this.setState({ panels: { ...this.state.panels, [name]: !value } });
  };
  render() {
    const {
      risk,
      save,
      edit,
      classes,
      concatRiskFiles,
      filterRiskFile
    } = this.props;
    const {
      owners,
      panels,
      loadingOwners,
      loadingRiskData,
      statuses,
      loadingAccount,
      account,
      labels,
      treatments,
      lifecycles,
      top,
      vendors
    } = this.state;

    const riskLikelihood =
      account &&
      ![...Array(5)].some(
        (_, index) => account[`riskLikelihood${index + 1}`] === null
      )
        ? [
            { value: 5, label: `< = ${account.riskLikelihood1} years` },
            {
              value: 4,
              label: `${account.riskLikelihood1} - ${
                account.riskLikelihood2
              } years`
            },
            {
              value: 3,
              label: `${account.riskLikelihood2} - ${
                account.riskLikelihood3
              } years`
            },
            {
              value: 2,
              label: `${account.riskLikelihood3} - ${
                account.riskLikelihood4
              } years`
            },
            {
              value: 1,
              label: `${account.riskLikelihood4} - ${
                account.riskLikelihood5
              } years`
            }
          ]
        : [];

    const million = 1000000;
    const riskImpact =
      account &&
      ![...Array(5)].some(
        (_, index) => account[`riskImpact${index + 1}`] === null
      )
        ? [
            { value: 1, label: formatToUnits(account.riskImpact1 * million) },
            { value: 2, label: formatToUnits(account.riskImpact2 * million) },
            { value: 3, label: formatToUnits(account.riskImpact3 * million) },
            { value: 4, label: formatToUnits(account.riskImpact4 * million) },
            { value: 5, label: formatToUnits(account.riskImpact5 * million) }
          ]
        : [];

    const loading = loadingOwners || loadingRiskData || loadingAccount;
    const noRiskLikelihoodItems = riskLikelihood.length === 0;
    const noRiskImpactItems = riskImpact.length === 0;
    const isRiskRI = risk.reviewId !== null;
    return loading ? (
      <LoadingSpinner text="Loading Risk..." />
    ) : (
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          title: risk.title || "",
          description: risk.description || "",
          impact: risk.impact || 0,
          probability: risk.probability || 0,
          projectImpact: risk.projectImpact || "",
          symptoms: risk.symptoms || "",
          triggers: risk.triggers || "",
          responseStrategy: risk.responseStrategy || "",
          contingencyPlan: risk.contingencyPlan || "",
          residualProbability: risk.residualProbability || 0,
          residualImpact: risk.residualImpact || 0,
          dueDate: risk.dueDate,
          ownerId: (risk.owner || {}).id || 0,
          riskstatusId: risk.riskstatusId || 0,
          risklabelId: (risk.label || {}).id || 0,
          risktreatmentId: (risk.treatment || {}).id || 0,
          risklifecycleId: (risk.lifecycle || {}).id || 0,
          toprisksIds: (risk.toprisks || []).map(toprisk => toprisk.id),
          controls: risk.controls || "",
          vendorId: risk.vendorId
        }}
        onSubmit={(values, { setSubmitting }) => {
          const changedValues = getChangedValues(risk, values);
          save({
            ...changedValues,
            rating: values.impact * values.probability,
            residualRating: values.residualImpact * values.residualProbability,
            id: risk.id,
            setSubmitting,
            status: statuses.find(status => status.id === values.riskstatusId),
            owner: owners.find(owner => owner.id === values.ownerId),
            label: labels.find(label => label.id === values.risklabelId),
            treatment: treatments.find(
              treatment => treatment.id === values.risktreatmentId
            ),
            lifecycle: lifecycles.find(
              lifecycle => lifecycle.id === values.risklifecycleId
            ),
            toprisks: top.filter(
              item => values.toprisksIds.indexOf(item.id) > -1
            ),
            riskImpact: (
              riskImpact.find(item => item.value === values.impact) || {}
            ).label,
            riskProbability: (
              riskLikelihood.find(item => item.value === values.probability) ||
              {}
            ).label,
            residualRiskImpact: (
              riskImpact.find(item => item.value === values.residualImpact) ||
              {}
            ).label,
            residualRiskProbability: (
              riskLikelihood.find(
                item => item.value === values.residualProbability
              ) || {}
            ).label,
            vendorId: values.vendorId
          });
        }}
        render={props => (
          <React.Fragment>
            {props.isSubmitting ? (
              <LinearProgress style={{ marginTop: "-15px" }} />
            ) : (
              <div style={{ marginTop: "-15px", height: "4px" }} />
            )}
            <form style={{ padding: 30 }}>
              <Grid container spacing={32}>
                <Grid item xs={12} sm={6}>
                  <MuiFormControl
                    className={[classes.textField, classes.boxTextField].join(
                      " "
                    )}
                    error={
                      props.errors.riskstatusId && props.touched.riskstatusId
                    }
                  >
                    <InputLabel htmlFor="riskstatusId">Risk Status</InputLabel>
                    <Select
                      disabled={props.isSubmitting}
                      value={props.values.riskstatusId}
                      onChange={props.handleChange}
                      name="riskstatusId"
                    >
                      {statuses.map(status => (
                        <MenuItem key={`status-${status.id}`} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {props.touched.riskstatusId &&
                      props.errors.riskstatusId && (
                        <FormHelperText>
                          {props.errors.riskstatusId}
                        </FormHelperText>
                      )}
                  </MuiFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiFormControl
                    className={[classes.textField, classes.boxTextField].join(
                      " "
                    )}
                    error={
                      props.errors.risklifecycleId &&
                      props.touched.risklifecycleId
                    }
                  >
                    <InputLabel htmlFor="risklifecycleId">
                      Risk Lifecycle
                    </InputLabel>
                    <Select
                      disabled={props.isSubmitting || !account}
                      value={props.values.risklifecycleId}
                      onChange={props.handleChange}
                      name="risklifecycleId"
                    >
                      {lifecycles.map(lifecycle => (
                        <MenuItem
                          key={`lifecycle-${lifecycle.id}`}
                          value={lifecycle.id}
                        >
                          {lifecycle.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {props.touched.risklifecycleId &&
                      props.errors.risklifecycleId && (
                        <FormHelperText>
                          {props.errors.risklifecycleId}
                        </FormHelperText>
                      )}
                  </MuiFormControl>
                </Grid>
              </Grid>
              <Grid container style={{ marginTop: 20 }}>
                <Grid item xs={12} sm={12}>
                  <ExpansionPanel
                    expanded={panels.identify}
                    onChange={this.handleChangePanel("identify")}
                  >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <p className={classes.titleDivider}>Identify</p>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container item xs={12} sm={12} spacing={32}>
                        <Grid item xs={12} sm={isRiskRI ? 6 : 4}>
                          <FormControl
                            classes={classes}
                            error={props.touched.title && props.errors.title}
                          >
                            <TextField
                              className={classes.nameTextField}
                              label="Title"
                              type="text"
                              name="title"
                              value={props.values.title}
                              onChange={props.handleChange}
                              disabled={props.isSubmitting}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={isRiskRI ? 6 : 4}>
                          <FormControl
                            classes={classes}
                            error={
                              props.touched.description &&
                              props.errors.description
                            }
                          >
                            <RichTextArea
                              {...{
                                title: "Description",
                                text: props.values.description,
                                name: "description",
                                disabled: props.isSubmitting,
                                handleChange: props.handleChange
                              }}
                            />
                          </FormControl>
                        </Grid>
                        {!isRiskRI && (
                          <Grid item xs={12} sm={isRiskRI ? 6 : 4}>
                            <ReactSelectMUI
                              disabled={props.isSubmitting || !account}
                              value={(vendors || [])
                                .map(toprisk => ({
                                  value: toprisk.id,
                                  label: toprisk.name
                                }))
                                .filter(
                                  item => item.value === props.values.vendorId
                                )}
                              label="Vendor"
                              onChange={({ value }, { action }) => {
                                if (
                                  ["select-option", "remove-value"].includes(
                                    action
                                  )
                                ) {
                                  props.setFieldValue("vendorId", value);
                                } else if (action === "clear") {
                                  props.setFieldValue("vendorId", []);
                                }
                              }}
                              options={(vendors || []).map(vendor => ({
                                value: vendor.id,
                                label: vendor.name
                              }))}
                              className={[
                                classes.textField,
                                classes.boxTextField
                              ].join(" ")}
                              name="vendorId"
                              labelStyle={{ width: "100%" }}
                              width="100%"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <ExpansionPanel
                    expanded={panels.analyse}
                    onChange={this.handleChangePanel("analyse")}
                  >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <p className={classes.titleDivider}>Analyse</p>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container item xs={12} sm={12} spacing={32}>
                        <Grid item xs={12} sm={6}>
                          <MuiFormControl
                            className={[
                              classes.textField,
                              classes.boxTextField
                            ].join(" ")}
                            error={
                              props.errors.risklabelId &&
                              props.touched.risklabelId
                            }
                          >
                            <InputLabel htmlFor="risklabelId">
                              Risk Area
                            </InputLabel>
                            <Select
                              disabled={props.isSubmitting || !account}
                              value={props.values.risklabelId}
                              onChange={props.handleChange}
                              name="risklabelId"
                            >
                              {labels.map(label => (
                                <MenuItem
                                  key={`label-${label.id}`}
                                  value={label.id}
                                >
                                  {label.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {props.touched.risklabelId &&
                              props.errors.risklabelId && (
                                <FormHelperText>
                                  {props.errors.risklabelId}
                                </FormHelperText>
                              )}
                          </MuiFormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            classes={classes}
                            error={
                              props.touched.symptoms && props.errors.symptoms
                            }
                          >
                            {" "}
                            <RichTextArea
                              {...{
                                title: "Symptoms",
                                text: props.values.symptoms,
                                name: "symptoms",
                                isEditing: true,
                                disabled: props.isSubmitting,
                                handleChange: props.handleChange
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            classes={classes}
                            error={
                              props.touched.projectImpact &&
                              props.errors.projectImpact
                            }
                          >
                            <RichTextArea
                              {...{
                                title: "Impact Statement",
                                text: props.values.projectImpact,
                                name: "projectImpact",
                                isEditing: true,
                                disabled: props.isSubmitting,
                                handleChange: props.handleChange
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <ReactSelectMUI
                            disabled={props.isSubmitting || !account}
                            value={top
                              .map(toprisk => ({
                                value: toprisk.id,
                                label: toprisk.name
                              }))
                              .filter(item => {
                                return (
                                  (props.values.toprisksIds || []).indexOf(
                                    item.value
                                  ) > -1
                                );
                              })}
                            label="Top Risks"
                            onChange={(values, { action }) => {
                              if (
                                ["select-option", "remove-value"].includes(
                                  action
                                )
                              ) {
                                const selectedValues = values.map(
                                  item => item.value
                                );
                                props.setFieldValue(
                                  "toprisksIds",
                                  selectedValues
                                );
                              } else if (action === "clear") {
                                props.setFieldValue("toprisksIds", []);
                              }
                            }}
                            options={top.map(toprisk => ({
                              value: toprisk.id,
                              label: toprisk.name
                            }))}
                            className={[
                              classes.textField,
                              classes.boxTextField
                            ].join(" ")}
                            name="toprisksIds"
                            isMulti
                            labelStyle={{ width: "100%" }}
                            width="100%"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <MuiFormControl
                            className={[
                              classes.numberField,
                              classes.boxTextField
                            ].join(" ")}
                            error={props.errors.impact && props.touched.impact}
                          >
                            <InputLabel htmlFor="impact">Impact</InputLabel>
                            <Select
                              disabled={
                                props.isSubmitting ||
                                !account ||
                                noRiskImpactItems
                              }
                              value={props.values.impact}
                              onChange={props.handleChange}
                              name="impact"
                            >
                              {noRiskImpactItems ? (
                                <MenuItem value={0}>No Items</MenuItem>
                              ) : (
                                riskImpact.map(impact => (
                                  <MenuItem
                                    key={`impact-${impact.value}`}
                                    value={impact.value}
                                  >
                                    {impact.label}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {props.touched.impact &&
                              props.errors.impact && (
                                <FormHelperText>
                                  {props.errors.impact}
                                </FormHelperText>
                              )}
                          </MuiFormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <MuiFormControl
                            className={[
                              classes.numberField,
                              classes.boxTextField
                            ].join(" ")}
                            error={
                              props.errors.probability &&
                              props.touched.probability
                            }
                          >
                            <InputLabel htmlFor="probability">
                              Probability
                            </InputLabel>
                            <Select
                              disabled={
                                props.isSubmitting ||
                                !account ||
                                noRiskLikelihoodItems
                              }
                              value={props.values.probability}
                              onChange={props.handleChange}
                              name="probability"
                            >
                              {noRiskLikelihoodItems ? (
                                <MenuItem value={0}>No Items</MenuItem>
                              ) : (
                                riskLikelihood.map(likelihood => (
                                  <MenuItem
                                    key={`probability-${likelihood.value}`}
                                    value={likelihood.value}
                                  >
                                    {likelihood.label}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {props.touched.probability &&
                              props.errors.probability && (
                                <FormHelperText>
                                  {props.errors.probability}
                                </FormHelperText>
                              )}
                          </MuiFormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl classes={classes}>
                            <TextField
                              className={classes.numberField}
                              label="Rating"
                              name="rating"
                              value={
                                props.values.impact * props.values.probability
                              }
                              readOnly
                              disabled
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <ExpansionPanel
                    expanded={panels.responsePlan}
                    onChange={this.handleChangePanel("responsePlan")}
                  >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <p className={classes.titleDivider}>Response Plan</p>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container item xs={12} sm={12} spacing={32}>
                        <Grid item xs={12} sm={6}>
                          <MuiFormControl
                            className={[
                              classes.textField,
                              classes.boxTextField
                            ].join(" ")}
                            error={
                              props.errors.risktreatmentId &&
                              props.touched.risktreatmentId
                            }
                          >
                            <InputLabel htmlFor="risktreatmentId">
                              Risk Treatment
                            </InputLabel>
                            <Select
                              disabled={props.isSubmitting || !account}
                              value={props.values.risktreatmentId}
                              onChange={props.handleChange}
                              name="risktreatmentId"
                            >
                              {treatments.map(treatment => (
                                <MenuItem
                                  key={`treatment-${treatment.id}`}
                                  value={treatment.id}
                                >
                                  {treatment.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {props.touched.risktreatmentId &&
                              props.errors.risktreatmentId && (
                                <FormHelperText>
                                  {props.errors.risktreatmentId}
                                </FormHelperText>
                              )}
                          </MuiFormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            classes={classes}
                            error={
                              props.touched.responseStrategy &&
                              props.errors.responseStrategy
                            }
                          >
                            <RichTextArea
                              {...{
                                title: "Response Strategy",
                                text: props.values.responseStrategy,
                                name: "responseStrategy",
                                isEditing: true,
                                disabled: props.isSubmitting,
                                handleChange: props.handleChange
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            classes={classes}
                            error={
                              props.touched.triggers && props.errors.triggers
                            }
                          >
                            <RichTextArea
                              {...{
                                text: props.values.triggers,
                                title: "Triggers",
                                name: "triggers",
                                isEditing: true,
                                disabled: props.isSubmitting,
                                handleChange: props.handleChange
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            classes={classes}
                            error={
                              props.touched.contingencyPlan &&
                              props.errors.contingencyPlan
                            }
                          >
                            <RichTextArea
                              {...{
                                title: "Contingency Plan",
                                text: props.values.contingencyPlan,
                                name: "contingencyPlan",
                                isEditing: true,
                                disabled: props.isSubmitting,
                                handleChange: props.handleChange
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <MuiFormControl
                            className={[
                              classes.numberField,
                              classes.boxTextField
                            ].join(" ")}
                            error={
                              props.errors.residualImpact &&
                              props.touched.residualImpact
                            }
                          >
                            <InputLabel htmlFor="residualImpact">
                              Residual Impact
                            </InputLabel>
                            <Select
                              disabled={
                                props.isSubmitting ||
                                !account ||
                                noRiskImpactItems
                              }
                              value={props.values.residualImpact}
                              onChange={props.handleChange}
                              name="residualImpact"
                            >
                              {noRiskImpactItems ? (
                                <MenuItem value={0}>No Items</MenuItem>
                              ) : (
                                riskImpact.map(impact => (
                                  <MenuItem
                                    key={`impact-${impact.value}`}
                                    value={impact.value}
                                  >
                                    {impact.label}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {props.touched.residualImpact &&
                              props.errors.residualImpact && (
                                <FormHelperText>
                                  {props.errors.residualImpact}
                                </FormHelperText>
                              )}
                          </MuiFormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <MuiFormControl
                            className={[
                              classes.numberField,
                              classes.boxTextField
                            ].join(" ")}
                            error={
                              props.errors.residualProbability &&
                              props.touched.residualProbability
                            }
                          >
                            <InputLabel htmlFor="residualProbability">
                              Residual Probability
                            </InputLabel>
                            <Select
                              disabled={
                                props.isSubmitting ||
                                !account ||
                                noRiskLikelihoodItems
                              }
                              value={props.values.residualProbability}
                              onChange={props.handleChange}
                              name="residualProbability"
                            >
                              {noRiskLikelihoodItems ? (
                                <MenuItem value={0}>No Items</MenuItem>
                              ) : (
                                riskLikelihood.map(likelihood => (
                                  <MenuItem
                                    key={`probability-${likelihood.value}`}
                                    value={likelihood.value}
                                  >
                                    {likelihood.label}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {props.touched.residualProbability &&
                              props.errors.residualProbability && (
                                <FormHelperText>
                                  {props.errors.residualProbability}
                                </FormHelperText>
                              )}
                          </MuiFormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl classes={classes}>
                            <TextField
                              className={classes.numberField}
                              label="Residual Rating"
                              name="residualRating"
                              value={
                                props.values.residualImpact *
                                props.values.residualProbability
                              }
                              readOnly
                              disabled
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <ExpansionPanel
                    expanded={panels.monitor}
                    onChange={this.handleChangePanel("monitor")}
                  >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <p className={classes.titleDivider}>Monitor & Control</p>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container item xs={12} sm={12} spacing={32}>
                        <Grid item xs={12} sm={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                              className={[
                                classes.textField,
                                classes.boxTextField
                              ].join(" ")}
                              disabled={props.isSubmitting}
                              value={props.values.dueDate}
                              onChange={date => {
                                props.setFieldValue("dueDate", date);
                              }}
                              format="DD-MM-YYYY"
                              label="Next Review Date"
                              autoOk
                              emptyLabel=""
                              error={
                                props.errors.dueDate && props.touched.dueDate
                              }
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MuiFormControl
                            className={[
                              classes.textField,
                              classes.boxTextField
                            ].join(" ")}
                            error={
                              props.errors.ownerId && props.touched.ownerId
                            }
                          >
                            <InputLabel htmlFor="ownerId">Owner</InputLabel>
                            <Select
                              disabled={props.isSubmitting}
                              value={props.values.ownerId}
                              onChange={props.handleChange}
                              name="ownerId"
                            >
                              <MenuItem value={null}>No Owner</MenuItem>
                              {owners.map(owner => (
                                <MenuItem
                                  key={`owner-${owner.id}`}
                                  value={owner.id}
                                >
                                  {owner.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {props.touched.ownerId &&
                              props.errors.ownerId && (
                                <FormHelperText>
                                  {props.errors.ownerId}
                                </FormHelperText>
                              )}
                          </MuiFormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl
                            classes={classes}
                            error={
                              props.touched.controls && props.errors.controls
                            }
                          >
                            <RichTextArea
                              {...{
                                text: props.values.controls,
                                title: "Controls",
                                name: "controls",
                                isEditing: true,
                                disabled: props.isSubmitting,
                                handleChange: props.handleChange
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <ExpansionPanel
                    expanded={panels.files}
                    onChange={this.handleChangePanel("files")}
                  >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <p className={classes.titleDivider}>Files</p>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <RiskAttachments
                        files={risk.files}
                        id={risk.id}
                        concatRiskFiles={concatRiskFiles}
                        filterRiskFile={filterRiskFile}
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
              <div style={{ textAlign: "right", marginTop: 20 }}>
                <Button
                  disabled={props.isSubmitting}
                  type="button"
                  variant="contained"
                  onClick={() => {
                    edit({}, false);
                  }}
                >
                  Back
                </Button>
                <Button
                  style={{ marginLeft: 20 }}
                  disabled={props.isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={props.handleSubmit}
                >
                  {props.isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </React.Fragment>
        )}
      />
    );
  }
}

export default withStyles(styles)(EditRisk);
