import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import CustomTabs from "../../assets/materialComponents/CustomTabs/CustomCard";
import avatar from "./man.png";
import moment from "moment";
import avatar1 from "./man-1.png";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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

class ActionItem extends Component {
  getActionItemText = item => {
    let text = "";
    if (!item.dueDate) {
      text = "assigned to you does not have a due date";
    } else if (moment(item.dueDate).isAfter(new Date())) {
      text = `is due on ${moment(item.dueDate).format("DD-MM-YYYY")}`;
    } else {
      text = `is ${Math.abs(
        moment(item.dueDate).diff(new Date(), "days")
      )} days past its due date on ${moment(item.dueDate).format(
        "DD-MM-YYYY"
      )}`;
    }

    return `The action ${item.title} ${text}`;
  };
  render() {
    const { item } = this.props;

    return (
      <div style={{ paddingBottom: 20 }}>
        <CustomTabs
          date={getDateFormat((item || {}).dueDate)}
          cardDateStyle={tabStyles.date}
          headerColor="warning"
          title={
            <div style={{ cursor: "default" }} className="boxTitle">
              <div className="boxAvatar">
                <img src={avatar} className="avatarManager" alt={""} />
                <img src={avatar1} className="avatarManager" alt={""} />
              </div>
              {item.vendorName}
            </div>
          }
          headerStyle={tabStyles.header}
          cardHeaderClassName={"customTabsHeader"}
          cardBodyContent={
            <CardBodyMessage
              icon={faFire}
              item={item}
              text={this.getActionItemText(item)}
            />
          }
        />
      </div>
    );
  }
}

const CardBodyMessage = ({ icon, text, item }) => (
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
    <Link
      to={`/assurance/review/${item.reviewId}?categoryId=${
        item.categoryId
      }&checkpointId=${item.checkpointId}`}
      style={{
        marginTop: 20,
        fontWeight: "500",
        cursor: "pointer",
        color: "rgb(85, 85, 85)"
      }}
    >
      GO &gt;
    </Link>
  </div>
);

ActionItem.propTypes = {
  item: PropTypes.object
};
export default ActionItem;
