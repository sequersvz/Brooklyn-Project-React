import React from "react";
import PropTypes from "prop-types";

const SearchKitPanel = ({ collapsed, children }) => (
  <div
    className={`sk-layout__filters slide${collapsed ? "Out" : "In"} customBox`}
  >
    {children}
  </div>
);

SearchKitPanel.propTypes = {
  collapsed: PropTypes.bool,
  children: PropTypes.array
};

SearchKitPanel.defaultProps = {
  collapsed: false
};

export default SearchKitPanel;
