import React, { Component } from "react";
import CategoryMenu from "./category.menu";
import CheckMenu from "./checkpoint.menu";
import "./menu.gray.css";
import { Col, Row, Popover, Overlay } from "react-bootstrap";
import moment from "moment";
import ScoreIcon from "./score.icon";
import ItemScore from "../score.components/item.score";
import { scoreNames, monthNames } from "../../config/config";
import { withRouter } from "react-router-dom";
import { sortByKey } from "../../actions/utils/sortByKey";

class LayoutMenuGray extends Component {
  state = {
    showPopoverCovered: {}
  };
  nodos = {};

  handleClickScore = (review, categoryId, checkpointId) => () => {
    const checkQuery = checkpointId && "&checkpointId=" + checkpointId;
    const link = `/assurance/review/${review.id ||
      review.reviewId}?categoryId=${categoryId || "1"}${checkQuery || ""}`;
    window.open(link);
  };

  getOrderedScores = (items, reviewId) =>
    items.reduce((acc, item) => {
      if (item.reviewId === reviewId) {
        return [item].concat(acc);
      }
      return acc.concat(item);
    }, []);

  render() {
    const { categoryId, categoryName } = this.props;
    const { handleClickCategory } = this.props;
    const { review } = this.props;
    const isReport = this.props.location.pathname === "/report";
    const reportName = isReport ? "Report" : "";
    let classNames = {
      leftSide: `leftSide${reportName}`,
      scoreContainer: `scoreContainer${reportName}`,
      scoreBox: `scoreBox${reportName}`,
      scoreSquare: `scoreSquare${reportName}`,
      itemCategory: `itemCategory${reportName}`,
      itemCategorySelected: `itemCategorySelected${reportName}`,
      itemcheckMenuGray: `itemcheckMenuGray${reportName}`,
      itemcheckCheckedMenuGray: `itemcheckCheckedMenuGray${reportName}`,
      leftGray: `leftGray${reportName}`
    };

    const handlersCheck = {
      ...this.props,
      items: sortByKey((this.props.checkState || {}).items || [], "name"),
      isMenuGray: true,
      classNames,
      isReport
    };
    const handlersCategory = {
      ...this.props,
      click: handleClickCategory,
      isMenuGray: true,
      classNames,
      isReport
    };
    let reviewDate = null;
    if (review) {
      const date = moment(review.date);
      reviewDate = `${date.date()} ${monthNames[date.month()]} ${date.year()}`;
    }

    const categoriesScores = (
      (this.props.categoryState || {}).categories || []
    ).map(category => {
      const scores = this.props.scores.category.find(
        item => item.id === category.id
      );
      return scores;
    });

    const checkpointsScores = sortByKey(
      (this.props.checkState || {}).items || [],
      "name"
    )
      .map(checkpoint => {
        const scores = this.props.scores.checkpoint.find(
          item => item.id === checkpoint.id
        );
        return scores;
      })
      .filter(notNull => notNull);

    const menuchild = <CheckMenu {...handlersCheck} />;
    const isActionLog = categoryName === "Action Log";
    const renderTooltip = (reviewDate, scoresCount, score) =>
      `${moment(reviewDate).format(
        "DD-MM-YYYY"
      )}: [Scores: ${scoresCount}], weighted avg, Score ${score}  `;

    const popoverShowScore = review => (
      <Popover id="popover-positioned-top" title="Review Item Score">
        <div
          onMouseEnter={() => this.setState({ showPopoverCovered: true })}
          onMouseLeave={() => this.setState({ showPopoverCovered: false })}
        >
          <ItemScore
            {...{
              scoreNumber: review.mark !== null ? review.mark : 0,
              scoreName: scoreNames[review.mark !== null ? review.mark - 1 : 0],
              descriptionTitle: "Comments",
              description: review.comment !== null ? review.comment : "",
              importance: review.importance,
              review: review,
              item: review.item
            }}
          />
        </div>
      </Popover>
    );

    const renderScoreWithManyRI = ({
      _review,
      score,
      indexReview,
      currentReview,
      categoryId,
      checkpointId
    }) => {
      return (
        <ScoreIcon
          key={indexReview}
          score={score}
          dataTip={renderTooltip(_review.date, _review.count, score)}
          thisReview={currentReview}
          onClick={this.handleClickScore(_review, categoryId, checkpointId)}
          className={classNames.scoreSquare}
          tooltipId={`score-${_review.reviewId}${
            categoryId ? "-" + categoryId : ""
          }${checkpointId ? "-" + checkpointId : ""}`}
        />
      );
    };

    const renderScoreWithOneRI = ({
      _review,
      score,
      indexReview,
      currentReview,
      ref,
      categoryId,
      checkpointId
    }) => {
      return (
        <div
          key={indexReview}
          onMouseOver={() =>
            this.setState({
              showPopoverCovered: {
                [ref]: true
              }
            })
          }
          onMouseLeave={() =>
            this.setState({
              showPopoverCovered: {
                [ref]: false
              }
            })
          }
        >
          <ScoreIcon
            iconRef={nodo => (this.nodos[ref] = nodo)}
            key={indexReview}
            score={score}
            thisReview={currentReview}
            onClick={this.handleClickScore(_review, categoryId, checkpointId)}
            className={classNames.scoreSquare}
            tooltipId={`score-${_review.reviewId}${
              categoryId ? "-" + categoryId : ""
            }${checkpointId ? "-" + checkpointId : ""}`}
          />
          <Overlay
            show={this.state.showPopoverCovered[ref]}
            onHide={() =>
              this.setState({
                showPopoverCovered: {
                  [ref]: false
                }
              })
            }
            target={this.nodos[ref]}
          >
            {popoverShowScore(_review)}
          </Overlay>
        </div>
      );
    };

    const renderScore = properties => {
      const { review, _review, score, indexReview } = properties;
      const { categoryId, checkpointId } = properties;
      let currentReview = parseInt(_review.reviewId) === parseInt(review.id);
      if (!score) {
        if (currentReview) {
          return (
            <ScoreIcon
              key={indexReview}
              score={0}
              whithoutChild={true}
              className={classNames.scoreSquare}
              onClick={this.handleClickScore(_review, categoryId, checkpointId)}
              tooltipId={`score-${_review.reviewId}${
                categoryId ? "-" + categoryId : ""
              }${checkpointId ? "-" + checkpointId : ""}`}
            />
          );
        }
        return null;
      }
      if (_review.count === 1) {
        return renderScoreWithOneRI({ ...properties, currentReview });
      }
      return renderScoreWithManyRI({ ...properties, currentReview });
    };
    if (!review) {
      return null;
    }
    const renderScoreCheckpoint = ({
      category,
      review = {},
      myCheckpoints
    }) => {
      const checkpoints = checkpointsScores
        .filter(({ accountId }) => (myCheckpoints ? accountId : !accountId))
        .filter(
          item => parseInt(category, 10) === parseInt(item.categoryId, 10)
        );
      return (
        <div>
          {checkpoints.map((_checkpoint, _indexCheckpoint) => {
            const currentReviewHasScore = _checkpoint.items.some(
              item => item.reviewId === review.id
            );
            const scores = this.getOrderedScores(_checkpoint.items, review.id);
            return (
              <li className="liScoreContainer" key={_indexCheckpoint}>
                <div className="scoreContainer">
                  {!currentReviewHasScore &&
                    renderScore({
                      review,
                      _review: { ...review, reviewId: review.id },
                      score: 0,
                      indexReview: 0,
                      categoryId: category,
                      checkpointId: _checkpoint.id,
                      ref: `target-review${
                        review.id
                      }-category-${category}-checkpoint${
                        _checkpoint.id
                      }-noscore`
                    })}

                  {_checkpoint.items.length
                    ? scores.map((_review, indexReview) => {
                        return renderScore({
                          review,
                          _review,
                          score: _review.score,
                          indexReview,
                          categoryId: category,
                          checkpointId: _checkpoint.id,
                          ref: `target-review${_review &&
                            _review.reviewId}-category-${category}-checkpoint${
                            _checkpoint.id
                          }`
                        });
                      })
                    : null}
                </div>
              </li>
            );
          })}
        </div>
      );
    };

    const renderHistoricalReviews = () => {
      const currentReviewHasScore = this.props.scores.historical.items.some(
        item => item.reviewId === review.id
      );
      const scores = this.getOrderedScores(
        this.props.scores.historical.items,
        review.id
      );
      return (
        <div className={"scoreBox"}>
          {!currentReviewHasScore &&
            renderScore({
              review,
              _review: { ...review, reviewId: review.id },
              score: 0,
              indexReview: 0,
              ref: `target-review${review && review.id}-noscore`
            })}
          {scores.map((_review, indexReview) => {
            return renderScore({
              review,
              _review,
              score: _review.score,
              indexReview,
              ref: `target-review${_review && _review.reviewId}-score-review`
            });
          })}
        </div>
      );
    };

    const renderCategoryScores = () => (
      <ul>
        {categoriesScores
          ? categoriesScores.map((_category, indexCategory) => {
              const currentReviewHasScore = _category.items.some(
                item => item.reviewId === review.id
              );
              const scores = this.getOrderedScores(_category.items, review.id);
              return (
                <li
                  key={indexCategory}
                  className={
                    parseInt(_category.id) === parseInt(categoryId)
                      ? classNames.itemCategorySelected + " x"
                      : classNames.itemCategory + " x"
                  }
                >
                  <div className="scoreContainer">
                    {!currentReviewHasScore &&
                      renderScore({
                        review,
                        _review: { ...review, reviewId: review.id },
                        score: 0,
                        indexReview: 0,
                        categoryId: _category.id,
                        ref: `target-review${review &&
                          review.id}-category-noscore`
                      })}
                    {_category.items.length
                      ? scores.map((_review, indexReview) => {
                          return renderScore({
                            review,
                            _review,
                            score: _review.score,
                            indexReview,
                            categoryId: _category.id,
                            ...(_review.count === 1 && {
                              checkpointId: _review.item.checkpointId
                            }),
                            ref: `target-review${_review &&
                              _review.reviewId}-category-${_review.count > 0 &&
                              _category.id}`
                          });
                        })
                      : null}
                  </div>
                </li>
              );
            })
          : null}
      </ul>
    );
    const renderScoreMenuCategory = () => (
      <Row>
        <Col md={5} className="noPadding">
          <div className={classNames.leftGray}>
            <div className="sideTitle">
              <div className="textTitle">{(review.vendor || {}).name}</div>
              {renderHistoricalReviews()}
            </div>
            <CategoryMenu {...handlersCategory} />
          </div>
        </Col>
        <Col md={7} className="noPadding">
          <div className="arrowTitleReview">
            <div>
              <p>This review</p>
              <p>Historical reviews</p>
            </div>
            <hr />
          </div>
          <div className="leftSide">{renderCategoryScores()}</div>
        </Col>
      </Row>
    );

    const renderScoreCategoryReport = () => (
      <React.Fragment>
        <Row>
          <Col md={12}>
            {renderHistoricalReviews()}
            <div className={"titleSide"} />
          </Col>
        </Row>
        <br />
        <div className={"titleSide"}>Category</div>
        <Row>
          <Col md={6}>
            <div className={classNames.leftGray}>
              <CategoryMenu {...handlersCategory} />
            </div>
          </Col>
          <Col className={"sideScoreReport"} md={6}>
            {renderCategoryScores()}
          </Col>
        </Row>
      </React.Fragment>
    );

    const renderLink = (review, limkComponet, property) =>
      (review || {})[property] ? (
        <span
          style={{
            fontSize: 24,
            padding: 10,
            marginTop: 20,
            cursor: "pointer"
          }}
          onClick={() =>
            this.props.history.push(
              "/assurance/review/" + (review || {})[property]
            )
          }
        >
          {" "}
          {limkComponet}
        </span>
      ) : null;

    const renderScoreMenuCheckpoint = () => (
      <div className="rightGray">
        <div
          className="sideTitle"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>{categoryName} Checkpoints</div>
          <React.Fragment>
            <div>{review.notes}</div>
            <div>
              {renderLink(review, "<", "previewReviewId")}
              <span>{reviewDate}</span>
              {renderLink(review, ">", "nextReviewId")}
            </div>
          </React.Fragment>
        </div>
        <Col md={6}>{menuchild}</Col>
        <Col md={6}>
          <ul>{renderScoreCheckpoint({ category: categoryId, review })}</ul>
          <ul style={{ marginTop: 46 }}>
            {!isActionLog &&
              renderScoreCheckpoint({
                category: categoryId,
                review,
                myCheckpoints: true
              })}
          </ul>
        </Col>
      </div>
    );
    const renderScoreReportCheckpoint = () => (
      <React.Fragment>
        <Row style={{ marginTop: 50 }}>
          <Col md={12}>
            <div className={"titleSide"}>Checkpoints</div>
          </Col>
          <Col md={6}>{menuchild}</Col>
          <Col md={6} className={"sideScoreReport"}>
            <ul>{renderScoreCheckpoint({ category: categoryId, review })}</ul>
            <ul style={{ marginTop: 46 }}>
              {!isActionLog &&
                renderScoreCheckpoint({
                  category: categoryId,
                  review,
                  myCheckpoints: true
                })}
            </ul>
          </Col>
        </Row>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Row style={{ margin: 0 }}>
          <Col md={6}>
            {isReport ? renderScoreCategoryReport() : renderScoreMenuCategory()}
          </Col>
          <Col md={6} className="noPadding">
            {isReport
              ? renderScoreReportCheckpoint()
              : renderScoreMenuCheckpoint()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(LayoutMenuGray);
