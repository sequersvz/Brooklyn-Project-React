import React from "react";
import { formatToUnits } from "../../Utils";

const StakeholderMiscInformation = ({ vendor }) => {
  const fontWeight = "600";
  return (
    <div style={{ paddingTop: "15px" }}>
      <p>
        <span style={{ fontWeight }}>Internal Service: </span>
        {vendor.internalService || "None assigned"}
      </p>
      <p>
        <span style={{ fontWeight }}>Business Unit: </span>
        {vendor.businessUnit || "None assigned"}
      </p>
      <p>
        <span style={{ fontWeight }}>Total contract value: </span>£{" "}
        {formatToUnits(vendor.totalContractValue)}
      </p>
      <p>
        <span style={{ fontWeight }}>Contract Expiry: </span>
        {vendor.contractExpiry}
      </p>
    </div>
  );
};

export default StakeholderMiscInformation;
