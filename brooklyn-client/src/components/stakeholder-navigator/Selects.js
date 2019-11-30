import React from "react";
import Select from "../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";
import Grid from "@material-ui/core/Grid";

const StakeholderSelects = props => {
  return (
    <Grid container className={props.className}>
      <Grid item xs={4}>
        <Select
          options={props.vendors}
          onChange={props.handleSelectVendor}
          value={props.selectedVendor}
          label="Select Vendor"
          name="Vendor"
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          options={[{ label: "No group", value: "" }].concat(props.groups)}
          onChange={props.handleSelectGroup}
          value={props.selectedGroup}
          name="Group"
          label="Select Group"
        />
      </Grid>
    </Grid>
  );
};

export default StakeholderSelects;
