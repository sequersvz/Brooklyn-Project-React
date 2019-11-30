import React, { Fragment } from "react";
import { ReviewItemButtons, CategoryNameSection } from "../item.sections";
import { ItemNameInput } from "../editable.inputs";
import { Row, Col } from "react-bootstrap";
import Item from "./item";
const WdihtdtItem = props => {
  const { checkpointName, openPanel, item } = props;
  let displayHrSeparator = "block";
  let marginTopSeparator = 0;
  if (!openPanel[item.id] || openPanel[item.id].open === false) {
    displayHrSeparator = "none";
  }
  if (openPanel[item.id] && openPanel[item.id].open === true) {
    marginTopSeparator = 15;
  }
  const renderItem = itemState => {
    const {
      item,
      isPdf,
      showEdit,
      editshowEdit,
      handleOnBlur,
      itemreviewName,
      handleOnKeyDown,
      handleInputChange,
      categoryName,
      isOldReview,
      handleOnDoubleClick
    } = itemState;
    const sectionHandler = {
      item,
      isPdf,
      isOldReview,
      handleOnBlur,
      handleOnKeyDown,
      handleInputChange
    };
    return (
      <Fragment>
        <Col md={7}>
          <ItemNameInput
            {...{
              showEdit,
              editshowEdit,
              itemreviewName,
              handleOnDoubleClick,
              ...sectionHandler
            }}
          />
        </Col>
        <Col md={5}>
          <Row>
            <Col md={8}>
              <CategoryNameSection
                {...{
                  categoryName,
                  checkpointName,
                  iconClassName: item.iconClassName
                }}
              />
            </Col>
            <ReviewItemButtons {...{ ...itemState, col: 4 }} />
          </Row>
        </Col>
      </Fragment>
    );
  };
  return (
    <Item
      {...{ ...props, renderItem, displayHrSeparator, marginTopSeparator }}
    />
  );
};
export default WdihtdtItem;
