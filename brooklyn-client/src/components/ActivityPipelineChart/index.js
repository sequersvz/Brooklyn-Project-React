import d3 from "d3";
import React from "react";
import "../home/home.css";
import pipeWhite from "./pipe-white.png";
import { Row, Col } from "react-bootstrap";
import { formatToUnits } from "../../Utils";

class ActivityPipelineChart extends React.Component {
  parseContractsData(contracts) {
    this.Gant.bind({});
    var h = 0;
    var i2 = 0;
    var dg = new Date();
    this.render.bind({});
    var maxAmount = 0;
    var totalAmount = 0;
    let readyContracts = JSON.parse(JSON.stringify(contracts));
    for (var i in readyContracts) {
      readyContracts[i].index = i;

      var numericStart = new Date(readyContracts[i].start);
      // el evento cuyo tiempo ha transcurrido aquí:

      var end = new Date(readyContracts[i].end);

      var monthend = (end.getFullYear() * 12 + end.getMonth()) / 12;

      var monthstart =
        (numericStart.getFullYear() * 12 + numericStart.getMonth()) / 12;

      var max = Math.max(
        monthstart,
        (dg.getFullYear() * 12 + dg.getMonth()) / 12
      );
      var transcurso = monthend - max;

      if (i2 === 0) {
        i2 = monthstart;
      }

      h = Math.max(h, monthend);

      i2 = Math.min(i2, monthstart);

      readyContracts[i].duration = transcurso;

      readyContracts[i].numericStart =
        max - (dg.getFullYear() * 12 + dg.getMonth()) / 12;

      if (readyContracts[i].numericStart < 0) {
        readyContracts[i].numericStart = 0;
        readyContracts[i].duration =
          ((end.getFullYear() - dg.getFullYear()) * 12 +
            (end.getMonth() - dg.getMonth())) /
          12;
      }
      if (readyContracts[i].duration === 0) {
        readyContracts[i].duration = 0.01;
      }
      if (maxAmount < readyContracts[i].amount) {
        maxAmount = readyContracts[i].amount;
      }
      totalAmount += readyContracts[i].amount;

      if (typeof readyContracts[i].vendor === "undefined") {
        readyContracts[i].vendor = "";
      }
    }
    readyContracts.maxAmount = maxAmount;
    readyContracts.totalAmount = totalAmount;
    var monthnow = (dg.getFullYear() * 12 + dg.getMonth()) / 12;
    readyContracts.month = Math.round(h - monthnow) + 1;
    readyContracts.numericStart = i2;
    readyContracts.end = h;

    return readyContracts;
  }

  getBoxSize = function(contract, maxAmount, totalAmount) {
    let maxHeightAllBarsTogheter = 300;

    let boxSize = (contract.amount * maxHeightAllBarsTogheter) / totalAmount;
    if (boxSize < 1) {
      boxSize = 1;
    }

    return boxSize;
  };

  Gant(data, show, col, openModalInitiatives, handleEditInitiatives) {
    var years = Array.apply(null, { length: data.month }).map(function(
      value,
      index
    ) {
      return index;
    });

    let yearsWidth = 25;
    if (years.length !== 0) {
      yearsWidth = 100 / years.length;
    }

    //clear existing boxes before drawing again
    d3.select(".initiatives")
      .selectAll("li")
      .remove();
    d3.select(".xaxis")
      .selectAll("div")
      .remove();
    let that = this;
    let name = function(dom, d) {
      let boxSize = that.getBoxSize(d, data.maxAmount, data.totalAmount);
      let textSize = 34;
      let yearWidth = 100;
      let numberOfYears = years.length - 1;
      if (numberOfYears > 0) {
        yearWidth = 100 / numberOfYears;
      }
      let boxLeft = d.numericStart * yearWidth;
      if (boxLeft >= 100) {
        return;
      }
      let boxWidth = d.duration * yearWidth;
      let boxWidthPercent =
        Math.max(boxWidth + boxLeft, boxWidth) < 100 ? boxWidth : 100;
      if (textSize >= boxSize) {
        //here we put the text outside the box because it's larger
        //this is the container to the box
        let duration2 = (100 - boxLeft) / yearWidth;
        boxWidthPercent =
          (d.duration / duration2) * 100 < 100
            ? (d.duration / duration2) * 100
            : 100;
        dom
          .append("p")
          .attr(
            "style",
            "display: block; height:" +
              boxSize +
              "px; width: 100%; padding-left:  " +
              boxLeft +
              "%;" +
              "cursor: pointer;"
          );
        //here is the box
        dom
          .select("p")
          .append("span")
          .attr("data-tooltip", show(d))
          .attr(
            "style",
            "display: block; float: left; height:" +
              boxSize +
              "px; width:" +
              boxWidthPercent +
              "%;background-color: #9b7193;"
          );
        let nameOutsideWidth =
          100 - boxWidthPercent - 5 < 0 ? 0 : 100 - boxWidthPercent - 5;
        //down here are the text options
        if (boxSize > 5 && nameOutsideWidth !== 0) {
          //here we print it to the right of the box
          dom
            .select("p")
            .append("span")
            .text(show(d))
            .attr("class", "nameOutsideTheBoxContainer")
            .attr("style", "width:" + nameOutsideWidth + "%");
        }
      } else {
        //here we put the text inside the box
        let d4 = dom
          .append("p")
          .attr("data-tooltip", show(d))
          .attr(
            "style",
            "padding: 0; color: #fff; height:" +
              boxSize +
              "px; width:" +
              (boxWidthPercent !== 100 ? boxWidthPercent + "%" : "auto") +
              "; margin-left:  " +
              boxLeft +
              "%; background-color: #9b7193;" +
              "cursor: pointer;"
          );

        //parent div: contains vendor name and contract status
        let nameSpan = d4
          .append("div")
          .attr("class", "nameInsideTheBoxContainer")
          .attr("style", "line-height: " + boxSize + "px");

        //margin to center the name vertically
        const nameMarginTop = (boxSize - textSize) / 2;

        //children p should show one below the other
        nameSpan
          .append("p")
          .text(`${d.vendor["name"]}: ${d.name}`)
          .attr(
            "style",
            `display: block; line-height: 17px; margin-bottom: 0; margin-top: ${nameMarginTop}px;`
          );
        nameSpan
          .append("p")
          .text(d.contractstatus.name)
          .attr(
            "style",
            `display: block; line-height: 17px; font-size: 12px; margin-bottom: 0`
          );

        d4.append("div")
          .text("£ " + formatToUnits(d.realAmount))
          .attr("class", "amountInsideTheBoxContainer")
          .attr("style", "line-height: " + boxSize + "px");
      }
      dom.on("click", contract => {
        handleEditInitiatives(true);
        openModalInitiatives(contract);
      });
    };

    //here we build the x-axis
    d3.select(".xaxis")
      .selectAll("div")
      .data(years)
      .enter()
      .append("div")
      .text(col)
      .attr("style", () => {
        return (
          "float:left; height: 20px; width: " +
          yearsWidth +
          "%;text-align:left;"
        );
      });

    //here we build the Initiatives boxes
    d3.select(".initiatives").style("width", "97%");
    //each .initiative is a box
    var bar = d3
      .select(".initiatives")
      .selectAll("li")
      .data(data)
      .enter()
      .append("li")
      .attr("style", d => {
        let boxSize = that.getBoxSize(d, data.maxAmount);
        return `height: ${boxSize}px; width: 100%; margin-bottom: 9px; line-height:${boxSize}px`;
      })
      .attr("class", d => {
        return "der   de" + d.index;
      });
    bar.each(d => {
      d3.selectAll(".de" + d.index).call(name, d);
    });
  }

  render() {
    let contracts = this.props.contracts;
    let openModalInitiatives = this.props.openModalInitiatives;
    let handleEditInitiatives = this.props.handleEditInitiatives;
    contracts = contracts.slice().map(contract => ({
      ...contract,
      // amount is used for box size calculations
      // real amount is used for display
      realAmount: contract.amount * 1000000
    }));

    if (contracts) {
      let readyContracts = this.parseContractsData(contracts);
      this.Gant(
        readyContracts,
        function(d) {
          return `${d.vendor["name"]}: ${d.name} [${
            d.contractstatus.name
          }] £ ${formatToUnits(d.realAmount)}`;
        },
        function(year) {
          if (year === 0) {
            return "Now";
          } else {
            return year <= 4 ? "T" + year + " Yr" : null;
          }
        },
        openModalInitiatives,
        handleEditInitiatives
      );
    }
    return (
      <Row className="show-grid">
        <Col xs={12} lg={12}>
          <div className="brooklynPipeLineChartBox customBox">
            <div
              className="brooklynPipeLineChartHeader"
              style={{ display: "table" }}
            >
              <p>
                <img src={pipeWhite} alt="pipe-line" style={{ width: 43 }} />{" "}
                Activity Pipeline
              </p>
            </div>
            <div className="">
              <p className="texto-vertical-2">
                Total Initiative Value (Proposed)
              </p>
              <ul className="initiatives costado" />
              <div className="xaxis" />
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default ActivityPipelineChart;
