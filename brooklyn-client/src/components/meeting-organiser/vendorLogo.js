import React from "react";
import { host } from "../../config/config";

const VendorLogo = ({ vendor = {} }) =>
  vendor.logo ? (
    <img
      crossOrigin={"use-credentials"}
      origin={host}
      src={vendor.logo}
      alt="vendor logo"
      className={"vendorLogo"}
    />
  ) : (
    <p>{vendor.name}</p>
  );
export default VendorLogo;
