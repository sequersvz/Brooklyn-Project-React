import React from "react";
import ReactDOMServer from "react-dom/server";
import Timeline from "react-visjs-timeline";
import { host } from "../../config/config";
import TimelineAvatar from "./TimelineAvatar";

class ReviewsTimeline extends React.PureComponent {
  state = {
    interval: null,
    reviews: [],
    firstRender: true
  };

  componentDidMount() {
    // intentionally trigger re-render
    if (this.state.firstRender) {
      this.setState(prevState => ({ ...prevState, firstRender: false }));
    }
  }

  componentDidUpdate() {
    const { interval } = this.state;
    const timeline = document.getElementsByClassName("vis-timeline")[0];
    const timelineVisible =
      ((timeline || {}).style || {}).visibility === "visible";
    if (!timelineVisible && !interval) {
      const updateInterval = setInterval(() => {
        this.forceUpdate();
      }, 333);
      this.setState({ interval: updateInterval });
    }
    if (timelineVisible && interval) {
      const { reviews } = this.props;
      clearInterval(interval);
      // set reviews once timeline is visible to avoid rendering attendees avatars with different colors on re-render
      this.setState({ interval: null, reviews });
    }
  }

  componentWillUnmount() {
    let { interval } = this.state;
    if (interval) {
      clearInterval(interval);
    }
  }
  render() {
    const { clickHandler } = this.props;
    const { reviews } = this.state;
    let start = new Date();
    let end = new Date();
    start.setMonth(start.getMonth() - 2);
    end.setMonth(end.getMonth() + 2);
    const options = {
      max: "2024-12-31",
      min: "2009-01-01",
      height: "450px",
      autoResize: true,
      start: start,
      end: end,
      editable: { add: false }
    };

    const filteredReviews = reviews.filter(
      review =>
        review.date !== null &&
        review.vendorName !== null &&
        review.notes !== null
    );
    let items =
      filteredReviews.length > 0
        ? filteredReviews.map(review => {
            let date = new Date(review.date);
            let vendorLogoMain = review.vendorLogo
              ? '<img crossOrigin="use-credentials" origin="' +
                host +
                '" style="max-width: 100px; max-height: 25px" src="' +
                review.vendorLogo +
                '" alt="">'
              : review.vendorName;
            const managerPicture = ReactDOMServer.renderToStaticMarkup(
              <TimelineAvatar user={review.manager} />
            );
            const attendeesPictures = (review.attendees || [])
              .slice(0, managerPicture ? 3 : 4)
              .reduce((attendees, currentAttendee) => {
                const attendeePicture = ReactDOMServer.renderToStaticMarkup(
                  <TimelineAvatar user={currentAttendee} />
                );
                return attendees.concat(attendeePicture);
              }, "");
            return {
              id: review.id,
              content:
                '<p key="' +
                review.id +
                '">' +
                review.notes +
                "<span>" +
                review.allReviewItems +
                "</span></p>" +
                '<div id="review_' +
                review.id +
                '">' +
                '<div style="display: flex; margin-bottom: 10px">' +
                managerPicture +
                attendeesPictures +
                "</div>" +
                '<div style="margin: 5px 0">' +
                vendorLogoMain +
                "</div>" +
                '<div style="margin-bottom: 5px; font-weight: 700; font-size: 14px">' +
                review.groupName +
                "</div>" +
                "<div>" +
                date.toLocaleDateString() +
                "</div>" +
                "</div>",
              editable: false,
              start: review.date
            };
          })
        : [];

    return (
      <Timeline options={options} items={items} clickHandler={clickHandler} />
    );
  }
}

export default ReviewsTimeline;
