import React, { Component } from "react";
import RootLayout from "../../components/root/roo-layout/root-loyout";
import RootContainer from "../../containers/root/rootContainer";
import CategoryList from "../../components/categoryList-panel/index";
import { getAllEntities } from "../../containers/service/root.service";
import { Row, Col } from "react-bootstrap";
import { rootEditCheckpoints } from "../../containers/service/checkpoints.service";
class Checkpoints extends Component {
  state = {
    categoriesOptions: []
  };
  withEntityGetAllEntities = getAllEntities("category");
  getAllEntitiesOnSuccess = result => {
    this.setState(prevState => ({
      ...prevState,
      categoriesOptions: result.map(category => ({
        value: category.id,
        label: category.name
      }))
    }));
  };
  getAllEntitiesOnErro = error => {
    console.log(error);
  };
  getAllEntities = this.withEntityGetAllEntities(
    this.getAllEntitiesOnSuccess,
    this.getAllEntitiesOnErro
  );
  componentDidMount() {
    this.getAllEntities();
  }
  addEntityDefualt = categoryId => {
    const properties = {
      name: "Click to edit.",
      categoryId
    };
    this.props._addEntity(properties);
  };
  onError = error => {
    console.log(error);
  };
  rootEditCheckpointsOnSuccess = () => {
    this.props.handlerShowEdit(null, null);
    this.props.getEntity();
  };
  editCheckpoints = rootEditCheckpoints(
    this.rootEditCheckpointsOnSuccess,
    this.onError
  );
  render() {
    const checkTiers = {};
    for (let i = 1; i <= 5; i++) {
      checkTiers[i] =
        this.props.entity &&
        this.props.entity.filter(check => check[`pinnedTier${i}`] === 1).length;
    }
    return (
      <RootLayout
        {...this.props}
        editEntity={this.editCheckpoints}
        entity={(this.props.entity || []).map(item => ({
          ...item,
          isDisabled: item.system
        }))}
        overlay={
          <CategoryList
            categories={this.state.categoriesOptions}
            selectCategory={this.addEntityDefualt}
            title={"Category List"}
          />
        }
        Header={() => (
          <Row style={{ fontSize: 14 }}>
            <Col md={1} />
            {Object.keys(checkTiers).map(key => (
              <Col key={key} md={2}>
                Checkpoints Tier {key} : {checkTiers[key]}
              </Col>
            ))}
            <Col md={1} />
          </Row>
        )}
      />
    );
  }
}
const GreatGrandfather = wraperComponent => {
  const MyRootContainer = RootContainer(wraperComponent);
  const renderRootContainer = () => (
    <MyRootContainer
      entity={"checkpoints"}
      title={"Checkpoints"}
      tableSchema={{
        rowInfo: [
          { name: `id`, size: 100, editable: false },
          { name: `name`, size: 250, editable: true },
          { name: `categoryId`, size: 80, editable: true },
          { name: `enabled`, size: 80, editable: true },
          { name: `pinnedTier1`, size: 80, editable: true },
          { name: `pinnedTier2`, size: 80, editable: true },
          { name: `pinnedTier3`, size: 80, editable: true },
          { name: `pinnedTier4`, size: 80, editable: true },
          { name: `pinnedTier5`, size: 80, editable: true },
          { name: `accountId`, size: 80, editable: true }
        ]
      }}
      defaultEntity={{
        name: "Click to edit."
      }}
    />
  );
  return renderRootContainer;
};

export default GreatGrandfather(Checkpoints);
