import React, { Component } from "react";
import "./menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class CategoryMenu extends Component {
  state = {
    inverseIcon: {},
    mockupchecked: false
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.handlerhowMcokup(event.target.checked);
    if (this.props.meetingOrganiser) {
      this.props.handleMeetingOrganiser(false, "toScore");
    }
  };
  render() {
    const { error, isLoaded, categories } = this.props.categoryState;
    const {
      categoryId,
      click,
      handleMeetingOrganiser,
      meetingOrganiser,
      isMenuGray,
      inverseIcon,
      isReport
    } = this.props;
    const { menuGray } = this.props;
    if (error && !error.isCanceled) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          {!isMenuGray && (
            <div
              className={meetingOrganiser ? "itemchecked" : "item"}
              onClick={() => {
                handleMeetingOrganiser(true);
                click(0, "metting");
              }}
            >
              <p>
                <FontAwesomeIcon icon="users" size="2x" />
                Meeting Organiser
              </p>
            </div>
          )}
          <span style={{ display: isMenuGray ? "none" : "block" }}>
            <div className="item-category" />
            <hr />
          </span>
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => {
                if (!isMenuGray) {
                  handleMeetingOrganiser(false);
                }
                // leaving meeting organiser
                if (meetingOrganiser && categoryId !== category.id) {
                  this.props.handleLeaveMeetingOrganiser(category.id);
                }
              }}
            >
              <div
                key={category.id}
                onClick={click.bind(this, category.id, category.name)}
                className={
                  (category.id === categoryId ||
                    inverseIcon[category.id] === true) &&
                  !inverseIcon.animate
                    ? "itemchecked"
                    : "item"
                }
                id={category.id}
              >
                <p>
                  <FontAwesomeIcon
                    className={
                      inverseIcon.animate && inverseIcon[category.id]
                        ? "itemactioned"
                        : ""
                    }
                    icon={category.iconClassName}
                    size="2x"
                  />
                  {category.name}
                </p>
              </div>
            </div>
          ))}
          <div
            style={{
              position: "relative",
              left: 3
            }}
          >
            {!isReport && (
              <div className="boxSwitch">
                <FormControlLabel
                  control={
                    <Switch
                      checked={menuGray}
                      color="default"
                      onChange={this.handleChange("mockupchecked")}
                    />
                  }
                  style={{
                    marginRight: 5,
                    marginLeft: 5,
                    marginBottom: 0
                  }}
                  className={"switchMenu"}
                />
                <span className="textSwitch">Reviews / Scores</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}

export default CategoryMenu;
