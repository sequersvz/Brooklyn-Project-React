import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ReactSelectMUI from "../../../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";
import "./keyprocess.css";
import Dropzone from "./keyprocessAttachments";

class KeyProcessEdit extends Component {
  state = {
    tableValues: {}
  };

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
    const { handlerEdit, handleEnter, item, dependencies } = this.props;
    const { concatKeyProcessFiles, filterKeyProcessFile } = this.props;
    const { tableValues } = this.state;

    const renderTextField = (name, label, type, classN, handlerEdit) => {
      let value = name in tableValues ? tableValues[name] : item[name];
      return (
        <TextField
          label={
            label === "Name"
              ? label
              : `${label}. Once every ${value} week${value > 1 ? "s" : ""}`
          }
          type={type}
          id={name}
          name={name}
          className={classN}
          value={value}
          onBlur={e => {
            if (tableValues[name] !== item[name] && tableValues[name]) {
              handlerEdit(e, item);
            }
          }}
          onKeyPress={handleEnter}
          onChange={this.handleInputChange}
          inputProps={{ ...(type === "number" && { min: "1", step: "1" }) }}
        />
      );
    };
    return (
      <div className="editRoot">
        <Grid item xs={12}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <span
                className={"spanlikealink"}
                onClick={() => this.props.handleShowEditComponentGoBack()}
              >
                Back
              </span>
            </Grid>
          </Grid>
          <Grid container spacing={32}>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={32}>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "name",
                    "Name",
                    "text",
                    "nameTextField",
                    handlerEdit
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ReactSelectMUI
                    id={"eventtypeId"}
                    name={"eventtypeId"}
                    label={"Event Type"}
                    className={"nameTextField"}
                    // disabled={isEditing}
                    value={
                      "eventtypeId" in tableValues
                        ? tableValues["eventtypeId"]
                        : dependencies &&
                          dependencies["eventtypeId"].find(
                            sel => sel.value === item["eventtypeId"]
                          )
                    }
                    onChange={selection => {
                      this.handleInputChange(
                        {
                          target: { value: selection, name: "eventtypeId" }
                        },
                        item
                      );
                    }}
                    onBlur={() => {
                      if (
                        ((tableValues["eventtypeId"] || {}).value || null) !==
                          item["eventtypeId"] &&
                        tableValues["eventtypeId"]
                      ) {
                        handlerEdit(
                          {
                            target: {
                              value: (tableValues["eventtypeId"] || {}).value,
                              name: "eventtypeId"
                            }
                          },
                          item
                        );
                      }
                    }}
                    options={(dependencies || {})["eventtypeId"]}
                    width={"100%"}
                  />
                </Grid>
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <p style={{ float: "left", paddingLeft: 15 }}>Frequency</p>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "tier1Frequency",
                    "Tier 1 ",
                    "number",
                    "nameTextField",
                    handlerEdit
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "tier2Frequency",
                    "Tier 2 ",
                    "number",
                    "nameTextField",
                    handlerEdit
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "tier3Frequency",
                    "Tier 3",
                    "number",
                    "nameTextField",
                    handlerEdit
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "tier4Frequency",
                    "Tier 4 ",
                    "number",
                    "nameTextField",
                    handlerEdit
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderTextField(
                    "tier5Frequency",
                    "Tier 5 ",
                    "number",
                    "nameTextField",
                    handlerEdit
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={5}>
              <Dropzone
                {...{
                  files: (dependencies || {}).files,
                  id: item.id,
                  concatKeyProcessFiles,
                  filterKeyProcessFile
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default KeyProcessEdit;
