import React, { Component } from "react";
import "./kpiBar.css";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPoundSign,
  faChartPie,
  faChartArea,
  faChartLine,
  faUsers,
  faChartBar,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import { formatToUnits } from "../../../Utils";
import pipeWhite from "./pipe-white.png";

class KpiBar extends Component {
  render() {
    const { vendors, homeData, users } = this.props;
    let ytd = 0;
    let opt = 0;
    let numOpt = 0;
    let srm = 0;
    let rytd = 0;
    let rytd_PER = 0;
    let pipe = 0;
    let checkClosed = 0;
    let checkPinned = 0;
    let score = 0;
    let checkClosedPer = 0;
    let totalVendors = (vendors || []).length;
    let vendorsWithNoSRM = (vendors || []).filter(
      ({ profile }) => !profile[0].manager
    ).length;
    if (homeData) {
      rytd = homeData.reviewsAtNowCount || 0;
      score = homeData.promedioScoreAllVendors || 0;
      rytd_PER =
        homeData.reviewsThisYearCount > 0
          ? (rytd * 100) / homeData.reviewsThisYearCount
          : 0;
      rytd_PER = Math.ceil(rytd_PER);
      pipe = homeData.activityPipeline || 0;
      checkClosed = homeData.checkpointsPinnedClosedCount
        ? homeData.checkpointsPinnedClosedCount
        : 0;
      checkPinned = homeData.checkpointsPinnedCount
        ? homeData.checkpointsPinnedCount
        : 0;
      checkClosedPer = (checkClosed * 100) / checkPinned;
      checkClosedPer = Math.ceil(checkClosedPer);
    }
    if (vendors) {
      srm =
        (users || []).length > 0
          ? vendors.filter(vendor => vendor.profile[0].manager !== null)
              .length / users.length
          : 0;
      vendors.forEach(vendor => {
        ytd +=
          vendor.profile[0].invoiceYtd !== null
            ? parseFloat(vendor.profile[0].invoiceYtd)
            : 0;
        opt +=
          vendor.profile[0].costOptimizations !== null
            ? parseFloat(vendor.profile[0].costOptimizations)
            : 0;
        numOpt +=
          vendor.profile[0].numberOfCostOptimizations !== null
            ? parseInt(vendor.profile[0].numberOfCostOptimizations, 10)
            : 0;
      });
      //hace falta definir los demas valores
    }
    ytd = formatToUnits(ytd, 2);
    opt = formatToUnits(opt);
    let checkpointsClosed =
      !checkClosed || checkClosed === undefined
        ? 0
        : `${checkClosed} (${checkClosedPer} %) `;

    let pipeShow =
      pipe - Math.floor(pipe) !== 0 ? Number(pipe).toFixed(2) : pipe;
    let srmShow = srm - Math.floor(srm) !== 0 ? Number(srm).toFixed(2) : srm;
    return (
      <Row className="show-grid">
        <Col xs={12} lg={12}>
          <Row className="show-grid">
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-kpi header-yellow">
                  <FontAwesomeIcon className="icon" icon={faPoundSign} />
                </div>
                <p>Invoiced YTD</p>
                <h2 className="valueInsideTheKPI" data-cy="InvoicedYTD">
                  £ {ytd}
                </h2>
                <hr />
              </div>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-kpi header-green">
                  <FontAwesomeIcon className="icon" icon={faChartPie} />
                </div>
                <p>Cost Optimizations</p>
                <h2
                  className="valueInsideTheKPI"
                  data-cy="CostOptimizations"
                >{`${numOpt} (£ ${opt})`}</h2>
                <hr />
              </div>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-kpi header-red">
                  <FontAwesomeIcon className="icon" icon={faChartArea} />
                </div>
                <p>Vendors Per SRM</p>
                <h2 className="valueInsideTheKPI" data-cy="VendorsPerSRM">
                  {srmShow}
                </h2>
                <hr />
              </div>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-kpi header-blue">
                  <FontAwesomeIcon className="icon" icon={faChartLine} />
                </div>
                <p>Reviews YTD</p>
                <h2 className="valueInsideTheKPI" data-cy="ReviewsYTD">
                  {`${rytd} (${rytd_PER}%)`}
                </h2>
                <hr />
              </div>
            </Col>
          </Row>
          <Row className="show-grid mt-5">
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-yellow header-lineHeight">
                  <img src={pipeWhite} alt="pipe-line" style={{ width: 40 }} />
                </div>
                <p>Activity Pipeline</p>
                <h2 className="valueInsideTheKPI" data-cy="ActivityPipeline">
                  £ {pipeShow}m
                </h2>
                <hr />
              </div>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-kpi header-green">
                  <FontAwesomeIcon className="icon" icon={faUsers} />
                </div>
                <p>Vendors No SRM : Total</p>
                <h2 className="valueInsideTheKPI" data-cy="VendorsWithNoSRM">
                  {vendorsWithNoSRM} : {totalVendors}
                </h2>
                <hr />
              </div>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-kpi header-red">
                  <FontAwesomeIcon className="icon" icon={faChartBar} />
                </div>
                <p>Vendors Score</p>
                <h2 className="valueInsideTheKPI" data-cy="VendorsScore">
                  {score}
                </h2>
                <hr />
              </div>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <div className="kpi-content customBox">
                <div className="header-kpi header-blue">
                  <FontAwesomeIcon className="icon" icon={faCheck} />
                </div>
                <p>Checkpoints Closed</p>
                <h2 className="valueInsideTheKPI" data-cy="CheckpointsClosed">
                  {checkpointsClosed}{" "}
                </h2>
                <hr />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default KpiBar;
