import React from "react";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import Typography from "@material-ui/core/Typography";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const RiskSliders = props => (
  <>
    <SliderSection
      {...{
        name: "likelihood",
        title: "Likelihood / Probability",
        body:
          "How likely is that the risk will crystallise causing the consequence to occur or the probability of it happening",
        range: "",
        step: 0.1,
        min: 0.1,
        max: 100,
        marks: {
          0: "0.1 years",
          100: "+100 years"
        },
        ...props
      }}
    />
    <SliderSection
      {...{
        name: "impact",
        title: "Impact",
        body:
          "If the risk crystallises how large would the impact be on the company",
        range: "",
        included: true,
        step: 0.01,
        min: 0,
        max: 100,
        marks: {
          0: "£ 0m",
          100: "£ 100m"
        },
        ...props
      }}
    />
    <SliderSection
      {...{
        name: "tolerance",
        title: "Appetite / Tolerance",
        body:
          "The company CRO and Board should set the Risk Appetite / Tolerance level. A score outside this needs mitigating controls",
        range: "",
        step: 1,
        min: 1,
        max: 25,
        marks: {
          1: "1",
          25: "25"
        },
        ...props
      }}
    />
  </>
);

const SliderSection = ({
  title,
  body,
  name,
  classes,
  step,
  min,
  max,
  marks,
  sliders,
  onChange,
  onAfterChange
}) => (
  <>
    <Typography variant="h3" gutterBottom className={classes.riskTitle}>
      {title}
    </Typography>
    <Range
      className={classes.slider}
      count={sliders[name].length}
      pushable
      trackStyle={new Array(sliders[name].length).fill({
        backgroundColor: "#4f2857"
      })}
      onAfterChange={onAfterChange(name)}
      onChange={onChange(name)}
      handleStyle={[{ backgroundColor: "#b1b1b1", borderColor: "#4f2857" }]}
      railStyle={{ backgroundColor: "#b1b1b1" }}
      step={step}
      max={max}
      min={min}
      handle={handle}
      marks={marks}
      value={sliders ? sliders[name] : []}
    />
    <Typography variant="body2" gutterBottom className={classes.bodyText}>
      {body}
    </Typography>
  </>
);

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  const fixedValue = value.toFixed(1);
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={fixedValue}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={fixedValue} {...restProps} />
    </Tooltip>
  );
};

export default RiskSliders;
