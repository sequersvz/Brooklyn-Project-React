import React, { Fragment } from "react";
import { ReviewItemButtons, ItemNameSection } from "../item.sections";
import { Row, Col } from "react-bootstrap";
import Item from "./item";
const ReviewItem = props => {
  const renderItem = itemState => {
    const {
      item,
      isPdf,
      showEdit,
      editshowEdit,
      isAgenda,
      isOldReview,
      sortableHandle,
      handleOnDoubleClick,
      handleOnBlur,
      itemreviewName,
      handleOnKeyDown,
      handleInputChange,
      openModalRemoveRI
    } = itemState;
    const sectionHandler = {
      item,
      isPdf,
      isAgenda,
      showEdit,
      editshowEdit,
      isOldReview,
      handleOnBlur,
      handleOnKeyDown,
      handleInputChange,
      openModalRemoveRI
    };
    return (
      <Fragment>
        <ItemNameSection
          {...{
            col: 7,
            itemreviewName,
            sortableHandle,
            handleOnDoubleClick,
            ...sectionHandler
          }}
        />
        <Col md={5}>
          <Row>
            <ReviewItemButtons
              {...{ ...itemState, col: 12, addRisk: props.addRisk }}
            />
          </Row>
        </Col>
      </Fragment>
    );
  };
  return <Item {...{ ...props, renderItem }} />;
};
export default ReviewItem;
