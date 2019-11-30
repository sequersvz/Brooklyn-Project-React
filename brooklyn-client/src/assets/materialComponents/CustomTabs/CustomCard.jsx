import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "../Card/Card.jsx";
import CardBody from "../Card/CardBody.jsx";
import CardHeader from "../Card/CardHeader.jsx";

import customTabsStyle from "../../jss/material-kit-react/components/customTabsStyle.jsx";

class CustomTabs extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      classes,
      headerColor,
      plainTabs,
      title,
      rtlActive,
      cardBodyContent,
      headerStyle,
      date,
      cardDateClass,
      cardDateStyle,
      cardHeaderClassName
    } = this.props;
    const cardTitle = classNames({
      [classes.cardTitle]: true,
      [classes.cardTitleRTL]: rtlActive
    });
    return (
      <Card plain={plainTabs}>
        <CardHeader
          color={headerColor}
          plain={plainTabs}
          className={cardHeaderClassName}
        >
          {title !== undefined ? (
            <div
              className={cardTitle}
              style={headerStyle !== "undefined" ? headerStyle : null}
            >
              {title}
            </div>
          ) : null}
          {date !== undefined ? (
            <div
              className={cardDateClass !== undefined ? cardDateClass : null}
              style={cardDateStyle !== undefined ? cardDateStyle : null}
            >
              {date}
            </div>
          ) : null}
        </CardHeader>
        <CardBody>
          {cardBodyContent !== "undefined" ? cardBodyContent : null}
        </CardBody>
      </Card>
    );
  }
}

CustomTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  headerColor: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose"
  ]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  headerStyle: PropTypes.object,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.func,
      tabContent: PropTypes.node.isRequired
    })
  ),
  rtlActive: PropTypes.bool,
  plainTabs: PropTypes.bool,
  date: PropTypes.string,
  cardDateClass: PropTypes.string,
  cardDateStyle: PropTypes.object,
  cardHeaderClassName: PropTypes.string
};

export default withStyles(customTabsStyle)(CustomTabs);
