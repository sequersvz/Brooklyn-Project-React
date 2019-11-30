import React, { PureComponent } from "react";
import "./item.score.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";

class Score extends PureComponent {
  render() {
    const { scoreNumber, negative } = this.props;
    let score = [];
    let scoreFalse = [];
    for (let i = 0; i < scoreNumber; i++) {
      score.push(
        <FontAwesomeIcon
          key={i}
          icon={icons["faStar"]}
          color={!negative ? "#ffa21a" : "grey"}
        />
      );
    }
    if (!negative) {
      for (let i = 0; i < 4 - scoreNumber; i++) {
        scoreFalse.push(
          <FontAwesomeIcon key={i} icon={icons["faStar"]} color={"#555555"} />
        );
      }
    }
    return (
      <div>
        {score} {!negative ? scoreFalse : null}
      </div>
    );
  }
}

export default Score;
