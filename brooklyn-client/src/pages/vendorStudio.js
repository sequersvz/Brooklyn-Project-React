import React from "react";
import ContainerVendorStudio from "../containers/app/vendorStudio";

const VendorStudio = ({ routes, ...props }) => (
  <div>
    <ContainerVendorStudio routes={routes} {...props} />
  </div>
);

export default VendorStudio;
