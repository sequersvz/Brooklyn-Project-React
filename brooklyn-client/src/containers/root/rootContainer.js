import React, { Component } from "react";
import {
  getAllEntities,
  addEntity,
  delEntity,
  editEntity
} from "../service/root.service";

function MainRootContainer(WrappedComponent) {
  class RootContainer extends Component {
    state = {
      notify: { open: false, message: "", variant: "info", duration: 3000 },
      showEdit: {
        key: null,
        index: null
      },
      tableSchema: {
        rowInfo: [
          { name: `id`, size: 250, editable: false },
          { name: `name`, size: 250, editable: true },
          { name: `description`, size: 250, editable: true }
        ]
      }
    };

    entity = this.props.entity;
    defaultEntity = this.props.defaultEntity;
    withEntityGetAllEntities = getAllEntities(this.entity);
    withEntityAddEntity = addEntity(this.entity);
    withEntityDelEntity = delEntity(this.entity);
    withEntityEditEntity = editEntity(this.entity);

    onError = error => {
      let message = `ERROR - Something went wrong: `;
      if (
        (": " + (((error || {}).response || {}).data || {}).err || "").includes(
          "CONSTRAINT"
        )
      ) {
        message =
          message +
          "You can't delete this because there're other objects using it";
      }
      this.handlerNotify(message, "error");
      console.error("message", error);
    };
    closeAlert = () =>
      this.setState(prevState => ({
        ...prevState,
        notify: {
          ...prevState.notify,
          open: false
        }
      }));

    handlerNotify = (message, type) => {
      let objetNotify = {
        message: message,
        open: true,
        duration: 5000,
        variant: type
      };
      this.setState({ notify: objetNotify });
    };

    _getAllEntitiesOnSuccess = result => {
      this.setState({
        isLoaded: true,
        [this.entity]: result
      });
    };
    getAllEntities = this.withEntityGetAllEntities(
      this._getAllEntitiesOnSuccess,
      this.onError
    );

    _editEntityOnSuccess = () => {
      this.handlerNotify("Edit completed", "success");
      this.handlerShowEdit(null, null);
      this.getAllEntities();
    };

    editEntity = this.withEntityEditEntity(
      this._editEntityOnSuccess,
      this.onError
    );

    _addEntityOnSuccess = () => {
      this.handlerNotify("Item Created", "success");
      this.handlerShowEdit(null, null);
      this.getAllEntities();
    };

    _addEntityOnSuccess = this._addEntityOnSuccess;
    addEntity = this.withEntityAddEntity(
      this._addEntityOnSuccess,
      this.onError
    );

    _addDefaultEntity = () => {
      const properties = {
        ...this.defaultEntity
      };
      return this.addEntity(properties);
    };

    _deleteEntityOnSuccess = () => {
      this.handlerNotify("Item deleted", "success");
      this.handlerShowEdit(null, null);
      this.getAllEntities();
    };

    _deleteEntityOnSuccess = this._deleteEntityOnSuccess;

    deleteEntity = this.withEntityDelEntity(
      this._deleteEntityOnSuccess,
      this.onError
    );

    handlerShowEdit = (key, index) => {
      this.setState({
        showEdit: {
          key,
          index
        }
      });
    };

    componentDidMount() {
      this.getAllEntities();
    }

    render() {
      const handlers = {
        notify: this.state.notify,
        entity: this.state[this.entity],
        showEdit: this.state.showEdit,
        handlerShowEdit: this.handlerShowEdit,
        editEntity: this.editEntity,
        addEntity: this._addDefaultEntity,
        _addEntity: this.addEntity,
        tableSchema: this.props.tableSchema,
        getEntity: this.getAllEntities,
        delEntity: this.deleteEntity,
        parentProps: this.props,
        closeAlert: this.closeAlert
      };

      return (
        <div>
          <WrappedComponent {...handlers} />
        </div>
      );
    }
  }
  return RootContainer;
}

export default MainRootContainer;
