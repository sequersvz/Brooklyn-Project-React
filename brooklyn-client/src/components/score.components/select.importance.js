import React, { PureComponent } from "react";
import { Row, Col } from "react-bootstrap";
import "./item.score.css";
import { withStyles } from "@material-ui/core/styles";
import Score from "./score";

const styles = () => ({
  default: {
    backgroundColor: "#6c757d",
    "&,&:focus,&:hover,&:visited": {
      backgroundColor: "#6c757d",
      color: "#fffff"
    }
  }
});

class SelectImportance extends PureComponent {
  render() {
    const {
      handleInputChange,
      reviewitemComment,
      reviewitemImportance,
      scoreNumber,
      scoreName,
      handleOnKeyDown
    } = this.props;

    return (
      <Row>
        <Col md={12}>
          <div className={"itemscore container"}>
            <Row>
              <Col md={12}>
                <Col md={6} className={"scoreName"}>
                  <span>{scoreName}</span>
                </Col>
                <Col md={6} className={"scoreName"}>
                  <Score scoreNumber={scoreNumber} />
                </Col>
                <Col md={12} className="titleComment">
                  <p>Care to comment?</p>
                  <hr />
                </Col>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <textarea
                  onKeyDown={handleOnKeyDown}
                  className={"boxComment"}
                  name={"reviewitemComment"}
                  onChange={handleInputChange}
                  value={reviewitemComment}
                  onClick={e => e.stopPropagation()}
                  onDoubleClick={e => e.stopPropagation()}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={12}>
                <p>How important is this Review Item?</p>
                <input
                  type={"range"}
                  name={"reviewitemImportance"}
                  onChange={handleInputChange}
                  value={reviewitemImportance}
                  defaultValue={1}
                  min="1"
                  max="10"
                  step="1"
                />
                <div className="boxImportance">
                  {reviewitemImportance ? reviewitemImportance : 1}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default withStyles(styles)(SelectImportance);
