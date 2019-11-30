import React from "react";
import SummaryTable from "./summaryTable";
import { Row, Col } from "react-bootstrap";
import ActionItem from "../reviewitems/items/action.item";

const SummaryMinutes = props => (
  <SummaryTable {...{ ...props, renderSummaryTableHead, renderItem }} />
);

const renderItem = props => <ActionItem {...props} />;

const renderSummaryTableHead = ({ className, isPdf }) => (
  <Row
    style={{
      width: "100%",
      marginTop: "5%"
    }}
  >
    <Col md={1}>
      <p className={className} align="center">
        S.No.
      </p>
    </Col>
    <Col md={3} align="left">
      <p className={className}>Agenda Item</p>
    </Col>
    <Col md={8}>
      <Row>
        <Col md={isPdf ? 7 : 5}>
          <p className={className} style={{ marginLeft: "15" }} align="center">
            Owner
          </p>
        </Col>
        <Col md={isPdf ? 5 : 4}>
          <p className={className} style={{ marginLeft: "15" }} align="center">
            Due Date
          </p>
        </Col>
        {isPdf ? null : (
          <Col md={3}>
            <p
              className={className}
              style={{ marginRight: "15" }}
              align="right"
            >
              Actions
            </p>
          </Col>
        )}
      </Row>
    </Col>
  </Row>
);
export default SummaryMinutes;
