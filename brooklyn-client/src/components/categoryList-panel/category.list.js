import React from "react";
import Select from "react-select";

const CategoryList = props => (
  <Select
    defaultValue={props.selectedStatus}
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

export default CategoryList;
