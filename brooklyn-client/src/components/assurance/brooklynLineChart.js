import React, { Component } from "react";
import { LineChart } from "rd3";
import "./assurance.css";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

class BrooklynLineChart extends Component {
  render() {
    return (
      <Col md={12} className={"brooklynLineChartBox customBox"}>
        <div
          className="brooklynLineChartHeader"
          style={{ width: this.props.data[0].headerTitleWidth }}
        >
          <p>{this.props.data[0].name}</p>
        </div>
        <LineChart
          legend={false}
          data={this.props.data}
          width={"100%"}
          height={154}
          sectorBorderColor={"white"}
          colors={dx => {
            return ["rgb(0, 188, 212)", "#F05B4F"][dx];
          }}
          viewBoxObject={{
            x: 0,
            y: 0,
            width: 600,
            height: 154
          }}
          yAxisTickCount={6}
          xAxisTickInterval={{ unit: "month", interval: 1 }}
          xAxisFormatter={d => {
            return moment(d).format("MMM");
          }}
          xAccessor={d => {
            return new Date(d.x);
          }}
          yAxisLabel={this.props.yAxisLabel}
          xAxisLabel={this.props.xAxisLabel}
          gridHorizontal={false}
          xAxisClassName={"x-axis-element"}
          yAxisClassName={"y-axis-element"}
          xAxisLabelOffset={30}
          yAxisLabelOffset={30}
        />
        <div className="graphLegends">
          <span>
            <FontAwesomeIcon className="circleBlue" icon={faCircle} />{" "}
            {this.props.data[0].legend}
          </span>
          <span>
            <FontAwesomeIcon className="circleRed" icon={faCircle} />{" "}
            {this.props.data[1].legend}
          </span>
        </div>
      </Col>
    );
  }
}

export default BrooklynLineChart;
