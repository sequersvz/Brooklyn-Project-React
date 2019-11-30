import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../insight.css";
import insightsMainMod from "../insights-main-mod.png";
import insightsMain from "../insights-main.png";
import insightsMaster from "../insight-master.png";
import Searchkit from "../../search-kit";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";

class InsightMockup extends Component {
  state = {
    showCase: false
  };
  render() {
    const { mockup } = this.props;
    const getAllWithFilters = () => {};
    return (
      <Col md={12}>
        {mockup === "false" ? (
          <Searchkit {...{ getAllWithFilters }}>
            {this.renderMockup()}
          </Searchkit>
        ) : (
          this.renderMockup()
        )}
      </Col>
    );
  }
  renderMockup() {
    const { showMockup, changeMockup, mockup } = this.props;
    let backgroundImageMain;
    let topMainDiv;
    backgroundImageMain =
      showMockup === "insightDashboardChild"
        ? `url(${insightsMaster})`
        : `url(${insightsMain})`;
    topMainDiv = showMockup === "insightDashboardChild" ? -163 : 3;
    if (mockup === "false") {
      backgroundImageMain = `url(${insightsMainMod})`;
    }
    return (
      <Row className="show-grid">
        <Col md={12}>
          <span
            style={{
              width: "21%",
              height: 163,
              float: "right",
              position: "relative",
              top: 48,
              zIndex: 2,
              left: -65,
              display:
                showMockup === "insightDashboard"
                  ? "none"
                  : "block" || this.state.showCase !== true
                    ? "block"
                    : "none",
              cursor: "pointer"
            }}
            onClick={e => {
              e.preventDefault();
              changeMockup("insightShowCase");
            }}
          />
          {this.props.showMockup !== "insightShowCase" && (
            <div
              style={{
                top: topMainDiv
              }}
              onClick={e => {
                e.preventDefault();
                if (mockup === "true") {
                  changeMockup("insightDashboardChild");
                } else {
                  changeMockup("insightDashboardProd");
                }
              }}
            >
              <div
                style={{
                  display: this.state.showCase !== true ? "block" : "none",
                  backgroundImage: backgroundImageMain,
                  backgroundSize: "100%",
                  height: 1350,
                  backgroundRepeat: "no-repeat",
                  cursor: "pointer"
                }}
              >
                <span
                  style={{
                    borderbottom: "none",
                    width: "20%",
                    height: 233,
                    float: "right",
                    position: "relative",
                    top: 180,
                    left: 205,
                    display:
                      showMockup === "insightDashboard"
                        ? "none"
                        : "block" || this.state.showCase !== true
                          ? "block"
                          : "none"
                  }}
                  onClick={e => {
                    e.preventDefault();
                    if (/@brooklynva.com$/.test(this.props.userEmail)) {
                      this.props.history.push("machine-learning-studio");
                    }
                  }}
                />
                <span
                  style={{
                    width: "20%",
                    height: 100,
                    float: "right",
                    position: "relative",
                    top: 418,
                    left: 455,
                    display:
                      showMockup === "insightDashboard"
                        ? "none"
                        : "block" || this.state.showCase !== true
                          ? "block"
                          : "none"
                  }}
                  onClick={e => {
                    e.preventDefault();
                    this.props.history.push("invoice-studio");
                  }}
                />
              </div>
              <span
                style={{
                  width: "18%",
                  height: 163,
                  float: "right",
                  position: "relative",
                  top: 52,
                  left: -65,
                  display:
                    showMockup !== "insightDashboard" &&
                    this.state.showCase === false
                      ? "block"
                      : "none",
                  cursor: "pointer"
                }}
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showCase: true });
                }}
              />
            </div>
          )}
        </Col>
        <Col
          md={12}
          className="insightShowCase"
          style={{
            position: "relative",
            height: 445,
            display: showMockup === "insightShowCase" ? "block" : "none",
            cursor: "pointer",
            width: "100%",
            top: -161
          }}
          onClick={e => {
            e.preventDefault();
            changeMockup("insightDashboardChild");
          }}
        />
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  userEmail: ((state.user || {}).attributes || {}).email || ""
});

export default connect(mapStateToProps)(withRouter(InsightMockup));
