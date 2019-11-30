import React, { PureComponent } from "react";
import { Row, Col } from "react-bootstrap";
import "./item.score.css";
import Score from "./score";
import { getDateFormat } from "../../Utils";
import { withRouter } from "react-router-dom";

class ItemScore extends PureComponent {
  render() {
    const {
      scoreName,
      scoreNumber,
      descriptionTitle,
      description,
      importance,
      review,
      item
    } = this.props;
    return (
      <Row>
        <Col md={12}>
          <div className={"itemscore container"}>
            <br />
            <Row>
              <Col md={6} className={"scoreName"}>
                <span>{scoreName}</span>
              </Col>
              <Col md={6}>
                <Score scoreNumber={scoreNumber} />
              </Col>
            </Row>
            {item && item.userclosedit ? (
              <Row>
                <Col md={12} className={"scoreName"}>
                  <span>{`${item.userclosedit.name}`}</span>
                </Col>
              </Row>
            ) : null}
            <hr />
            {description && (
              <>
                <Row>
                  <Col md={12} className={"descriptionTitle"}>
                    {descriptionTitle}:
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className={"description"}>
                    {description}
                  </Col>
                </Row>
              </>
            )}
            <Row>
              <Col md={12} className={"importance"}>
                <p>
                  Weighting: {importance}
                  /10
                </p>
              </Col>
            </Row>
            {review ? (
              <Row>
                <Col md={12} className={"importance"}>
                  <p>Review Date: {getDateFormat(review.date)}</p>
                </Col>
              </Row>
            ) : null}
          </div>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ItemScore);
