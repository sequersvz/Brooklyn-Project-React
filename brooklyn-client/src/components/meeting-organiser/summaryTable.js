import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { LoadingSpinner } from "../loading-spinner";
import ReviewItems from "../reviews/itemreviews";
import SortableCategory from "../sortable-category";
const styles = () => ({
  root: {
    width: "100%",
    overflowX: "hidden",
    marginBottom: "30px"
  },
  headCell: {
    fontWeight: "700"
  },
  cell: {
    fontSize: "1.3125rem"
  },
  pdfHead: {
    fontSize: "1.08rem !important"
  }
});

class SummaryTable extends React.PureComponent {
  render() {
    const {
      items,
      isPdf,
      loading,
      classes,
      isOldReview,
      categoryNAME,
      groupByCategory,
      handleOnAddMeetingItem,
      renderSummaryTableHead
    } = this.props;
    const isEmpty = items && items.length === 0;
    const mClass = isPdf ? classes.pdfHead : classes.headCell;

    return (
      <div className={classes.root}>
        {loading && <LoadingSpinner />}
        {!loading && isEmpty ? (
          <div style={{ height: "200px", textAlign: "center" }}>
            <p style={{ paddingTop: "75px" }}>No data to display</p>
          </div>
        ) : null}
        {!loading && !isEmpty ? (
          <div>
            {renderSummaryTableHead &&
              renderSummaryTableHead({ className: mClass, isPdf })}
            {groupByCategory ? (
              <SortableCategory
                {...this.props}
                renderReviewItems={items => (
                  <ReviewItems {...{ ...this.props, items }} />
                )}
              />
            ) : (
              <ReviewItems {...this.props} />
            )}

            {!isOldReview && !isPdf ? (
              <span className="btnAddItem" onClick={handleOnAddMeetingItem}>
                {`Add ${
                  categoryNAME === "Action Log" ? "Action" : "Meeting Item"
                }`}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(SummaryTable);

SummaryTable.propTypes = {
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool
};

SummaryTable.defaultProps = {
  items: [],
  loading: false
};
