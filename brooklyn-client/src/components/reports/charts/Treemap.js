import React from "react";
import PropTypes from "prop-types";
import { Treemap, makeWidthFlexible } from "react-vis";
import { getColorFromScore, formatToUnits } from "../../../Utils";
import ReactTooltip from "react-tooltip";

class TreemapChart extends React.Component {
  state = { height: window.screen.availHeight - 180 };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize = () => {
    if (window.screen.availHeight - 180 !== this.state.height) {
      this.setState({ height: window.screen.availHeight - 180 });
    }
  };

  render() {
    const { vendors, width } = this.props;
    const { height } = this.state;
    const data = Array.isArray(vendors)
      ? vendors
          .map(vendor => {
            const valueFormatted = formatToUnits(vendor.value, 2);
            const vendorContent = (
              <>
                <p>{vendor.name}</p>
                <p>£ {valueFormatted}</p>
                <ReactTooltip />
              </>
            );
            const vendorDataTip = `${vendor.name}\n£ ${valueFormatted}`;
            return {
              title: <div data-tip={vendorDataTip}>{vendorContent}</div>,
              size: vendor.value,
              style: {
                textAlign: "center",
                background: vendor.score
                  ? getColorFromScore(vendor.score)
                  : "#848484"
              }
            };
          })
          .sort((vendor1, vendor2) => vendor2.size - vendor1.size)
      : [];
    return (
      <Treemap
        {...{
          animation: true,
          data: {
            title: "analytics report",
            style: { background: "#ffffff" },
            children: data
          },
          width,
          height,
          padding: 2,
          mode: "resquarify",
          style: { marginLeft: "25px" }
        }}
      />
    );
  }
}

TreemapChart.propTypes = {
  width: PropTypes.number
};

export default makeWidthFlexible(TreemapChart);
