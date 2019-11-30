import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import RiskLabels from "./RiskLabels";
import RiskMatrix from "../../../components/risk-matrix/RiskMatrix";
import RiskSliders from "./RiskSliders";
import {
  addRiskLabel,
  deleteRiskLabel,
  getRisksLabels,
  addTopRisk,
  deleteTopRisk,
  getTopRisks,
  addRiskTreatment,
  deleteRiskTreatment,
  getRisksTreatments,
  addRiskLifeCycle,
  deleteRiskLifeCycle,
  getRisksLifeCycles
} from "../../../containers/service/risk";
import { editAccount, getAccount } from "../../../containers/service/account";
const styles = () => ({
  root: {
    flexGrow: 1,
    margin: 50
  },
  bodyText: {
    paddingTop: 20,
    paddingBottom: 25
  },
  slider: {
    paddingBottom: 30
  },
  riskTitle: {
    fontSize: "1.6em",
    marginBottom: 15,
    fontWeight: "bold"
  },
  riskMatrix: {
    marginTop: 50
  }
});

const Risk = props => {
  const { classes } = props;
  const [riskLabels, setRiskLabels] = useState([]);
  const [topRisks, setTopRisks] = useState([]);
  const [riskLifeCycles, setRiskLifeCycles] = useState([]);
  const [riskTreatments, setRiskTreatments] = useState([]);
  const [sliders, setSliders] = useState(null);

  const handleOnChange = name => values => {
    if (!name || !values.length) return;
    setSliders({ ...sliders, [name]: values });
  };
  const handleOnAddLabel = type => async name => {
    let label = { name };
    let labels = [];
    if (type === "label") {
      await addRiskLabel(label);
      labels = await getRisksLabels();
      setRiskLabels(labels);
    }
    if (type === "treatment") {
      await addRiskTreatment(label);
      labels = await getRisksTreatments();
      setRiskTreatments(labels);
    }
    if (type === "lifecycle") {
      await addRiskLifeCycle(label);
      labels = await getRisksLifeCycles();
      setRiskLifeCycles(labels);
    }
    if (type === "toprisk") {
      await addTopRisk(label);
      labels = await getTopRisks();
      setTopRisks(labels);
    }
  };

  const handleOnDeleteLabel = type => async id => {
    let labels = [];
    if (type === "label") {
      await deleteRiskLabel(id);
      labels = await getRisksLabels();
      setRiskLabels(labels);
    }
    if (type === "treatment") {
      await deleteRiskTreatment(id);
      labels = await getRisksTreatments();
      setRiskTreatments(labels);
    }
    if (type === "lifecycle") {
      await deleteRiskLifeCycle(id);
      labels = await getRisksLifeCycles();
      setRiskLifeCycles(labels);
    }
    if (type === "toprisk") {
      await deleteTopRisk(id);
      labels = await getTopRisks();
      setTopRisks(labels);
    }
  };

  useEffect(() => {
    const getSliders = async () => {
      let sliders = await getSlidersFromAccount();
      setSliders(sliders);
    };
    getSliders();
  }, []);

  useEffect(() => {
    const getLabels = async () => {
      let riskLabels = await getRisksLabels();
      setRiskLabels(riskLabels);
      let riskTreatments = await getRisksTreatments();
      setRiskTreatments(riskTreatments);
      let riskLyfeCycles = await getRisksLifeCycles();
      setRiskLifeCycles(riskLyfeCycles);
      let topRisks = await getTopRisks();
      setTopRisks(topRisks);
    };
    getLabels();
  }, []);
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid container item xs={12}>
          <Grid item xs={5} sm={5}>
            {sliders && (
              <RiskSliders
                {...props}
                sliders={sliders}
                onChange={handleOnChange}
                onAfterChange={handleOnAfterChange}
              />
            )}
          </Grid>
          <Grid
            container
            item
            xs={7}
            sm={7}
            justify="center"
            className={classes.riskMatrix}
          >
            <RiskMatrix {...{ sliders, cellHeight: 55 }} />
          </Grid>{" "}
        </Grid>
        <RiskLabels
          title={"Risk Areas / Labels"}
          labels={riskLabels}
          handleOnAddLabel={handleOnAddLabel("label")}
          handleOnDeleteLabel={handleOnDeleteLabel("label")}
          {...props}
        />
        <RiskLabels
          title={"Risk Treatments"}
          labels={riskTreatments}
          handleOnAddLabel={handleOnAddLabel("treatment")}
          handleOnDeleteLabel={handleOnDeleteLabel("treatment")}
          {...props}
        />
        <RiskLabels
          title={"Risk Life Cycles"}
          labels={riskLifeCycles}
          handleOnAddLabel={handleOnAddLabel("lifecycle")}
          handleOnDeleteLabel={handleOnDeleteLabel("lifecycle")}
          {...props}
        />
        <RiskLabels
          title={"Risk Top Risks"}
          labels={topRisks}
          handleOnAddLabel={handleOnAddLabel("toprisk")}
          handleOnDeleteLabel={handleOnDeleteLabel("toprisk")}
          {...props}
        />
      </Grid>
    </div>
  );
};

const handleOnAfterChange = name => async values => {
  if (!name || !values.length) return;

  const options = values.reduce((prev, value, index) => {
    const columnName = `risk${name.charAt(0).toUpperCase()}${name.slice(1)}${
      values.length > 1 ? ++index : ""
    }`;
    return { ...prev, [columnName]: value };
  }, {});

  await editAccount(1, options);
};

const getSlidersFromAccount = async () => {
  const account = await getAccount(1);

  const {
    riskImpact1,
    riskImpact2,
    riskImpact3,
    riskImpact4,
    riskImpact5,
    riskTolerance,
    riskLikelihood1,
    riskLikelihood2,
    riskLikelihood3,
    riskLikelihood4,
    riskLikelihood5
  } = account;
  let likelihood = [
    riskLikelihood1,
    riskLikelihood2,
    riskLikelihood3,
    riskLikelihood4,
    riskLikelihood5
  ];
  let tolerance = [riskTolerance];
  let impact = [
    riskImpact1,
    riskImpact2,
    riskImpact3,
    riskImpact4,
    riskImpact5
  ];
  if (impact.indexOf(null) > -1) {
    impact = [10, 20, 40, 60, 80];
  }
  if (tolerance.indexOf(null) > -1) {
    tolerance = [10];
  }
  if (likelihood.indexOf(null) > -1) {
    likelihood = [10, 20, 40, 60, 80];
  }
  let sliders = { impact, likelihood, tolerance };
  return sliders;
};

export default withStyles(styles)(Risk);
