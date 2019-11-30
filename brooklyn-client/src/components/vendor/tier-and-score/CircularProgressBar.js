import React from "react";
import PropTypes from "prop-types";
import CircularProgressbar from "react-circular-progressbar";

class VendorCircularProgressBar extends React.PureComponent {
  render() {
    const { title, ...props } = this.props;
    return (
      <React.Fragment>
        <CircularProgressbar
          {...props}
          styles={{
            path: { stroke: `#683364` },
            text: { fill: "#555555", fontSize: "16px" }
          }}
        />
        <p className="titleBar">{title}</p>
      </React.Fragment>
    );
  }
}

export default VendorCircularProgressBar;

VendorCircularProgressBar.propTypes = {
  title: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};
