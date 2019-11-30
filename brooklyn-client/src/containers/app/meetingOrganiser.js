import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import {
  getReviewById,
  editReviewById,
  editReviewAttendeesById,
  getMeetingItems,
  attendeeApologies
} from "../../containers/service/review";
import {
  actionReviewItem,
  sortItemreviews,
  editItemreview,
  addReviewitemFile,
  deleteReviewItem,
  getItemreviews,
  addReviewItem,
  getCheckpoints,
  addRisk
} from "../../containers/service/itemreview";
import { sortCategories } from "../../containers/service/category.service";
import { getUserOwners } from "../../containers/service/user";
import { API } from "aws-amplify";
import { orderAlphabetically } from "../../actions/utils/sortByKey";
import LayoutMeetingOrganiser from "../../components/meeting-organiser/index";
import moment from "moment";
import { monthNames } from "../../config/config";
import MainContainerParentAttachments from "../parentContainers/attachments.container";
import { getAllEntities } from "../../containers/service/root.service";
import { getLogo } from "../service";
const getAllGroups = getAllEntities("user/groups");
const getAllKeyprocess = getAllEntities("keyprocess");

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

class MeetingOrganiserContainer extends React.PureComponent {
  state = {
    loadingReview: false,
    errorLoadingReview: false,
    review: {},
    updatingReview: false,
    errorUpdatingReview: false,
    editing: {
      reviewTitle: false,
      date: false,
      time: false,
      objectives: false,
      attenees: false,
      panel1: true,
      panel2: false,
      panel3: false
    },
    meetingItems: [],
    items: [],
    attendeesSelected: null,
    title: "",
    showUploadingMessage: {},
    openPanel: {},
    handlerModalRemove: {},
    disableExport: false,
    disableSaveButton: false,
    isOldReview: undefined,
    showModalDeleteReview: false,
    showModalAddReview: false,
    owners: [],
    request: { addAttendee: false, loadUsers: false },
    errors: { loadUsers: false },
    users: [],
    alert: {
      open: false,
      message: "",
      variant: "success",
      duration: 0
    },
    modals: {
      downloadMinutes: false
    },
    modalRemoveRI: {}
  };
  componentDidMount() {
    const initializers = [
      this.getReview,
      this.getOwners,
      this.getAllGroups,
      this.getAllKeyprocess
    ];
    Promise.all(initializers.map(f => f()));
  }

  onError = erro => {
    console.log(erro);
  };

  closeModal = modalName => this.setState({ [modalName]: false });

  openModal = modalName => this.setState({ [modalName]: true });

  updateItemReviews = ({ itemreviewId, action }, callback) =>
    this.setState(
      prevState => ({
        ...prevState,
        items: prevState.items.map(itemReview => {
          if (itemReview.id === itemreviewId) {
            return {
              ...itemReview,
              actioned: action === "update" ? true : null
            };
          }
          return itemReview;
        })
      }),
      callback
    );

  getItemreviewsBy = (by, onSuccess) =>
    getItemreviews(onSuccess, this.onError)(this.props.reviewId, by);

  getItemreviewsByReviewIdOnsuccess = result => {
    this.setState({
      isLoaded: true,
      items: result
    });
  };

  getItemreviews = () => {
    const onSuccess = this.getItemreviewsByReviewIdOnsuccess;
    let by = ``;
    const requests = [
      () => this.getMeetingItems(this.state.review.id),
      () => this.getItemreviewsBy(by, onSuccess)
    ];
    Promise.all(requests.map(f => f()));
  };

  getReviewOnSuccess = () => async result => {
    if ((result.vendor || {}).logo) {
      try {
        const logo = await getLogo(result.vendor.logo);
        result.vendor.logo = logo;
      } catch (error) {
        console.log(error);
      }
    }
    const attendeesSelected = result.attendees.map(({ user, apologies }) => ({
      value: user.id,
      label: user.name,
      email: user.email,
      organisation: user.organisation,
      apologies: apologies
    }));
    if (result.group) {
      result.group = { label: result.group.name, value: result.group.id };
    }

    this.setState({
      loadingReview: false,
      review: result,
      attendeesSelected
    });
    const requests = [
      this.getItemreviews,
      () => this.getUsers(result.vendorId),
      this.getRemainingDays
    ];
    Promise.all(requests.map(f => f()));
  };
  getReviewOnError = () => {
    this.setState({ loadingReview: false, errorLoadingReview: true });
  };
  _getReviewById = getReviewById(
    this.getReviewOnSuccess(),
    this.getReviewOnError
  );
  getReview = () => {
    this.setState({ loadingReview: true, errorLoadingReview: false });
    this._getReviewById(this.props.reviewId);
  };

  actionReviewItemOnSucces = () => {
    this.props.handleReloadcheck();
    this.getItemreviews();
  };

  _actionReviewItem = actionReviewItem(
    this.actionReviewItemOnSucces,
    this.onError
  );
  getOwnersOnSuccess = result => {
    this.setState({
      owners: result
    });
  };
  getOwners = () => getUserOwners(this.getOwnersOnSuccess)(this.props.reviewId);

  addReviewItemOnSuccess = () => {
    this.props.handleReloadcheck();
    this.props.handleReloadReviewitem();
    this.getItemreviews();
  };

  addReviewItem = addReviewItem(this.addReviewItemOnSuccess, this.onError);

  getMeetingItemsOnSuccess = result => {
    if (!result) return;
    this.setState({ meetingItems: result });
  };

  getMeetingItems = getMeetingItems(
    this.getMeetingItemsOnSuccess,
    this.onError
  );

  editShowUploadingMessage = (idItem, slug) => {
    let showUploadingMessage = Object.assign(
      {},
      this.state.showUploadingMessage
    );
    showUploadingMessage[idItem] = slug;
    this.setState({ showUploadingMessage });
  };
  handleDateChange = async (pickerType, date) => {
    const previousStateDate = this.state.review.date;

    if (pickerType === "date") {
      const previousDate = new Date(previousStateDate);
      const previousHours = previousDate.getHours();
      const previousMinutes = previousDate.getMinutes();
      date = new Date(date);
      date.setHours(previousHours);
      date.setMinutes(previousMinutes);
    }
    await this._editReviewPropertiesById("date", date);
  };

  handleOnAddActionItem = (checkpoint, options) => () => {
    this.addReviewItem(this.state.review.id, checkpoint, options);
  };

  handleOnAddMeetingItem = () => {
    this.addReviewItem(this.state.review.id, null, {
      name: "",
      by: "",
      timeSlot: "",
      description: "",
      attendeesAndComments: "",
      reviewId: this.state.review.id,
      enabled: true,
      closed: false,
      order: 1000,
      mark: null,
      ready: false,
      dueDate: null,
      comment: null,
      ownerId: null,
      deferred: false,
      actioned: null,
      recurring: false,
      importance: null,
      reviewClosedIn: null,
      itemreviewParent: null
    });
  };

  handleReviewChange = thisEditReview => async (property, value) => {
    if (this.state.review[property] !== value) {
      let properties;
      if (property !== "attendees") {
        properties = {
          body: { [property]: value }
        };
      } else {
        properties = value;
      }

      const preValue = this.state.review[property];

      const _editReviewByIdOnError = () => {
        this.setState(prevState => ({
          ...prevState,
          review: {
            ...prevState.review,
            [property]: preValue
          },
          updatingReview: false,
          errorUpdatingReview: true
        }));
      };

      const _editReviewByIdOnSuccess = () => {
        this.setState({ updatingReview: false });
      };
      const _editReviewById = thisEditReview(
        _editReviewByIdOnSuccess,
        _editReviewByIdOnError
      );
      this.setState(
        prevState => ({
          ...prevState,
          review: {
            ...prevState.review,
            [property]: value
          },
          updatingReview: true,
          errorUpdatingReview: false
        }),
        async () => {
          await _editReviewById(this.props.reviewId, properties);
          this.getRemainingDays();
        }
      );
    }
  };
  addReviewitemFileOnSuccess = () => {
    this.props.handleReloadReviewitem();
    this.editShowUploadingMessage();
    this.getItemreviews();
  };

  _addReviewitemFile = addReviewitemFile(
    this.addReviewitemFileOnSuccess,
    this.onError
  );
  addThunderboltReviewItemOnSuccess = itemReviewId => () => {
    this._editItemreview(itemReviewId, { actioned: true });
    this.props.handleReloadcheck();
    this.props.handleReloadReviewitem();
  };

  addThunderboltReviewItemOnError = itemreview => error => {
    this.onError(error);
    this.updateItemReviews({
      itemreviewId: itemreview.id,
      action: "cancel"
    });
  };

  getCheckpointsOSuccess = itemreview => result => {
    const checkpoint = result.find(({ name }) => name === "New Actions");
    if (!checkpoint) {
      return;
    }

    let options = {
      name: itemreview.name,
      description: itemreview.description,
      itemreviewParent: itemreview.id
    };

    let onSuccess = this.addThunderboltReviewItemOnSuccess(itemreview.id);
    let that = this;
    let onSuccessPost = newActionItem => {
      itemreview.files.forEach(file => {
        that.addReviewitemFile(file.path, newActionItem.id, false);
        onSuccess();
      });
      that.getItemreviews();
    };
    addReviewItem(
      onSuccessPost,
      this.addThunderboltReviewItemOnError(itemreview)
    )(this.state.review.id, checkpoint.id, options);
  };

  addThunderboltReviewItem = itemreview => {
    this.updateItemReviews(
      { itemreviewId: itemreview.id, action: "update" },
      async () => {
        try {
          await API.patch("UsersAPI", `/itemreviews/${itemreview.id}`, {
            body: { actioned: true }
          });
          getCheckpoints(this.getCheckpointsOSuccess(itemreview), this.onError);
        } catch (error) {
          this.updateItemReviews({
            itemreviewId: itemreview.id,
            action: "cancel"
          });
        }
      }
    );
  };

  handleEdit = (field, value) => {
    this.setState(prevState => ({
      ...prevState,
      editing: {
        ...prevState.editing,
        [field]: value
      }
    }));
  };

  isOldReview = reviewDate => {
    let currentDateMinus7 = new Date();
    currentDateMinus7.setDate(currentDateMinus7.getDate() - 7);
    reviewDate = new Date(reviewDate);
    return reviewDate.getTime() <= currentDateMinus7.getTime();
  };

  getReviewDate = reviewDate => {
    const date = moment(reviewDate);
    const month = monthNames[date.month()];
    const dateFormat = date.format("DD-MM-YYYY");
    return `${dateFormat.split("-")[0]} ${month} ${date.year()}`;
  };

  getRemainingDays = review => {
    let one_day = 1000 * 60 * 60 * 24;
    let currentDate = new Date().getTime();
    if (!review) {
      return;
    }

    let reviewDateAdd7 = new Date(review.date).setDate(
      new Date(review.date).getDate() + 7
    );

    let difference_ms = reviewDateAdd7 - currentDate;
    let remainingDays = Math.round(difference_ms / one_day);
    if (remainingDays < 0) {
      remainingDays = "You can't edit this";
    } else {
      remainingDays = remainingDays + " days left to edit this";
    }

    let showOverDateTriangle = new Date(review.date).getTime() < currentDate;
    this.setState({ remainingDays, showOverDateTriangle });
  };

  getHours = hours => {
    if (hours > 12) {
      hours = parseInt(hours, 10) - 12;
    }
    return `${hours < 10 ? "0" : ""}${hours}`;
  };

  getReviewTime = reviewDate => {
    const date = new Date(reviewDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${this.getHours(hours)}:${minutes < 10 ? "0" : ""}${minutes} ${
      hours < 12 ? "AM" : "PM"
    }`;
  };

  sortItemreviewsOnSucess = () => () => {
    this.getItemreviews();
  };

  _sortItemreviews = sortItemreviews(
    this.sortItemreviewsOnSucess,
    this.onError
  );

  sortCategoriesOnSucess = () => {
    this.getItemreviews();
  };

  sortCategories = sortCategories(this.sortCategoriesOnSucess, this.onError);

  editItemreviewOnSuccess = itemreviewId => () => {
    this.dontShowEditing(itemreviewId);
    this.props.handleReloadReviewitem();
    this.getItemreviews();
  };

  dontShowEditing = itemreviewId => {
    this.setState(prevState => ({
      ...prevState,
      showEdit: { ...prevState.showEdit, [itemreviewId]: false },
      showByEdit: { ...prevState.showByEdit, [itemreviewId]: false },
      showTimeSlotEdit: {
        ...prevState.showTimeSlotEdit,
        [itemreviewId]: false
      },
      showAttendeesEdit: {
        ...prevState.showAttendeesEdit,
        [itemreviewId]: false
      },
      showDescriptionEdit: {
        ...prevState.showDescriptionEdit,
        [itemreviewId]: false
      },
      itemreviewBy: undefined,
      itemreviewName: undefined,
      itemreviewTimeSlot: undefined,
      itemreviewAttendees: undefined,
      itemreviewDescription: undefined
    }));
  };

  updateEditingField = (id, field) => {
    this.setState({
      [field]: {
        [id]:
          typeof this.state[field] !== "undefined"
            ? !this.state[field][id]
            : true
      }
    });
  };

  updateItemReviews = ({ itemreviewId, action }, callback) =>
    this.setState(
      prevState => ({
        ...prevState,
        items: prevState.items.map(itemReview => {
          if (itemReview.id === itemreviewId) {
            return {
              ...itemReview,
              actioned: action === "update" ? true : null
            };
          }
          return itemReview;
        })
      }),
      callback
    );
  deleteReviewItemOnSuccess = () => {
    this.setState({ modalRemoveRI: {} }, () => {
      this.props.handleReloadReviewitem();
      this.getItemreviews();
    });
  };
  _deleteReviewItem = deleteReviewItem(
    this.deleteReviewItemOnSuccess,
    this.onError
  );
  _editItemreview = (id, props) => {
    const editName = Reflect.has(props, "name");
    const editTimeSlot = Reflect.has(props, "timeSlot");
    const editBy = Reflect.has(props, "by");

    if (editName || editTimeSlot || editBy) {
      this.setState(
        prevState => ({
          ...prevState,
          showEdit: { ...prevState.showEdit, [id]: false },
          showByEdit: { ...prevState.showByEdit, [id]: false },
          showTimeSlotEdit: {
            ...prevState.showTimeSlotEdit,
            [id]: false
          },
          items: prevState.items.map(item => {
            if (item.id === id) {
              return { ...item, ...props };
            }
            return item;
          })
        }),
        () => {
          editItemreview(() => {}, this.onError)(id, props);
        }
      );
    } else {
      editItemreview(this.editItemreviewOnSuccess, this.onError)(id, props);
    }
  };
  _editReviewAttendeesById = this.handleReviewChange(editReviewAttendeesById);
  _editReviewPropertiesById = this.handleReviewChange(editReviewById);

  addAttendee = name => {
    this.setState(
      prevState => ({
        ...prevState,
        request: {
          ...prevState.request,
          addAttendee: true
        }
      }),
      async () => {
        try {
          const options = {
            body: {
              name,
              email: null,
              phoneNumber: "",
              vendorId: this.state.review.vendorId,
              cognitoId: "",
              role: "user",
              notificationPreference: ""
            }
          };
          let user = await API.post("UsersAPI", `/user`, options);
          user = {
            value: user.id,
            label: user.name,
            email: user.email,
            organisation: user.organisation
          };
          this.setState(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              addAttendee: false
            },
            users:
              prevState.users.length > 0
                ? prevState.users.concat(user)
                : [user],
            attendeesSelected:
              (prevState.attendeesSelected || []).length > 0
                ? prevState.attendeesSelected.concat(user)
                : [user]
          }));
        } catch (error) {
          this.setState(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              addAttendee: false
            }
          }));
          this.openAlert({
            variant: "error",
            duration: 5000,
            message: "Could not add the attendee"
          });
        }
      }
    );
  };

  getUsers = vendorId => {
    this.setState(
      prevState => ({
        ...prevState,
        request: {
          ...prevState.request,
          loadUsers: true
        },
        errors: {
          ...prevState.errors,
          loadUsers: false
        }
      }),
      async () => {
        try {
          let users = await API.get("UsersAPI", `/user/vendor/${vendorId}/all`);
          users =
            users.length > 0
              ? users
                  .map(({ name, id, email, organisation }) => ({
                    value: id,
                    label: name,
                    email,
                    organisation
                  }))
                  .sort((user1, user2) =>
                    orderAlphabetically(user1.label, user2.label)
                  )
              : [];
          this.setState(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              loadUsers: false
            },
            users
          }));
        } catch (error) {
          console.log(error);
          this.setState(prevState => ({
            ...prevState,
            request: {
              ...prevState.request,
              loadUsers: false
            },
            errors: {
              ...prevState.errors,
              loadUsers: true
            }
          }));
        }
      }
    );
  };

  processData = (entity, processFunction) =>
    this.setState(
      prevState => ({
        ...prevState,
        [`loading${entity}`]: true,
        [`errorLoading${entity}`]: false
      }),
      async () => {
        const onSuccess = result =>
          this.setState(prevState => ({
            ...prevState,
            [entity]: result.map(item => ({
              label: item.name,
              value: item.id
            }))
          }));
        const onError = error =>
          this.setState(
            prevState => ({
              ...prevState,
              [`loading${entity}`]: false,
              [`errorLoading${entity}`]: true
            }),
            console.log(error)
          );
        await processFunction(onSuccess, onError)();
      }
    );

  getAllGroups = () => this.processData("groups", getAllGroups);
  getAllKeyprocess = () => this.processData("keyprocess", getAllKeyprocess);

  setReviewOrganizer = async () => {
    try {
      const { review } = this.state;
      const { user } = this.props;
      if (review.organizer !== user.id) {
        await API.patch("UsersAPI", `/reviews/${review.id}`, {
          body: { organizer: user.id }
        });
        this.setState(prevState => ({
          ...prevState,
          review: {
            ...prevState.review,
            organizer: user.id
          }
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  attendeeApologiesOnSuccess = (attendeeId, apologies) => () => {
    const attendeChengeIndex = this.state.attendeesSelected.findIndex(
      attendee => attendee.value === attendeeId
    );
    const attendeesSelected = [...this.state.attendeesSelected];
    attendeesSelected[attendeChengeIndex] = {
      ...attendeesSelected[attendeChengeIndex],
      apologies
    };
    this.setState(prevState => ({
      ...prevState,
      attendeesSelected
    }));
  };

  attendeeApologies = (reviewId, attendeeId, apologies) =>
    attendeeApologies(this.attendeeApologiesOnSuccess(attendeeId, apologies))(
      reviewId,
      attendeeId,
      apologies
    );

  addRisk = async itemreview => {
    this.setState(
      prevState => ({
        ...prevState,
        items: prevState.items.map(item => {
          if (item.id === itemreview.id) {
            return {
              ...item,
              riskId: true
            };
          }
          return item;
        })
      }),
      async () => {
        try {
          await addRisk(itemreview);
        } catch (error) {
          console.log(error);
          this.setState(prevState => ({
            ...prevState,
            items: prevState.items.map(item => {
              if (item.id === itemreview.id) {
                return {
                  ...item,
                  riskId: null
                };
              }
              return item;
            })
          }));
        }
      }
    );
  };

  handleDisableExport = state => this.setState({ disableExport: state });
  editshowEdit = id => this.updateEditingField(id, "showEdit");
  editTimeSlotEdit = id => this.updateEditingField(id, "showTimeSlotEdit");
  editByEdit = id => this.updateEditingField(id, "showByEdit");
  editAttendeesEdit = id => this.updateEditingField(id, "showAttendeesEdit");
  editDecriptionEdit = id => this.updateEditingField(id, "showDescriptionEdit");
  downloadIcs = async () => {
    const { review } = this.state;
    const ics = await API.get("UsersAPI", `/reviews/${review.id}/ics`, {});
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + ics);
    element.setAttribute("download", "invite.ics");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  openAlert = ({ message, variant, duration }) =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        open: true,
        variant,
        duration,
        message
      }
    }));

  closeAlert = () =>
    this.setState(prevState => ({
      ...prevState,
      alert: {
        ...prevState.alert,
        open: false
      }
    }));
  render() {
    const {
      items,
      review,
      loadingReview,
      editing,
      attendeesSelected,
      users,
      alert,
      meetingItems,
      request,
      groups,
      keyprocess
    } = this.state;
    const handlers = {
      itemreview: this.props.itemreview,
      showEdit: this.state.showEdit,
      showTimeSlotEdit: this.state.showTimeSlotEdit,
      showByEdit: this.state.showByEdit,
      showAttendeesEdit: this.state.showAttendeesEdit,
      openModal: this.state.openModal,
      closeModal: this.state.closeModal,
      openPanel: this.state.openPanel,
      disableExport: this.state.disableExport,
      categoryNAME: "all",
      editshowEdit: this.editshowEdit,
      editTimeSlotEdit: this.editTimeSlotEdit,
      editByEdit: this.editByEdit,
      editAttendeesEdit: this.editAttendeesEdit,
      editDecriptionEdit: this.editDecriptionEdit,
      handlerPanelOpen: this.handlerPanelOpen,
      showDescriptionEdit: this.state.showDescriptionEdit,
      actionReviewItem: this._actionReviewItem,
      categoryActionId: this.props.categoryActionId,
      sortItemreviews: this._sortItemreviews,
      sortCategories: this.sortCategories,
      deleteReviewItem: this._deleteReviewItem,
      handleOnAdddMeetingItem: this.handleOnAdddMeetingItem,
      setInverseIconActions: this.props.setInverseIconActions,
      isOldReview: this.isOldReview(review.date),
      owners: this.state.owners,
      getOwners: this.getOwners,
      reviewId: this.props.reviewId,
      items,
      review,
      loadingReview,
      editing,
      attendeesSelected,
      setParentState: state =>
        this.setState(prevState => ({ ...prevState, ...state })),
      users,
      request,
      alert,
      meetingItems,
      handleEdit: this.handleEdit,
      editReviewPropertiesById: this._editReviewPropertiesById,
      editReviewAttendeesById: this._editReviewAttendeesById,
      handleDateChange: this.handleDateChange,
      addAttendee: this.addAttendee,
      attendeeApologies: this.attendeeApologies,
      updateItemReviews: this.updateItemReviews,
      addThunderboltReviewItem: this.addThunderboltReviewItem,
      getReviewDate: this.getReviewDate,
      getReviewTime: this.getReviewTime,
      getItemreviews: this.getItemreviews,
      getRemainingDays: this.getRemainingDays,
      remainingDays: this.state.remainingDays,
      showOverDateTriangle: this.state.showOverDateTriangle,
      handleOnAddActionItem: this.handleOnAddActionItem,
      handleDisableExport: this.handleDisableExport,
      setReviewOrganizer: this.setReviewOrganizer,
      closeAlert: this.closeAlert,
      editItemreview: this._editItemreview,
      putAttachments: this.props.attachmentProps.putAttachments(
        this.getItemreviews
      ),
      delAttachments: this.props.attachmentProps.delAttachments(
        this.getItemreviews
      ),
      getAttachments: this.props.attachmentProps.getAttachments,
      openModalRemove: this.props.attachmentProps.openModalRemove,
      closeModalRemove: this.props.attachmentProps.closeModalRemove,
      modalRemove: this.props.attachmentProps.modalRemove,
      editShowUploadingMessage: this.props.attachmentProps
        .editShowUploadingMessage,
      showUploadingMessage: this.props.attachmentProps.showUploadingMessage,
      groups,
      keyprocess,
      handleOnAddMeetingItem: this.handleOnAddMeetingItem,
      downloadIcs: this.downloadIcs,
      modalRemoveRI: this.state.modalRemoveRI,
      openModalRemoveRI: item =>
        this.setState({
          modalRemoveRI: { [item.id]: { show: true, item } }
        }),
      closeModalRemoveRI: () => this.setState({ modalRemoveRI: {} }),
      addRisk: this.addRisk
    };

    return <LayoutMeetingOrganiser {...handlers} />;
  }
}

const mapStateToProps = ({ user }) => ({ user });
const _MainContainerParentAttachments = MainContainerParentAttachments(
  withStyles(styles)(connect(mapStateToProps)(MeetingOrganiserContainer))
);

export default _MainContainerParentAttachments;
