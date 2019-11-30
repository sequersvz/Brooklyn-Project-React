import React from "react";
import RootLayout from "../../components/root/roo-layout/root-loyout";
import RootContainer from "../../containers/root/rootContainer";
const MyRootContainer = RootContainer(RootLayout);
const SourcingCategory = () => (
  <MyRootContainer
    entity={"sourcingCategory"}
    title={"Sourcing Category"}
    tableSchema={{
      rowInfo: [
        { name: `id`, size: 250, editable: false },
        { name: `name`, size: 250, editable: true },
        { name: `description`, size: 250, editable: true },
        { name: `parentId`, size: 250, editable: true }
      ]
    }}
    defaultEntity={{
      name: "Click to edit."
    }}
  />
);

export default SourcingCategory;
