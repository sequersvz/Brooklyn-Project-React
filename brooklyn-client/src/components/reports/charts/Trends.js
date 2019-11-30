import React from "react";
import PropTypes from "prop-types";
import {
  XYPlot,
  XAxis,
  YAxis,
  DiscreteColorLegend,
  LineMarkSeries,
  Crosshair,
  makeWidthFlexible
} from "react-vis";
import randomColor from "randomcolor";
import moment from "moment";

const months = [
  { short: "Jan", long: "January" },
  { short: "Feb", long: "February" },
  { short: "Mar", long: "March" },
  { short: "Apr", long: "April" },
  { short: "May", long: "May" },
  { short: "Jun", long: "June" },
  { short: "Jul", long: "July" },
  { short: "Aug", long: "August" },
  { short: "Sep", long: "September" },
  { short: "Oct", long: "October" },
  { short: "Nov", long: "November" },
  { short: "Dec", long: "December" }
];

class Trends extends React.PureComponent {
  state = {
    crosshairValues: [],
    colors: [],
    labels: [],
    colorLegends: [],
    tickFormat: [],
    currentX: null
  };

  componentDidMount() {
    const { reports } = this.props;

    // array containting the name of each line serie
    const labels = reports.data.reduce(
      (allLabels, { name }) => allLabels.concat(name),
      []
    );
    const colors = randomColor({
      count: labels.length
    });
    const colorLegends = labels.map((title, index) => ({
      title,
      color: colors[index]
    }));

    const startDate = moment((reports || {}).startDate);

    // months labels below the chart: Jan 2000, Feb 2000
    const tickFormat = [...Array(reports.totalMonths)].map((_, month) => {
      const date = startDate.clone().add(month, "months");
      return `${months[date.month()].short} ${date.year()}`;
    });

    this.setState({ colors, labels, colorLegends, tickFormat });
  }

  _onMouseLeave = () => {
    this.setState({ crosshairValues: [], currentX: null });
  };

  _onNearestX = datapoint => {
    let currentX = datapoint.x;
    const crosshairValues = this.props.reports.data.reduce(
      (allValues, currentValue) => {
        // all data score for month x
        const currentXValue = currentValue.data.filter(
          ({ x }) => x === datapoint.x
        );
        return allValues.concat(currentXValue);
      },
      []
    );
    if (this.state.currentX !== currentX) {
      this.setState({ crosshairValues, currentX });
    }
  };

  render() {
    const { reports, width } = this.props;
    const { colors, labels, colorLegends, tickFormat } = this.state;
    return (
      width > 0 && (
        <React.Fragment>
          <div style={{ display: "flex" }}>
            <div style={{ transform: "rotate(-90deg)", margin: "auto" }}>
              Average Score
            </div>
            <XYPlot
              animation
              // 100px for legends width and 30px avg score text width
              width={width - 130}
              height={500}
              yDomain={[0, 10]}
              margin={{ bottom: 55 }}
              onMouseLeave={this._onMouseLeave}
            >
              <XAxis
                tickTotal={reports.totalMonths}
                tickFormat={v => tickFormat[v]}
                tickLabelAngle={-45}
              />
              <YAxis tickValues={[0, 5, 10]} />
              {reports.data.length > 0
                ? reports.data.map((item, index) => (
                    <LineMarkSeries
                      key={`${item.name}_${index}`}
                      color={colors[index]}
                      data={item.data}
                      onNearestX={this._onNearestX}
                      curve="curveMonotoneX"
                      getNull={({ y }) => y}
                      size={3}
                    />
                  ))
                : null}
              <Crosshair
                values={this.state.crosshairValues}
                titleFormat={data => ({
                  title: "Scores for",
                  value: `${months[data[0].month].long} ${data[0].year}`
                })}
                itemsFormat={items =>
                  items.map(({ y }, index) => ({
                    title: labels[index],
                    value: y
                  }))
                }
              />
            </XYPlot>
            <DiscreteColorLegend
              items={colorLegends}
              style={{ width: "180px", marginTop: "150px" }}
            />
          </div>
          <div style={{ textAlign: "center", paddingBottom: "25px" }}>
            Months
          </div>
        </React.Fragment>
      )
    );
  }
}

Trends.propTypes = {
  width: PropTypes.number
};

export default makeWidthFlexible(Trends);
