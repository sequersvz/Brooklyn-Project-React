import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CreatableSelect from "react-select/lib/Creatable";
import Chip from "@material-ui/core/Chip";
const customStyles = {
  control: provided => ({
    ...provided,
    minWidth: 200
  })
};
const RiskLabels = ({
  labels,
  title,
  classes,
  handleOnAddLabel,
  handleOnDeleteLabel
}) => {
  const mLabels = labels.map(l => ({ value: l.name, label: l.name, id: l.id }));
  const [editing, setEditing] = useState(false);
  return (
    <Grid container item xs={8} sm={8} direction="column">
      <Typography
        variant="h3"
        gutterBottom
        display="block"
        className={classes.riskTitle}
      >
        {title}
      </Typography>
      <div>
        {editing ? (
          <div style={{ marginBottom: 30 }}>
            <CreatableSelect
              isValidNewOption={(inputValue, _, options) => {
                const isNotDuplicated = !options
                  .map(option => option.label)
                  .includes(inputValue);
                const isNotEmpty = inputValue !== "";
                return isNotEmpty && isNotDuplicated;
              }}
              styles={customStyles}
              value={mLabels}
              name={"attendess"}
              closeMenuOnSelect={false}
              noOptionsMessage={() => "Type here to create a new element"}
              onBlur={() => {
                setEditing(false);
              }}
              onChange={(value, { removedValue }) => {
                if (removedValue && removedValue.id) {
                  handleOnDeleteLabel(removedValue.id);
                }
              }}
              isMulti
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#683364",
                  primary25: "rgba(104, 51, 100, .3)"
                }
              })}
              autoFocus={true}
              onCreateOption={handleOnAddLabel}
            />
          </div>
        ) : (
          <div style={{ marginBottom: 30 }}>
            {mLabels && mLabels.length ? (
              mLabels.map(label => (
                <Chip
                  key={label.value}
                  onClick={() => {
                    setEditing(true);
                  }}
                  onDelete={() => handleOnDeleteLabel(label.id)}
                  label={`${label.label}`}
                />
              ))
            ) : (
              <p
                onClick={() => {
                  setEditing(true);
                }}
              >
                Add
              </p>
            )}
          </div>
        )}
      </div>
    </Grid>
  );
};
export default RiskLabels;
