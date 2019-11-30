import React, { Component } from "react";
import RootLayout from "../../../components/root/roo-layout/root-loyout";
import RootContainer from "../../../containers/root/rootContainer";
import { getAllEntities } from "../../../containers/service/root.service";
import KeyProcessEdit from "../../../components/configuration/tabs/keyprocess/keyprocessEdit";
import CategoryList from "../../../components/categoryList-panel/index";

class KeyProcess extends Component {
  state = {
    eventtypeId: [],
    files: [],
    showAlert: false
  };

  setShowAlert = (set, alertMessage) =>
    this.setState({ showAlert: set, alertMessage });

  handlerOnSuccess = name => result => {
    result = result.map(item => ({ label: item.name, value: item.id }));
    this.setState(prevState => ({ ...prevState, [name]: result }));
  };
  handlerFrequencyOnSuccess = name => result => {
    result = result.map(item => ({
      label: item.reviewFrequency,
      value: item.number
    }));
    this.setState(prevState => ({ ...prevState, [name]: result }));
  };
  getEventtypes = getAllEntities("keyprocess/eventtype")(
    this.handlerOnSuccess("eventtypeId")
  );

  handleShowEditComponentGoBack = () => {
    this.setState({ showComponentEdit: false });
  };

  handlerChange = (event, item) => {
    const value = event.target.value;
    const propertie = event.target.name;
    if (!(item[propertie] === value)) {
      this.props.editEntity(item.id, { [propertie]: value });
      this.setState({
        tableValues: {}
      });
    }
  };
  handleEnter = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  };

  handleShowEditComponent = id => {
    getAllEntities(`keyprocess/${id}/files`)(results => {
      this.setState({
        showComponentEdit: true,
        showItemId: id,
        files: results
      });
    })();
  };

  concatKeyProcessFiles = files => {
    this.setState(prevState => ({
      ...prevState,
      files: [...prevState.files, ...files]
    }));
  };

  filterKeyProcessFile = fileId => {
    this.setState(prevState => ({
      ...prevState,
      files: [...prevState.files.filter(file => file.id !== fileId)]
    }));
  };

  addEntityDefualt = eventtypeId => {
    const properties = {
      name: "Click to edit.",
      tier1Frequency: 1,
      tier2Frequency: 1,
      tier3Frequency: 1,
      tier4Frequency: 1,
      tier5Frequency: 1,
      eventtypeId
    };
    this.props._addEntity(properties);
  };

  componentDidMount() {
    this.getEventtypes();
  }
  render() {
    return (
      <RootLayout
        {...{ ...this.props, ...this.state }}
        entity={(this.props.entity || []).map(item => ({
          ...item,
          isDisabled: item.system
        }))}
        dependencies={{ ...this.state }}
        showComponentEdit={this.state.showComponentEdit}
        componentEdit={
          <KeyProcessEdit
            {...{
              ...this.props,
              item: (this.props.entity || []).find(
                itm => itm.id === this.state.showItemId
              ),
              dependencies: this.state,
              handleEnter: this.handleEnter,
              handlerEdit: this.handlerChange,
              handleShowEditComponentGoBack: this.handleShowEditComponentGoBack,
              concatKeyProcessFiles: this.concatKeyProcessFiles,
              filterKeyProcessFile: this.filterKeyProcessFile
            }}
          />
        }
        overlay={
          <CategoryList
            categories={this.state.eventtypeId}
            selectCategory={this.addEntityDefualt}
            title={"Event Type List"}
          />
        }
        handleShowEditComponent={this.handleShowEditComponent}
      />
    );
  }
}

const GreatGrandfather = wraperComponent => {
  const MyRootContainer = RootContainer(wraperComponent);
  const UserGroup = () => (
    <MyRootContainer
      entity={"keyprocess"}
      title={"Key Process"}
      tableSchema={{
        rowInfo: [
          { name: `id`, size: 250, editable: false, label: "id" },
          { name: `name`, size: 250, editable: true, label: "name" },
          {
            name: `eventtypeId`,
            size: 250,
            editable: true,
            type: "select",
            label: "Event Type"
          }
        ]
      }}
      defaultEntity={{
        name: "Click to edit.",
        tier1Frequency: 1,
        tier2Frequency: 1,
        tier3Frequency: 1,
        tier4Frequency: 1,
        tier5Frequency: 1
      }}
    />
  );
  return UserGroup;
};

export default GreatGrandfather(KeyProcess);
