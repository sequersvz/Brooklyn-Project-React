import React, { useState } from "react";
import HeatMap from "react-heatmap-grid";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import { formatToUnits } from "../../Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

const xLabels = new Array(5).fill(0).map((_, i) => `${++i}`);
const yLabels = [...xLabels].reverse();

const data = new Array(yLabels.length)
  .fill(0)
  .map((_, x) =>
    new Array(xLabels.length).fill(0).map((_, y) => xLabels[y] * yLabels[x])
  );

const getCellColor = (x, y) => {
  const colors = ["#5cb832", "#92a832", "#ffd800", "#d97c32", "#f55a32"];
  for (let [i] of colors.entries()) {
    let size = colors.length;
    if (y === size - i - 1 || x === i) return colors[i];
  }
};

const getToleranceLineStyle = ({ x, y, value, data, tolerance }) => {
  let style = {
    borderStyle: "solid",
    marginTop: -2,
    marginBottom: -2,
    marginRight: 0,
    marginLeft: 0
  };
  const borderColor = "#555";
  const hasNext = x + 1 < data[y].length;
  const hasTop = y - 1 > -1;
  const next = hasNext ? data[y][x + 1] : null;
  const top = hasTop ? data[y - 1][x] : null;
  const isTolerant = v => v < tolerance;

  if (!isTolerant(value)) return style;
  if ((next && !hasTop && isTolerant(value)) || (top && !isTolerant(top))) {
    style.borderTopColor = borderColor;
    style.borderStyle = "solid";
  }
  if (
    (next && !isTolerant(next)) ||
    (!isTolerant(top) && !hasNext) ||
    (isTolerant(top) && !hasNext)
  ) {
    style.borderRightColor = borderColor;
    style.borderStyle = "solid";
  }

  return style;
};

const getCellStyle = tolerance => (background, value, min, max, data, x, y) => {
  let color = getCellColor(x, y);
  let toleranceStyle = getToleranceLineStyle({ x, y, value, data, tolerance });
  return {
    background: color,
    fontSize: "1em",
    fontWeight: 400,
    color: "#fff",
    ...toleranceStyle
  };
};

const RiskMatrix = ({
  sliders,
  cellHeight,
  report,
  riskMatrixData,
  handleSwitch,
  switched,
  loading
}) => {
  const [showTooltip, setTooltip] = useState(false);
  return (
    <>
      <Grid
        container
        item
        xs={2}
        sm={2}
        direction="column"
        alignItems="center"
        style={{ marginTop: 15, fontSize: "1.26em" }}
      >
        {sliders &&
          sliders.likelihood &&
          !sliders.likelihood.some(v => v === null) &&
          sliders.likelihood.map((value, i) => {
            let newValue = "";
            let isFirst = i === 0;
            let fixedValue = +value.toFixed(1);
            if (isFirst) {
              newValue = `< = ${fixedValue} yrs`;
            } else {
              let previous = +sliders.likelihood[i - 1].toFixed(1);
              newValue = `${previous} - ${fixedValue} yrs ${
                value === 100 ? "+" : ""
              }`;
            }
            return (
              <div key={i} style={{ height: "50px" }}>
                {newValue}
              </div>
            );
          })}
      </Grid>
      <Grid item style={{ fontSize: "1.46em" }} xs={7} sm={7}>
        <HeatMap
          xLabels={xLabels}
          yLabels={yLabels}
          xLabelsLocation={"bottom"}
          xLabelWidth={cellHeight}
          data={data}
          height={cellHeight}
          squares
          cellStyle={getCellStyle(
            sliders && sliders.tolerance ? sliders.tolerance[0] : 0
          )}
          cellRender={(value, x, y) => {
            let count = "";
            if (Array.isArray((riskMatrixData || [])[0])) {
              const xArray = riskMatrixData.find((_, index) => {
                return index === parseInt(y - 1, 10);
              });
              const risk = xArray.find(item => {
                return (
                  item.probability === parseInt(y, 10) &&
                  item.impact === parseInt(x, 10)
                );
              });

              if (risk.count > 0) {
                count = risk.count;
              }
            }

            return (
              value && (
                <>
                  <p
                    style={{ cursor: "default" }}
                    data-tip={count}
                    onMouseOver={() => {
                      if (count && !showTooltip) {
                        setTooltip(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (showTooltip) {
                        setTooltip(false);
                      }
                    }}
                  >
                    {value}{" "}
                    {report &&
                      Array.isArray((riskMatrixData || [])[0]) &&
                      (riskMatrixData[y - 1][x - 1]["count"] > 0 && (
                        <FontAwesomeIcon icon={faExclamation} />
                      ))}
                  </p>
                  {showTooltip && report && <ReactTooltip />}
                </>
              )
            );
          }}
          title={() => ""}
        />
        <Grid
          container
          item
          xs={12}
          sm={12}
          direction="row"
          alignItems="center"
          style={{ marginTop: 25, marginLeft: 25, fontSize: "0.9em" }}
        >
          {sliders &&
            sliders.impact &&
            !sliders.impact.some(v => v === null) &&
            sliders.impact.map((value, i) => (
              <div key={i} style={{ width: `${cellHeight + 10}px` }}>
                {`£ ${formatToUnits(value * Math.pow(10, 6), 2)}`}
              </div>
            ))}
        </Grid>
      </Grid>
      <Grid item xs={1} sm={1}>
        <div style={{ position: "relative", top: 50, left: 0 }}>
          <hr
            style={{
              width: cellHeight + 15,
              marginBottom: -0.1,
              borderBottomWidth: "4px",
              borderBottomStyle: "solid",
              borderColor: "#555"
            }}
          />
          <p>Apetitte/Tolerance</p>
        </div>
        {typeof switched === "boolean" ? (
          <div
            style={{ position: "relative", top: 75, left: 0, width: "150px" }}
          >
            Residual
            <Switch
              name="risktype"
              checked={switched}
              onChange={() => {
                handleSwitch(!switched);
              }}
              value="risktype"
              color="primary"
              disabled={loading}
            />
          </div>
        ) : null}
      </Grid>
    </>
  );
};
export default RiskMatrix;
