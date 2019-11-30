import React, { Component } from "react";
import "./assurance.css";
import { withRouter } from "react-router-dom";
import Loading from "../loading-spinner";
import { Row, Col } from "react-bootstrap";
import Speedometer from "../speedometer";
import AddReviewModal from "../reviews/modals/addReview.modal";
import iconsDataStructure from "./structure.icons";
import FixedIcons from "../fixed-icon/fixed.icons";
import BrooklynLineChart from "./brooklynLineChart";
import reviewsPriorYearChart from "./reviewsPriorYearChartStructure";
import pinnedCheckpointsPriorYearChart from "./pinnedCheckpointsPriorYearChartStructure";
import Searchkit from "../search-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "../loading-spinner";
import ReviewsTimeline from "./ReviewsTimeline";

class LayoutAssurance extends Component {
  constructor(props) {
    super();
    props.changeLoad(true);
  }

  clickHandler = props => {
    if (props.item !== null) {
      this.props.history.push("/assurance/review/" + props.item);
    }
  };

  render() {
    const { addReview, showModalAddReview } = this.props;
    const {
      openModal,
      vendorsRankings,
      reviewsStatistics,
      checkpointsStatistics,
      loadingReviews,
      queryFilters
    } = this.props;
    const { closeModalEvent } = this.props;
    let { reviews } = this.props;
    const openModalReview = () => openModal("showModalAddReview");
    const goToRoute = route => () => this.props.history.push(route);
    const modalHandldersReview = {
      show: showModalAddReview,
      addReview,
      closeModalEvent
    };

    if (reviewsStatistics) {
      reviewsPriorYearChart[0].values = reviewsStatistics.map(coordinates => {
        let month = `${coordinates.abscisa}-01`;
        return { x: month, y: coordinates.ordinates.espected };
      });
      reviewsPriorYearChart[1].values = reviewsStatistics.map(coordinates => {
        let month = `${coordinates.abscisa}-01`;
        return { x: month, y: coordinates.ordinates.real };
      });
    }
    if (checkpointsStatistics) {
      pinnedCheckpointsPriorYearChart[0].values = checkpointsStatistics.map(
        coordinates => {
          let month = `${coordinates.abscisa}-01`;
          return { x: month, y: coordinates.coordinates.checkpointsPinned };
        }
      );
      pinnedCheckpointsPriorYearChart[1].values = checkpointsStatistics.map(
        coordinates => {
          let month = `${coordinates.abscisa}-01`;
          return {
            x: month,
            y: coordinates.coordinates.checkpointsPinnedClosed
          };
        }
      );
    }
    pinnedCheckpointsPriorYearChart[0].yDomain[1] = pinnedCheckpointsPriorYearChart[0].values
      .map(value => value.y)
      .sort()
      .reverse()[0];
    pinnedCheckpointsPriorYearChart[0].yDomain[1] += pinnedCheckpointsPriorYearChart[1].values
      .map(value => value.y)
      .sort()
      .reverse()[0];
    pinnedCheckpointsPriorYearChart[0].yDomain[1] =
      pinnedCheckpointsPriorYearChart[0].yDomain[1] * 2;
    reviewsPriorYearChart[0].yDomain[1] =
      reviewsPriorYearChart[0].values
        .map(value => value.y)
        .sort()
        .reverse()[0] + 10;

    let showLineChart = (
      <div>
        <BrooklynLineChart
          data={reviewsPriorYearChart}
          yAxisLabel="Reviews"
          xAxisLabel="Months"
        />
        <BrooklynLineChart
          data={pinnedCheckpointsPriorYearChart}
          yAxisLabel="Checkpoints"
          xAxisLabel="Months"
        />
      </div>
    );
    const handlerIconsStructure = {
      openModalReview,
      goToRoute: goToRoute
    };

    const iconsData = iconsDataStructure(handlerIconsStructure);
    let { load } = this.props;
    const LoadingReviewsSpinner = () => (
      <LoadingSpinner height={450} size={100} text="Loading Reviews..." />
    );

    return (
      <React.Fragment>
        <Loading load={this.props.load} />
        <div
          className="col-md-12"
          style={{ display: load === true ? "none" : "block" }}
        >
          <Searchkit
            getAllWithFilters={this.props.getAssuranceData}
            allowFirstLoad
          >
            <Row className="show-grid">
              <Col md={12}>
                <Row className="show-grid">
                  <Col lg={12} sm={12}>
                    <button
                      className="btnReload"
                      onClick={() => {
                        let filters = queryFilters || {};
                        this.props.getAssuranceData(filters);
                      }}
                    >
                      Reset <FontAwesomeIcon icon={faRedo} />
                    </button>
                    <div className="timeLine customBox">
                      {loadingReviews ? (
                        <LoadingReviewsSpinner />
                      ) : (
                        <ReviewsTimeline
                          reviews={reviews}
                          clickHandler={this.clickHandler}
                        />
                      )}
                    </div>
                  </Col>
                  <Col lg={8} sm={12}>
                    {showLineChart}
                  </Col>
                  <Col lg={4} sm={12}>
                    <Speedometer data={vendorsRankings} layout={"assurance"} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Searchkit>
        </div>
        <FixedIcons iconsData={iconsData} />
        {!this.props.firstLoad &&
          showModalAddReview && <AddReviewModal {...modalHandldersReview} />}
      </React.Fragment>
    );
  }
}

export default withRouter(LayoutAssurance);
