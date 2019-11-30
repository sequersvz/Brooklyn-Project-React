import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import "./table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import ReactSelectMUI from "../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    overflowY: "auto",
    minHeight: 400
  },
  table: {
    minWidth: 700
  }
});

class DinamicTable extends PureComponent {
  state = {
    tableValues: {}
  };
  validChange(preValue, value) {
    return preValue === value;
  }
  handlerChange(event, item) {
    const value = event.target.value;
    const propertie = event.target.name;
    if (!this.validChange(item[propertie], value)) {
      this.props.edit(item.id, { [propertie]: value });
      this.setState({
        tableValues: {}
      });
    }
  }
  handleEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      tableValues: {
        [name]: value
      }
    });
  };

  render() {
    const { classes } = this.props;
    const {
      items,
      showEdit,
      handlerShowEdit,
      tableSchema,
      del,
      dependencies,
      handleShowEditComponent
    } = this.props;
    const { tableValues } = this.state;
    const handleInputChange = this.handleInputChange;
    const renderSpanItem = (key, index) => text => (
      <span
        onClick={() => handlerShowEdit(key, index)}
        style={{ cursor: "pointer" }}
      >
        {text}
      </span>
    );

    const renderTrashIcon = item => (
      <FontAwesomeIcon
        icon={faTrash}
        pull="right"
        onClick={() => {
          del(item.id);
        }}
        color={"grey"}
        style={{
          cursor: "pointer",
          fontSize: 10,
          marginRight: 10,
          marginTop: 10,
          position: "relative"
        }}
        data-tip="Delete"
      />
    );

    const inputType = ({ item, row, isMulti }) => {
      if (row.type && row.type === "select") {
        return (
          <ReactSelectMUI
            value={
              typeof tableValues[row.name] !== "undefined"
                ? tableValues[row.name]
                : dependencies[row.name].find(
                    _item => _item.value === item[row.name]
                  )
            }
            label={row.label}
            onChange={selection =>
              this.handleInputChange(
                {
                  target: { value: selection, name: row.name }
                },
                item
              )
            }
            onBlur={() => {
              if (row.name in tableValues) {
                this.handlerChange(
                  {
                    target: {
                      value: (tableValues[row.name] || {}).value,
                      name: row.name
                    }
                  },
                  item
                );
              }
              return handlerShowEdit(null, null);
            }}
            autoFocus={true}
            name={row.name}
            style={{
              textAlign: "left"
            }}
            width={430}
            options={dependencies[row.name]}
            isMulti={isMulti || false}
          />
        );
      }
      return (
        <input
          value={
            typeof tableValues[row.name] !== "undefined"
              ? tableValues[row.name]
              : item[row.name]
          }
          name={row.name}
          onBlur={e => {
            if (this.validChange(item[row.name], e.target.value)) {
              return handlerShowEdit(null, null);
            }
            this.handlerChange(e, item);
          }}
          autoFocus={true}
          background={"white"}
          onChange={handleInputChange}
          onKeyPress={e => this.handleEnter(e, item)}
        />
      );
    };
    const renderItem = (item, key, row, index) => {
      const _renderSpanItem = renderSpanItem(key, index);
      return showEdit.key === key &&
        showEdit.index === index &&
        row.editable &&
        !item.isDisabled &&
        !handleShowEditComponent
        ? inputType({ item, row })
        : item[row.name]
          ? _renderSpanItem(
              row.type !== "select"
                ? item[row.name]
                : (
                    (dependencies[row.name] || []).find(
                      _item => _item.value === item[row.name]
                    ) || {}
                  ).label
            )
          : _renderSpanItem(
              <FontAwesomeIcon
                icon={faPencilAlt}
                pull="left"
                color={"grey"}
                style={{
                  cursor: "pointer",
                  fontSize: 10,
                  marginRight: 10,
                  marginTop: 10,
                  position: "relative"
                }}
                data-tip="Edit"
              />
            );
    };

    return (
      <div className={["container", classes.root].join(" ")}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {tableSchema.rowInfo.map((row, index) => (
                <TableCell key={index} align="left">
                  {row.label ? row.label : row.name}
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items &&
              items.map((item, key) => (
                <TableRow
                  className={item.isDisabled && "disabled"}
                  key={item.id}
                >
                  {tableSchema.rowInfo.map((row, index) => (
                    <TableCell
                      key={index}
                      align="left"
                      {...handleShowEditComponent && {
                        style: { cursor: "pointer" },
                        onClick: () =>
                          handleShowEditComponent(item.id, dependencies)
                      }}
                    >
                      {renderItem(item, key, row, index)}
                    </TableCell>
                  ))}
                  {!item.isDisabled && (
                    <TableCell>{renderTrashIcon(item)}</TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <ReactTooltip />
      </div>
    );
  }
}

export default withStyles(styles)(DinamicTable);
