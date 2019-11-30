import React from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const vendors = [
  { name: "Car Fix Co." },
  { name: "Home Cover" },
  { name: "Mobile Gadget Co." },
  { name: "Plane Sailing" },
  { name: "Southfields LTD" }
];

const VendorsManagedByUser = () => {
  if (vendors.length === 0) {
    return <p>{"You currently don't manage any vendors"}</p>;
  }

  const vendorsList = vendors.map((vendor, i) => (
    <tr key={i}>
      <td style={{ fontSize: "14px", color: "gray" }}>{vendor.name}</td>
      <td style={{ textAlign: "end", color: "gray" }}>
        <FontAwesomeIcon icon="angle-double-up" style={{ fontSize: "20px" }} />
      </td>
    </tr>
  ));

  return (
    <React.Fragment>
      <p style={{ marginTop: "30px", fontSize: "24px" }}>
        Vendors for which you are lead relationship manager
      </p>
      <Table>
        <tbody>{vendorsList}</tbody>
      </Table>
    </React.Fragment>
  );
};

export default VendorsManagedByUser;
