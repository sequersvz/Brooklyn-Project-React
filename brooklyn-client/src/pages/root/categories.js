import React, { Component } from "react";
import RootLayout from "../../components/root/roo-layout/root-loyout";
import RootContainer from "../../containers/root/rootContainer";
import * as icons from "@fortawesome/free-solid-svg-icons";
import CategoryList from "../../components/categoryList-panel/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Categories extends Component {
  addEntityDefualt = className => {
    const properties = {
      name: "Click to edit.",
      iconClassName: className,
      order: this.props.entity.length + 1,
      meetingOrder: this.props.entity.length + 1
    };
    this.props._addEntity(properties);
  };
  render() {
    const CategoryListComponent = (
      <CategoryList
        categories={Object.keys(icons).reduce((list, icon) => {
          if (icons[icon].iconName) {
            list.push({
              label: (
                <span>
                  {`${icon} `}
                  <FontAwesomeIcon
                    style={{
                      fontSize: 14,
                      color: "black",
                      float: "right"
                    }}
                    icon={icons[icon]}
                  />
                </span>
              ),
              value: icons[icon].iconName
            });
          }
          return list;
        }, [])}
        selectCategory={this.addEntityDefualt}
        title={"Icons List"}
      />
    );
    return (
      <RootLayout
        {...this.props}
        entity={(this.props.entity || []).map(item => ({
          ...item,
          isDisabled: item.system
        }))}
        overlay={CategoryListComponent}
      />
    );
  }
}

const GreatGrandfather = wraperComponent => {
  const MyRootContainer = RootContainer(wraperComponent);
  const renderRootContainer = () => (
    <MyRootContainer
      entity={"category"}
      title={"Category"}
      tableSchema={{
        rowInfo: [
          { name: `id`, size: 100, editable: false },
          { name: `name`, size: 350, editable: true },
          { name: `description`, size: 200, editable: true },
          { name: `enabled`, size: 80, editable: true },
          { name: `iconClassName`, size: 200, editable: true },
          { name: `order`, size: 80, editable: true }
        ]
      }}
      defaultEntity={{
        name: "Click to edit."
      }}
    />
  );
  return renderRootContainer;
};

export default GreatGrandfather(Categories);
