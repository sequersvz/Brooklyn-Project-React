import React from "react";
import Select from "react-select";

const contractStatusSelect = props => (
  <Select
    defaultValue={props.selectedStatus}
    isMulti
    options={props.options}
    onChange={props.onChange}
    theme={theme => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary: "#683364",
        primary25: "rgba(104, 51, 100, .3)"
      }
    })}
  />
);

export default contractStatusSelect;
