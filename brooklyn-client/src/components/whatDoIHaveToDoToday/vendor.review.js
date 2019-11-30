import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faThumbsUp,
  faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import CustomTabs from "../../assets/materialComponents/CustomTabs/CustomCard";
import ItemReviews from "./itemreviews";
import avatar from "./man.png";
import moment from "moment";
import avatar1 from "./man-1.png";
import PropTypes from "prop-types";
import { getDateFormat } from "../../Utils";

const tabStyles = {
  date: {
    marginTop: 45,
    fontSize: 14,
    textAlign: "right",
    paddingRight: 20
  },
  header: {
    width: "100%",
    paddingBottom: 5,
    fontSize: 18,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0
  }
};

class VendorReview extends Component {
  render() {
    const {
      vendor,
      donwloadAgendaMessage,
      onTitleClick,
      onAddVendorReview,
      handlerItemreview
    } = this.props;

    const isReviewReady = !!(
      vendor.nextReview && vendor.nextReview.readiness === 1
    );

    const isReviewToday = !!(
      vendor.nextReview &&
      moment(vendor.nextReview.date).isSame(new Date(), "day")
    );

    const meetingMessage = isReviewToday
      ? "It's time for the meeting. Go to meeting organiser"
      : "";

    const nextReviewDate =
      vendor.type === "action-item-vendor"
        ? getDateFormat(vendor.profile[0].contractEndDate)
        : vendor.nextReview
          ? getDateFormat((vendor.nextReview || {}).date)
          : getDateFormat(vendor.topFrequency);

    const hasNoneReviewCheckpointsPinned = !!(
      vendor.nextReview &&
      vendor.nextReview.totalItemreviews === 0 &&
      vendor.nextReview.totalCheckpointsPinned === 0
    );

    return (
      <div style={{ paddingBottom: 20 }}>
        <CustomTabs
          date={nextReviewDate}
          cardDateStyle={tabStyles.date}
          headerColor="warning"
          title={
            <div
              style={{
                cursor: !vendor.nextReview ? "auto" : "pointer"
              }}
              className="boxTitle"
              onClick={onTitleClick(vendor.nextReview)}
            >
              <div className="boxAvatar">
                <img src={avatar} className="avatarManager" alt={""} />
                <img src={avatar1} className="avatarManager" alt={""} />
              </div>
              {vendor.name}{" "}
              {vendor.keyprocess && " - " + vendor.keyprocess.name}
            </div>
          }
          headerStyle={tabStyles.header}
          cardHeaderClassName={"customTabsHeader"}
          cardBodyContent={
            <div>
              {isReviewReady ? (
                this.renderReadyReviewMessage(vendor)
              ) : hasNoneReviewCheckpointsPinned ? (
                this.renderNotPinnedReviewMessage(vendor)
              ) : vendor.nextReview && "id" in vendor.nextReview ? (
                <div>
                  {(meetingMessage || donwloadAgendaMessage) && (
                    <ItemReviews
                      {...handlerItemreview}
                      {...{ review: vendor.nextReview, meetingMessage }}
                      info={
                        <p>{`${meetingMessage || donwloadAgendaMessage}`}</p>
                      }
                    />
                  )}
                  <ItemReviews
                    key={vendor.id}
                    vendor={vendor}
                    {...handlerItemreview}
                    {...{ review: vendor.nextReview }}
                  />
                </div>
              ) : vendor.type === "action-item-vendor" ? (
                this.renderEndContractVendor(vendor, onAddVendorReview)
              ) : (
                this.renderEmptyReviewMessage(vendor, onAddVendorReview)
              )}
            </div>
          }
        />
      </div>
    );
  }

  renderReadyReviewMessage = vendor => {
    return (
      <CardBodyMessage
        icon={faThumbsUp}
        handleOnClick={this.props.onGoClick(vendor.nextReview.id)}
        text={`
          You are all set for this meeting on the
          ${moment(vendor.nextReview.date).format("DD-MM-YYYY")}
          . Forgot something and need to add another
          review item?`}
      />
    );
  };

  renderNotPinnedReviewMessage = vendor => {
    return (
      <CardBodyMessage
        icon={faExclamationTriangle}
        handleOnClick={this.props.onGoClick(vendor.nextReview.id)}
        text={`
          This review has no pinned items. If you have
          some discussion Checkpoints, pin them so they
          show up in your Agenda. Otherwise, consider
          deferring our canceling this Review`}
      />
    );
  };

  renderEmptyReviewMessage = (vendor, onAddVendorReview) => {
    const suggested = moment(vendor.topFrequency).isSameOrBefore(
      moment(),
      "day"
    )
      ? `you should schedule a review with ${vendor.name} as soon as posible`
      : `our policy suggests you would meet them again sometime around ${getDateFormat(
          vendor.topFrequency
        )}`;
    return (
      <CardBodyMessage
        icon={faExclamationTriangle}
        handleOnClick={e => {
          e.preventDefault();
          onAddVendorReview(vendor.id, (vendor.keyprocess || {}).id);
        }}
        text={
          !vendor.nextReview && (vendor.previousReview || {}).date
            ? `
           You last met with ${vendor.name} on ${getDateFormat(
                vendor.previousReview.date
              )} and have no future ${vendor.keyprocess.name} scheduled.\n ${
                vendor.name
              }
           is a Tier ${vendor.profile[0].tierId} vendor; ${suggested}.`
            : `Please schedule your first ${vendor.keyprocess.name} with ${
                vendor.name
              }`
        }
        messageLink="Create Review"
      />
    );
  };

  renderEndContractVendor = (vendor, onAddVendorReview) => {
    return (
      <CardBodyMessage
        icon={faFileSignature}
        handleOnClick={e => {
          e.preventDefault();
          onAddVendorReview(vendor.id);
        }}
        text={`The current contracted service with ${vendor.name}
          comes to an end on ${getDateFormat(
            vendor.profile[0].contractEndDate
          )}.
          To ensure the effective management of this event please create a meeting to assess the ongoing needs of the business and past performance against the contract. 
          `}
        messageLink="Create Review"
      />
    );
  };
}

const CardBodyMessage = ({ icon, text, handleOnClick, messageLink }) => (
  <div
    style={{
      padding: 30,
      fontSize: 14,
      textAlign: "center",
      color: "#555555"
    }}
  >
    <FontAwesomeIcon icon={icon} style={{ fontSize: 60, marginBottom: 15 }} />
    <center style={{ marginBottom: 10 }}>{text}</center>
    <span
      style={{
        marginTop: 20,
        fontWeight: "500",
        cursor: "pointer"
      }}
      onClick={handleOnClick}
    >
      {messageLink ? messageLink : "GO >"}
    </span>
  </div>
);
VendorReview.propTypes = {
  vendor: PropTypes.object,
  donwloadAgendaMessage: PropTypes.string
};
export default VendorReview;
