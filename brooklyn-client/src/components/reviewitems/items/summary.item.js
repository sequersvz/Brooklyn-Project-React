import React, { Fragment } from "react";
import {
  SummaryAgendaSection,
  ReviewItemButtons,
  ItemNameSection
} from "../item.sections";
import { Row, Col } from "react-bootstrap";
import Item from "./item";
const SummaryItem = props => {
  const renderItem = itemState => {
    const {
      item,
      isPdf,
      isAgenda,
      isOldReview,
      sortableHandle,
      handleOnDoubleClick,
      showEdit,
      itemreviewBy,
      handleOnBlur,
      editshowEdit,
      showByEdit,
      editByEdit,
      itemreviewName,
      handleOnKeyDown,
      handleInputChange,
      itemreviewTimeSlot,
      itemreviewAttendees,
      showTimeSlotEdit,
      editTimeSlotEdit,
      editAttendeesEdit,
      showAttendeesEdit
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
        <Col md={12}>
          <ItemNameSection
            {...{
              col: 3,
              showEdit,
              editshowEdit,
              itemreviewName,
              sortableHandle,
              handleOnDoubleClick,
              ...sectionHandler
            }}
          />
          <Col md={8}>
            <Row>
              <SummaryAgendaSection
                {...{
                  itemreviewTimeSlot,
                  itemreviewAttendees,
                  showTimeSlotEdit,
                  editTimeSlotEdit,
                  editAttendeesEdit,
                  showAttendeesEdit,
                  showByEdit,
                  editByEdit,
                  itemreviewBy,
                  ...sectionHandler
                }}
              />
              <ReviewItemButtons
                {...itemState}
                addRisk={props.addRisk}
                col={4}
              />
            </Row>
          </Col>
        </Col>
      </Fragment>
    );
  };
  return <Item {...{ ...props, renderItem }} />;
};
export default SummaryItem;
