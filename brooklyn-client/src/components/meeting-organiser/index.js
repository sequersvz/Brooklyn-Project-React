import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker
} from "material-ui-pickers";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import { Formik } from "formik";
import * as Yup from "yup";

import VendorLogo from "./vendorLogo";
import "./meetingOrganiser.css";
import CreatableSelect from "react-select/lib/Creatable";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SummaryAgenda from "./summaryAgenda";
import Alert from "../snackbar-alert";
import TextField from "@material-ui/core/TextField";
import SendInviteButton from "./SendInviteButton";
import DownloadButton from "./DownloadButton";
import DownloadMinutesModal from "./modals/DownloadMinutesModal";
import DownloadAgendaModal from "./modals/downloadAgendaModal";
import ActionItems from "./actionItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import RichTextEditor from "../rich-text-editor";
import ReactSelectMUI from "../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";
import ReactTooltip from "react-tooltip";
import renderHTML from "react-render-html";
import { AttendeePologiesIcon } from "../reviewitems/item.icons";

const styles = theme => ({
  root: {
    width: "100%"
  },
  grid: {
    flexGrow: 1,
    textAlign: "left"
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class MeetingOrganiser extends React.PureComponent {
  state = {
    loadingReview: false,
    errorLoadingReview: false,
    review: {},
    updatingReview: false,
    errorUpdatingReview: false,
    allAttendees: [],
    title: "",
    showUploadingMessage: {},
    openPanel: {},
    disableExport: false,
    disableSaveButton: false,
    showModalDeleteReview: false,
    showModalAddReview: false,
    errors: { loadUsers: false },
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    },
    modals: {
      downloadMinutes: false
    },
    modalRemove: {},
    uploadProgress: {}
  };

  handlerPanelOpen = itemId => {
    let assign = {};
    if (typeof this.state.openPanel[itemId] === "undefined") {
      Object.assign(assign, this.state.openPanel, {
        [itemId]: {
          open: true
        }
      });
      this.setState({
        openPanel: assign
      });
    } else if (this.state.openPanel[itemId].open === true) {
      Object.assign(assign, this.state.openPanel, {
        [itemId]: {
          open: false
        }
      });
      this.setState({
        openPanel: assign
      });
    } else if (this.state.openPanel[itemId].open === false) {
      Object.assign(assign, this.state.openPanel, {
        [itemId]: {
          open: true
        }
      });
      this.setState({
        openPanel: assign
      });
    }
  };

  handleDownloadModal = (modal, state) =>
    this.setState(prevState => ({
      ...prevState,
      modals: {
        ...prevState.modals,
        [modal]: state
      }
    }));

  setUploadProgress = (id, progress) => {
    this.setState(prevState => ({
      ...prevState,
      uploadProgress: {
        ...prevState.uploadProgress,
        [id]: progress
      }
    }));
  };

  handleDownloadAgenda = () => this.handleDownloadModal("downloadAgenda", true);

  handleDownloadMinutes = () =>
    this.handleDownloadModal("downloadMinutes", true);

  renderSelect = (name, className, items, defaultItems, isMulti = false) => {
    const { handleEdit, editing, editReviewPropertiesById } = this.props;

    return (
      <ReactSelectMUI
        disabled={!editing === name}
        value={this.state[name] || defaultItems}
        onChange={selection =>
          this.setState(prevState => ({ ...prevState, [name]: selection }))
        }
        autoFocus
        width={200}
        className={className}
        name={name}
        onBlur={() => {
          if (this.state[name]) {
            editReviewPropertiesById(
              name,
              this.state[name].value === "" ? null : this.state[name].value
            );
            handleEdit(name, false);
          }
        }}
        options={items}
        isMulti={isMulti}
      />
    );
  };

  renderGroupSection = (
    label,
    name,
    className,
    items,
    defaultItems,
    isMulti = false
  ) => {
    const { handleEdit, editing, isOldReview } = this.props;
    return (
      <div>
        <p className="customTitle"> {label}:</p>
        {editing[name] ? (
          this.renderSelect(name, className, items, defaultItems, isMulti)
        ) : (
          <p
            onClick={() => {
              if (!isOldReview) {
                handleEdit(name, true);
              }
            }}
            style={{ cursor: "pointer" }}
            data-tip={this.messageIsOldReview()}
          >
            {(defaultItems || {}).label || `Edit ${label}`}
          </p>
        )}
      </div>
    );
  };

  renderOverview = () => {
    const { review, handleEdit, isOldReview } = this.props;
    const minCharsInHtmlTag = 8;
    return (
      <div
        onClick={() => {
          if (!isOldReview) {
            handleEdit("objectives", true);
          }
        }}
        className="objectivesBox"
        data-tip={this.messageIsOldReview()}
      >
        {review.objectives && review.objectives.length > minCharsInHtmlTag ? (
          <span style={{ overflowWrap: "break-word" }}>
            {renderHTML(review.objectives || "")}
          </span>
        ) : (
          <p>Edit Objetives</p>
        )}
      </div>
    );
  };
  handleChangePanel = panel => (event, expanded) => {
    this.props.handleEdit(panel, expanded);
  };
  messageIsOldReview = () => {
    if (this.props.isOldReview) {
      return "can not be modified";
    }
    return "";
  };
  reduceItemsTypes = items => {
    const actionChekpoints = [
      "New Actions",
      "Overdue Actions",
      "Actions (No Date)",
      "Future Actions"
    ];
    const isActionLog = categoryName => categoryName === "Action Log";
    const isMeetingItem = checkpoint => checkpoint === null;
    return items.reduce(
      (itemTypes, item) => {
        const {
          closed,
          deferred,
          ready,
          reviewcheckpointId,
          categoryName,
          checkpointName
        } = item;
        if (
          ready &&
          !isActionLog(categoryName) &&
          !isMeetingItem(reviewcheckpointId)
        ) {
          itemTypes.itemsReady = [...itemTypes.itemsReady, item];
        }
        if (
          isActionLog(categoryName) &&
          actionChekpoints.includes(checkpointName)
        ) {
          itemTypes.actionItems = [...itemTypes.actionItems, item];
        }
        if (
          !ready &&
          (closed || deferred) &&
          !isMeetingItem(reviewcheckpointId) &&
          !isActionLog(categoryName)
        ) {
          itemTypes.itemsCovered = [...itemTypes.itemsCovered, item];
        }
        if (!closed && !deferred && !ready) {
          itemTypes.actionItemsOpen = [...itemTypes.actionItemsOpen, item];
        }

        return itemTypes;
      },
      {
        itemsReady: [],
        actionItems: [],
        itemsCovered: [],
        actionItemsOpen: []
      }
    );
  };

  render() {
    const {
      classes,
      review,
      items,
      loadingReview,
      editing,
      attendeesSelected,
      alert,
      meetingItems,
      handleEdit,
      editReviewPropertiesById,
      editReviewAttendeesById,
      handleDateChange,
      addAttendee,
      handleOnAddActionItem,
      setReviewOrganizer,
      showOverDateTriangle,
      remainingDays,
      groups,
      keyprocess,
      handleOnAddMeetingItem,
      downloadIcs,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI,
      attendeeApologies,
      owners,
      addRisk,
      sortCategories
    } = this.props;

    if (loadingReview) {
      return <p>Loading...</p>;
    }

    const reviewDate = this.props.getReviewDate(review.date);
    const reviewTime = this.props.getReviewTime(review.date);

    const {
      itemsReady,
      actionItems,
      itemsCovered,
      actionItemsOpen
    } = this.reduceItemsTypes(items);
    const meetingAndReviewItems = [
      ...itemsReady,
      ...meetingItems,
      ...itemsCovered
    ].sort((a, b) => a.order - b.order);

    const minutesItems = [...meetingItems, ...itemsCovered];

    const itemHandler = {
      isAgenda: true,
      type: "all",
      itemreview: this.props.itemreview,
      showEdit: this.props.showEdit,
      showTimeSlotEdit: this.props.showTimeSlotEdit,
      showByEdit: this.props.showByEdit,
      showAttendeesEdit: this.props.showAttendeesEdit,
      openModal: this.state.openModal,
      closeModal: this.state.closeModal,
      openPanel: this.state.openPanel,
      categoryNAME: "all",
      editshowEdit: this.props.editshowEdit,
      editTimeSlotEdit: this.props.editTimeSlotEdit,
      editByEdit: this.props.editByEdit,
      editAttendeesEdit: this.props.editAttendeesEdit,
      editDecriptionEdit: this.props.editDecriptionEdit,
      handlerPanelOpen: this.handlerPanelOpen,
      editItemreview: this.props.editItemreview,
      putAttachments: this.props.putAttachments,
      delAttachments: this.props.delAttachments,
      getAttachments: this.props.getAttachments,
      openModalRemove: this.props.openModalRemove,
      closeModalRemove: this.props.closeModalRemove,
      editShowUploadingMessage: this.props.editShowUploadingMessage,
      modalRemove: this.props.modalRemove,
      showUploadingMessage: this.props.showUploadingMessage,
      showDescriptionEdit: this.props.showDescriptionEdit,
      actionReviewItem: this.props.actionReviewItem,
      categoryActionId: this.props.categoryActionId,
      sortItemreviews: this.props.sortItemreviews,
      deleteReviewItem: this.props.deleteReviewItem,
      handleOnAdddMeetingItem: this.props.handleOnAdddMeetingItem,
      setInverseIconActions: this.props.setInverseIconActions,
      addThunderboltReviewItem: this.props.addThunderboltReviewItem,
      isOldReview: this.props.isOldReview,
      owners: this.props.owners,
      getOwners: this.props.getOwners,
      reviewId: this.props.reviewId,
      setUploadProgress: this.setUploadProgress,
      uploadProgress: this.state.uploadProgress,
      users: this.props.users,
      handleOnAddMeetingItem,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI,
      addRisk,
      sortCategories
    };
    const isOldReview = this.props.isOldReview;

    let preAttendees = [];
    if (attendeesSelected !== null) {
      preAttendees = attendeesSelected;
    } else if (review.attendees && review.attendees !== null) {
      preAttendees = review.attendees;
    }

    const downloadHandler = {
      reviewData: this.props.review || {},
      reviewDate,
      vendor: (this.props.review || {}).vendor || {},
      attendees: (attendeesSelected || []).map(({ label }) => label),
      disableExport: this.props.disableExport,
      handleDisableExport: this.props.handleDisableExport,
      modalRemoveRI,
      openModalRemoveRI,
      closeModalRemoveRI
    };

    const downloadMinutesModalHandler = {
      ...downloadHandler,
      type: "closed",
      items: minutesItems,
      show: this.state.modals.downloadMinutes,
      close: () => this.handleDownloadModal("downloadMinutes", false)
    };

    const downloadAgendaModalHandler = {
      ...downloadHandler,
      type: "ready",
      show: this.state.modals.downloadAgenda,
      items: meetingAndReviewItems,
      close: () => this.handleDownloadModal("downloadAgenda", false)
    };

    const groupSelected = (groups || []).find(
      ({ value }) => value === review.groupId
    );
    const keyprocessSelected = (keyprocess || []).find(
      ({ value }) => value === review.keyprocessId
    );

    return (
      <div>
        <div>
          <ExpansionPanel
            expanded={editing.panel1}
            onChange={this.handleChangePanel("panel1")}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                Meeting Details
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <Grid className={classes.root}>
                  <hr className="hrStyle" />
                  <Grid container>
                    <Grid item xs={12}>
                      <div className="logoSize">
                        <VendorLogo vendor={review.vendor} />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.grid}>
                    <Grid item xs={12} sm={3}>
                      <div>
                        <p className="customTitle">Title:</p>
                      </div>
                      {editing.reviewTitle ? (
                        <Formik
                          initialValues={{ notes: review.notes }}
                          validationSchema={Yup.object().shape({
                            notes: Yup.string()
                              .trim()
                              .min(4, "The title is too short")
                              .required("The title cannot be empty")
                          })}
                          onSubmit={values => {
                            handleEdit("reviewTitle", false);
                            editReviewPropertiesById("notes", values.notes);
                          }}
                          render={({ errors, touched, values, ...props }) => (
                            <TextField
                              error={errors.notes && touched.notes}
                              id="notes"
                              name="notes"
                              margin="normal"
                              autoFocus
                              value={values.notes}
                              onChange={props.handleChange}
                              onBlur={props.handleSubmit}
                              aria-describedby="notes-text"
                              style={{
                                width: "100%",
                                marginTop: 0
                              }}
                            />
                          )}
                        />
                      ) : (
                        <p
                          onClick={() => {
                            if (!isOldReview) {
                              handleEdit("reviewTitle", true);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                          data-tip={this.messageIsOldReview()}
                        >
                          {review.notes}
                        </p>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <p className="customTitle">Review Date:</p>
                      <FontAwesomeIcon
                        className="icon"
                        icon={faExclamationTriangle}
                        style={{
                          fontSize: 14,
                          color: "#FA932A",
                          display: showOverDateTriangle
                            ? "inline-block"
                            : "none"
                        }}
                        data-tip={remainingDays}
                        data-place={"right"}
                      />
                      {editing.date ? (
                        <DatePicker
                          value={review.date}
                          minDate="01-01-2009"
                          maxDate="01-01-2024"
                          format="DD-MM-YYYY"
                          onChange={date => handleDateChange("date", date)}
                          onClose={() => handleEdit("date", false)}
                          ref={node => {
                            if (node !== null) {
                              node.open();
                            }
                          }}
                        />
                      ) : (
                        <p
                          onClick={() => {
                            // we allow editing the date even in old reviews
                            handleEdit("date", true);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {reviewDate}
                        </p>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <p className="customTitle">Time:</p>
                      {editing.time ? (
                        <TimePicker
                          value={review.date}
                          onChange={date => handleDateChange("time", date)}
                          onClose={() => handleEdit("time", false)}
                          ref={node => {
                            if (node !== null) {
                              node.open();
                            }
                          }}
                        />
                      ) : (
                        <p
                          onClick={() => {
                            if (!isOldReview) {
                              handleEdit("time", true);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                          data-tip={this.messageIsOldReview()}
                        >
                          {reviewTime}
                        </p>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {this.renderGroupSection(
                        "Group",
                        "groupId",
                        "",
                        [{ label: "", value: "" }, ...(groups || [])],
                        groupSelected
                      )}
                    </Grid>
                  </Grid>
                  <Grid container className={classes.grid}>
                    <Grid item xs={12} sm={3}>
                      <div>
                        <p className="customTitle">Location:</p>
                      </div>
                      {editing.location ? (
                        <Formik
                          initialValues={{ location: review.location }}
                          validationSchema={Yup.object().shape({
                            notes: Yup.string()
                              .trim()
                              .min(4, "The location is too short")
                          })}
                          onSubmit={values => {
                            handleEdit("location", false);
                            editReviewPropertiesById(
                              "location",
                              values.location
                            );
                          }}
                          render={({ errors, touched, values, ...props }) => (
                            <TextField
                              error={errors.location && touched.location}
                              id="location"
                              name="location"
                              margin="normal"
                              autoFocus
                              value={values.location}
                              onChange={props.handleChange}
                              onBlur={props.handleSubmit}
                              aria-describedby="location-text"
                              style={{
                                width: "100%",
                                marginTop: 0
                              }}
                            />
                          )}
                        />
                      ) : (
                        <p
                          onClick={() => {
                            if (!isOldReview) {
                              handleEdit("location", true);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                          data-tip={this.messageIsOldReview()}
                        >
                          {review.location || "Edit Location"}
                        </p>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      {this.renderGroupSection(
                        "Key Process",
                        "keyprocessId",
                        "",
                        [{ label: "", value: "" }, ...(keyprocess || [])],
                        keyprocessSelected
                      )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      {/* //especio para otro campo */}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <p className="customTitle">Attendees:</p>
                      {editing.attendees ? (
                        <CreatableSelect
                          isValidNewOption={(inputValue, _, options) => {
                            const isNotDuplicated = !options
                              .map(option => option.label)
                              .includes(inputValue);
                            const isNotEmpty = inputValue !== "";
                            return isNotEmpty && isNotDuplicated;
                          }}
                          value={preAttendees}
                          name={"attendess"}
                          closeMenuOnSelect={false}
                          onChange={values => {
                            this.props.setParentState({
                              attendeesSelected: values
                            });
                          }}
                          onBlur={() => {
                            setReviewOrganizer();
                            handleEdit("attendees", false);
                            editReviewAttendeesById("attendees", preAttendees);
                          }}
                          isMulti
                          options={(owners || []).map(({ id, name }) => ({
                            label: name,
                            value: id
                          }))}
                          theme={theme => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary: "#683364",
                              primary25: "rgba(104, 51, 100, .3)"
                            }
                          })}
                          autoFocus={true}
                          onCreateOption={addAttendee}
                          isLoading={this.props.request.addAttendee}
                        />
                      ) : (
                        <div data-tip={this.messageIsOldReview()}>
                          {attendeesSelected && attendeesSelected.length > 0 ? (
                            <div>
                              {attendeesSelected.map(attendee => (
                                <div key={attendee.value}>
                                  <p
                                    className="attendeeInput"
                                    onClick={() => {
                                      if (!isOldReview) {
                                        handleEdit("attendees", true);
                                      }
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {`${attendee.label}${
                                      attendee.organisation
                                        ? " - " + attendee.organisation
                                        : ""
                                    }`}
                                  </p>
                                  <div
                                    onClick={() =>
                                      attendeeApologies(
                                        review.id,
                                        attendee.value,
                                        !attendee.apologies
                                      )
                                    }
                                  >
                                    {AttendeePologiesIcon({
                                      icon: attendee.apologies,
                                      style: { cursor: "pointer" }
                                    })}
                                  </div>
                                  <Divider />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              onClick={() => {
                                if (!isOldReview) {
                                  handleEdit("attendees", true);
                                }
                              }}
                            >
                              Add Attendees
                            </p>
                          )}
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div>
                        <p className="customTitle">Objectives:</p>
                      </div>

                      <RichTextEditor
                        {...{
                          text: review.objectives,
                          isEditing: editing.objectives,
                          handleEdit: this.handleEdit,
                          editProperty(field, options) {
                            editReviewPropertiesById(field, options);
                            handleEdit("objectives", false);
                          },
                          property: "objectives",
                          renderOverview: this.renderOverview
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div style={{ textAlign: "right", marginTop: 20 }}>
                        <SendInviteButton onClick={downloadIcs} />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={editing.panel2}
            onChange={this.handleChangePanel("panel2")}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                Summary Agenda
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {editing.panel2 ? (
                <Grid item xs={12} sm={12}>
                  <Divider />
                  <SummaryAgenda
                    {...{
                      ...itemHandler,
                      items: meetingAndReviewItems
                    }}
                  />
                  <div style={{ textAlign: "right", marginTop: 20 }}>
                    <DownloadButton
                      text={"Download Agenda"}
                      onClick={this.handleDownloadAgenda}
                    />
                  </div>
                </Grid>
              ) : (
                ""
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={editing.panel3}
            onChange={this.handleChangePanel("panel3")}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Action Items</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {editing.panel3 ? (
                <Grid item xs={12} sm={12}>
                  <ActionItems
                    {...{
                      itemHandler,
                      items: actionItems,
                      handleOnAddActionItem
                    }}
                  />
                  <div style={{ textAlign: "right", marginTop: 20 }}>
                    <DownloadButton
                      text={"Download Minutes"}
                      onClick={this.handleDownloadMinutes}
                    />
                  </div>
                </Grid>
              ) : (
                ""
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        {this.state.modals.downloadMinutes && (
          <DownloadMinutesModal
            {...{ ...downloadMinutesModalHandler, actionItems }}
          />
        )}
        {this.state.modals.downloadAgenda && (
          <DownloadAgendaModal
            {...{
              ...downloadAgendaModalHandler,
              itemHandler,
              items: meetingAndReviewItems,
              actionItems: actionItemsOpen
            }}
          />
        )}
        <ReactTooltip />
        <Alert
          open={alert.open}
          message={alert.message}
          duration={alert.duration}
          variant={alert.variant}
          handleClose={() => {}}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default withStyles(styles)(connect(mapStateToProps)(MeetingOrganiser));
