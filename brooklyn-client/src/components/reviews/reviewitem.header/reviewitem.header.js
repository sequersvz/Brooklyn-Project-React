import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import "../itemreviews.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import VendorLogo from "../../meeting-organiser/vendorLogo";

class RiviewsItemHeader extends PureComponent {
  render() {
    const pDateStyle = {
      paddingRight: 30,
      marginTop: -20,
      textAlign: "right",
      cursor: "default"
    };

    const pReviewTitle = {
      paddingLeft: 30,
      marginTop: -20,
      marginBottom: 10
    };

    const { reviewDate, vendor, reviewTitle, remainingDays } = this.props;
    const { showOverDateTriangle } = this.props;
    return (
      <div>
        <div className="row">
          <div
            className="col-md-6"
            style={{
              ...pReviewTitle,
              cursor: "default"
            }}
          >
            <VendorLogo {...{ vendor }} />
          </div>

          <div className="col-md-6" style={pDateStyle}>
            <p style={{ fontWeight: 700 }}>{reviewTitle}</p>
            <div style={{ display: "inline-flex" }}>
              <FontAwesomeIcon
                className="icon"
                icon={faExclamationTriangle}
                style={{
                  fontSize: 14,
                  marginRight: 10,
                  color: "#FA932A",
                  display: showOverDateTriangle ? "block" : "none"
                }}
                data-tip={`${remainingDays}`}
                data-place={"left"}
              />
              <ReactTooltip />
              <p style={{ cursor: "default" }}>Review date: {reviewDate}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RiviewsItemHeader);
