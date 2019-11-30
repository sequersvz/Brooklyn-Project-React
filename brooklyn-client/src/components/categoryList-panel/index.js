import React from "react";
import { Popover } from "react-bootstrap";
import "./popover.css";
import CategoryList from "./category.list";

function ContractStatusFilterPanel(props) {
  const { categories, title, selectCategory, style, ...popoverProps } = props;

  const handleSelectedCategory = categoryId => {
    selectCategory(categoryId);
  };

  const handleOnChange = ({ value }, { action }) => {
    switch (action) {
      case "select-option":
        handleSelectedCategory(value);
        break;
      default:
        return;
    }
  };
  return (
    <Popover
      {...popoverProps}
      positionTop={popoverProps.top ? popoverProps.top : 0}
      id="category-list-panel"
      title={title}
      style={{
        ...style,
        backgroundColor: "#fff",
        width: "250px",
        overflow: "visible"
      }}
    >
      <CategoryList options={categories} onChange={handleOnChange} />
    </Popover>
  );
}

export default ContractStatusFilterPanel;
