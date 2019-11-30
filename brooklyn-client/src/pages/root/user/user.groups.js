import React, { Component } from "react";
import RootLayout from "../../../components/root/roo-layout/root-loyout";
import RootContainer from "../../../containers/root/rootContainer";
import { getAllEntities } from "../../../containers/service/root.service";

class UserGroups extends Component {
  state = {
    owners: []
  };

  getOwnersOnSuccess = result => {
    result = result.map(group => ({ label: group.name, value: group.id }));
    this.setState({ owners: result });
  };
  getOwners = getAllEntities("user/owners")(this.getOwnersOnSuccess);

  componentDidMount() {
    this.getOwners();
  }
  render() {
    const entity = (this.props.entity || []).map(group => ({
      ...group,
      owner: (group.owner || {}).name
    }));
    return (
      <RootLayout
        {...this.props}
        entity={entity}
        dependencies={{ ownerId: this.state.owners }}
      />
    );
  }
}

const GreatGrandfather = wraperComponent => {
  const MyRootContainer = RootContainer(wraperComponent);
  const UserGroup = () => (
    <MyRootContainer
      entity={"user/groups"}
      title={"Groups"}
      tableSchema={{
        rowInfo: [
          { name: `id`, size: 250, editable: false, label: "id" },
          { name: `name`, size: 250, editable: true, label: "name" },
          {
            name: `ownerId`,
            size: 250,
            editable: true,
            type: "select",
            label: "owner"
          }
        ]
      }}
      defaultEntity={{
        name: "Click to edit."
      }}
    />
  );

  return UserGroup;
};

export default GreatGrandfather(UserGroups);
