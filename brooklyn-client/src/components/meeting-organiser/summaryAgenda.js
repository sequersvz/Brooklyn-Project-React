import React from "react";
import SummaryTable from "./summaryTable";
import { Row, Col } from "react-bootstrap";
import SummaryItem from "../reviewitems/items/summary.item";

const SummaryAgenda = props => (
  <SummaryTable {...{ ...props, renderSummaryTableHead, renderItem }} />
);

const renderItem = props => <SummaryItem {...props} />;

const renderSummaryTableHead = ({ className, isPdf }) => {
  return (
    <Row
      style={{
        width: "100%",
        marginTop: "10px",
        marginRight: 0,
        marginLeft: 0
      }}
    >
      <Col md={1}>
        <p className={className}>S.No.</p>
      </Col>
      <Col md={3}>
        <p className={className}>Agenda Item</p>
      </Col>
      <Col md={8}>
        <Row>
          <Col md={isPdf ? 4 : 3}>
            <p className={className}>Category / Checkpoint</p>
          </Col>
          <Col md={isPdf ? 4 : 3}>
            <p className={className}>Time Slot</p>
          </Col>
          <Col md={isPdf ? 4 : 3}>
            <p className={className}>By</p>
          </Col>
          {isPdf ? null : (
            <Col md={3}>
              <p
                style={{ textAlign: "right", paddingRight: 30 }}
                className={className}
              >
                Actions
              </p>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default SummaryAgenda;
