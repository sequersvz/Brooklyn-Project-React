import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import SearchKitCheckboxOption from "./SearchKitCheckboxOption";

const SearchKitPanelOption = props => {
  let options = null;
  let icon = props.open ? faTimes : faPlus;
  let cyData = `filter_${props.label.replace(/ /g, "_")}_${icon.iconName}`;

  if (props.type === "checkbox") {
    options = (
      <div
        style={{ marginBottom: -10, display: props.open ? "block" : "none" }}
      >
        {props.options.map((option, index) => (
          <SearchKitCheckboxOption
            key={`${option.label}_${index}`}
            label={option.label}
            checked={
              !!props.selected.find(
                selectedOption => selectedOption.label === option.label
              )
            }
            onClick={() => props.handleSelectOption(option)}
          />
        ))}
      </div>
    );
  } else if (props.type === "select") {
    options = (
      <div style={{ marginBottom: -5, marginTop: -5 }}>
        <span
          key={`report_${props.label}`}
          style={{
            display: props.open ? "block" : "none"
          }}
        >
          <Select
            {...props.selectProps}
            onChange={(optionsSelected, action) =>
              props.handleSelectOption({ optionsSelected, action })
            }
            options={props.options}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#683364",
                primary25: "rgba(104, 51, 100, .3)"
              }
            })}
            autoFocus
            value={props.selected}
            isClearable
          />
          <hr />
        </span>
      </div>
    );
  }

  return (
    <span className={"spanSearchKit"}>
      <p
        style={{
          marginBottom: -10,
          marginTop: -10
        }}
      >
        {props.label}
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          icon={icon}
          pull="right"
          color="#555555"
          onClick={props.handlePanelState}
          cy-data={cyData}
        />
      </p>
      <hr />
      {options}
    </span>
  );
};

export default SearchKitPanelOption;
