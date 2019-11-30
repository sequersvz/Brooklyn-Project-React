import React, { Fragment } from "react";
import {
  SummaryActionSection,
  ReviewItemButtons,
  ItemNameSection
} from "../item.sections";
import { Row, Col } from "react-bootstrap";
import Item from "./item";
const ActionItem = props => {
  const renderItem = itemState => {
    const {
      item,
      isPdf,
      owners,
      isAgenda,
      isOldReview,
      sortableHandle,
      handleOnDoubleClick,
      showEdit,
      handleOnBlur,
      editshowEdit,
      itemreviewName,
      handleOnKeyDown,
      handleInputChange
    } = itemState;
    const sectionHandler = {
      item,
      isPdf,
      isAgenda,
      isOldReview,
      handleOnBlur,
      handleOnKeyDown,
      handleInputChange
    };
    return (
      <Fragment>
        <ItemNameSection
          {...{
            ...sectionHandler,
            col: 4,
            showEdit,
            editshowEdit,
            itemreviewName,
            sortableHandle,
            handleOnDoubleClick
          }}
        />
        <Col md={7}>
          <Row>
            <SummaryActionSection
              {...{
                ...sectionHandler,
                owners
              }}
            />
            <ReviewItemButtons {...itemState} col={3} />
          </Row>
        </Col>
      </Fragment>
    );
  };
  return <Item {...{ ...props, renderItem }} />;
};
export default ActionItem;
