/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
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
    fontSize: 14
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

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      style={{ width: "100%" }}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
      style={{ width: "95%" }}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  const width = (((props.selectProps || {}).textFieldProps || {}).style || {})
    .width;
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
      style={{ minWidth: "fit-content", width }}
    >
      {props.children}
    </Paper>
  );
}
function DropdownIndicator() {
  return (
    <FontAwesomeIcon
      icon={faCaretDown}
      size="1x"
      pull="left"
      color={"grey"}
      style={{
        cursor: "pointer",
        width: 30,
        marginTop: -3
      }}
    />
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  DropdownIndicator,
  IndicatorSeparator: null
};

class ReactSelectMUI extends React.Component {
  render() {
    const {
      classes,
      theme,
      options,
      label,
      onChange,
      onBlur,
      value,
      name,
      width,
      noMarginTop,
      ...all
    } = this.props;
    const {
      InputLabelProps = {},
      isMulti = false
      //   defaultValue = []
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        // maxWidth: 300,
        // width: "auto",
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };

    const valueIsNotEmpty = value => {
      if ("label" in (value || {})) {
        return true;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return false;
    };
    return (
      <div
        className={!noMarginTop ? classes.root : ""}
        style={{ marginTop: !valueIsNotEmpty(value) && !noMarginTop ? 19 : 0 }}
      >
        <NoSsr>
          <label htmlFor={name} style={{ width: "100%" }}>
            {value && valueIsNotEmpty(value) ? label : ""}
            <Select
              name={name}
              classes={classes}
              styles={selectStyles}
              textFieldProps={{
                InputLabelProps: InputLabelProps,
                style: {
                  width: width || 300,
                  whiteSpace: "nowrap",
                  overflowX: "hidden"
                }
              }}
              options={options}
              components={components}
              value={value}
              onChange={onChange}
              placeholder={label}
              isMulti={isMulti}
              onBlur={onBlur}
              {...all}
            />
          </label>
        </NoSsr>
      </div>
    );
  }
}

ReactSelectMUI.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ReactSelectMUI);
