import React from "react";
import RootLayout from "../../components/root/roo-layout/root-loyout";
import RootContainer from "../../containers/root/rootContainer";
const MyRootContainer = RootContainer(RootLayout);
const BusinessUnit = () => (
  <MyRootContainer
    entity={"businessunits"}
    title={"Business Unit"}
    tableSchema={{
      rowInfo: [
        { name: `id`, size: 400, editable: false },
        { name: `name`, size: 400, editable: true }
      ]
    }}
    defaultEntity={{
      name: "Click to edit."
    }}
  />
);

export default BusinessUnit;
