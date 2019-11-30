import React, { PureComponent } from "react";
import { Row, Col } from "react-bootstrap";
import ReactSpeedometer from "react-d3-speedometer";
import "./speedometer.css";

class Speedometer extends PureComponent {
  render() {
    const { data } = this.props;
    let actualReviewsMaxValue =
      data && data.reviewTimesInYear
        ? data.reviewTimesInYear <= data.reviewsAtNow
          ? data.reviewsAtNow
          : data.reviewTimesInYear
        : 200;
    let closedReviewItemsMaxValue =
      data && data.reviewItems
        ? data.reviewItems <= data.reviewItemsClosed
          ? data.reviewItemsClosed
          : data.reviewItems
        : 200;
    let actualReviews = data && data.reviewsAtNow ? data.reviewsAtNow : 0;
    let closedReviewItems =
      typeof data !== "undefined" &&
      typeof data.reviewItemsClosed !== "undefined"
        ? data.reviewItemsClosed
        : 0;

    return (
      <div>
        <Row className="show-grid">
          <Col md={12}>
            <div
              className="speedometerBox customBox"
              data-testid="actualReviewSpeedo"
            >
              <div className="speedometerHeader">
                <p>Actual Reviews</p>
              </div>
              <ReactSpeedometer
                width={250}
                height={150}
                value={actualReviews}
                maxValue={actualReviewsMaxValue}
                forceRender={true}
                needleTransitionDuration={2000}
                needleColor="#00bcd4"
                startColor="#ffa21a"
                endColor="#5cb860"
              />
            </div>
          </Col>

          <Col md={12}>
            <div
              className="speedometerBox customBox"
              data-testid="closedReviewSpeedo"
            >
              <div className="speedometerHeader">
                <p>Closed Review Items</p>
              </div>
              <ReactSpeedometer
                width={250}
                height={150}
                value={closedReviewItems}
                maxValue={closedReviewItemsMaxValue}
                forceRender={true}
                needleTransitionDuration={2000}
                needleColor="#00bcd4"
                startColor="#ffa21a"
                endColor="#5cb860"
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Speedometer;
