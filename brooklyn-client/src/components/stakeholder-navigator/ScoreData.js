import React from "react";
import ReactTooltip from "react-tooltip";
import { getColorFromScore } from "../../Utils";
import moment from "moment";

const StakeholderScoreData = ({ vendor }) => {
  const squareStyle = {
    fontSize: "15px",
    padding: "5px",
    marginRight: "10px",
    cursor: "default"
  };
  return (
    <div>
      {vendor.score ? (
        <>
          <span
            style={{
              ...squareStyle,
              background: getColorFromScore(vendor.score)
            }}
            data-tip="Vendor Score"
            data-for="vendor-score-tooltip"
          >
            {vendor.score}
          </span>
          <span style={{ fontSize: "15px" }}>({vendor.position})</span>
          <ReactTooltip id="vendor-score-tooltip" />
        </>
      ) : (
        <p style={{ fontSize: "15px" }}>This vendor has no score yet</p>
      )}
      <p style={{ fontWeight: "600", marginTop: "10px" }}>
        SRM: {vendor.srm || "No SRM assigned"}
      </p>
      <p>
        Next Review:{" "}
        {vendor.nextReview
          ? moment(vendor.nextReview).format("DD-MM-YYYY [at] HH:mm")
          : "None"}
      </p>
    </div>
  );
};

export default StakeholderScoreData;
