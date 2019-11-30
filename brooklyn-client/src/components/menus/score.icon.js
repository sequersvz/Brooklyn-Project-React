import React, { PureComponent } from "react";
import "./menu.gray.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFull, faMinus } from "@fortawesome/free-solid-svg-icons";
import { getColorFromScore } from "../../Utils";
import ReactTooltip from "react-tooltip";

class ScoreIcon extends PureComponent {
  render() {
    const {
      score,
      thisReview,
      index,
      whithoutChild,
      dataTip,
      iconRef,
      onClick,
      className,
      tooltipId
    } = this.props;
    let renderScore = (
      <div>
        <div className={className} onClick={() => onClick && onClick()}>
          <FontAwesomeIcon icon={faMinus} color={"#555555"} />
        </div>
      </div>
    );
    if (thisReview) {
      renderScore = (
        <>
          <div onClick={() => onClick && onClick()}>
            <span
              {...iconRef && { ref: iconRef }}
              className="scoreSquare"
              style={{
                background: getColorFromScore(score) /*bariable de color*/
              }}
              data-tip={dataTip}
              data-for={tooltipId}
            >
              {score}
            </span>
          </div>
          <ReactTooltip id={tooltipId} />
        </>
      );
    } else if (!whithoutChild) {
      renderScore = (
        <>
          <div
            {...iconRef && { ref: iconRef }}
            className="scoreTooltipBox"
            onClick={() => onClick && onClick()}
          >
            <FontAwesomeIcon
              key={index}
              className="squareChart"
              icon={faSquareFull}
              color={getColorFromScore(score)}
              data-tip={dataTip}
              data-for={tooltipId}
            />
          </div>
          <ReactTooltip id={tooltipId} />
        </>
      );
    }

    return renderScore;
  }
}

export default ScoreIcon;
