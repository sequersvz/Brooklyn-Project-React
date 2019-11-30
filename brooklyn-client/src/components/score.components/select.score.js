import React, { PureComponent } from "react";
import { Row, Col } from "react-bootstrap";
import "./item.score.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import Rating from "react-rating";
import { scoreNames } from "../../config/config";

class SelectScore extends PureComponent {
  state = {
    ratingName: ""
  };
  render() {
    const { handleInputChange } = this.props;
    return (
      <Row>
        <Col md={12}>
          <div className={"itemscore container"}>
            <Row className="mb-2">
              <Col md={6}>
                <span>
                  {this.state.rating
                    ? scoreNames[this.state.rating - 1]
                    : "Select Score"}
                </span>
              </Col>
              <Col md={6}>
                <Rating
                  start={0}
                  stop={4}
                  step={1}
                  fractions={1}
                  initialRating={0}
                  onClick={value =>
                    handleInputChange({
                      target: { value, name: "reviewitemMark" }
                    })
                  }
                  onHover={value => this.setState({ rating: value })}
                  emptySymbol={
                    <FontAwesomeIcon icon={icons["faStar"]} color={"grey"} />
                  }
                  fullSymbol={
                    <FontAwesomeIcon icon={icons["faStar"]} color={"#ffa21a"} />
                  }
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default SelectScore;
