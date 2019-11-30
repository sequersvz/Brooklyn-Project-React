import React, { PureComponent } from "react";
import DinamicTable from "../dinamic.table";
import iconsDataStructure from "./structure.icons";
import FixedIcons from "../../fixed-icon/fixed.icons";
import Alert from "../../snackbar-alert";
import ModalRemoveReviewItem from "../../reviews/modals/remove.modal";

class RootLayout extends PureComponent {
  state = {
    modalRemoveItem: {
      show: false
    }
  };
  nodos = {};

  handleDeleteItem = itemId => {
    this.setState({
      modalRemoveItem: {
        show: true,
        click: () => {
          this.props.delEntity(itemId);
          this.setState({ modalRemoveItem: { show: false } });
        },
        close: () => this.setState({ modalRemoveItem: { show: false } }),
        objectName: (this.props.entity.find(item => item.id === itemId) || {})
          .name
      }
    });
  };

  render() {
    const { entity, showEdit, handlerShowEdit, handleInputChange } = this.props;
    const { modalRemoveItem } = this.state;
    const { tableSchema, tableValues, addEntity, getEntity } = this.props;
    const { editEntity, parentProps, overlay, Header } = this.props;
    const {
      notify,
      closeAlert,
      dependencies,
      showComponentEdit,
      componentEdit,
      handleShowEditComponent
    } = this.props;

    let items =
      entity &&
      entity.reduce((items, checkpoint) => {
        if (checkpoint.name === "Click to edit.") {
          items.unshift(checkpoint);
          return items;
        }
        items.push(checkpoint);
        return items;
      }, []);

    const handlerTable = {
      items,
      showEdit,
      handlerShowEdit,
      edit: editEntity,
      handleInputChange,
      tableSchema,
      tableValues,
      del: this.handleDeleteItem,
      dependencies,
      handleShowEditComponent
    };
    const handlerIconsStructure = {
      get: getEntity,
      add: !overlay && addEntity,
      overlay: overlay && overlay,
      title: parentProps.title
    };
    const iconsData = iconsDataStructure(handlerIconsStructure);
    return (
      <div className={"table-conten"}>
        <Alert {...notify} handleClose={closeAlert} />
        {showComponentEdit ? (
          componentEdit
        ) : (
          <div className={"table-conten"}>
            <Alert {...notify} handleClose={closeAlert} />
            <div className={"container"}>{Header && <Header />}</div>
            <DinamicTable {...handlerTable} />
            <FixedIcons iconsData={iconsData} />
          </div>
        )}
        {modalRemoveItem.show && (
          <ModalRemoveReviewItem
            {...{
              show: modalRemoveItem.show,
              closeModal: modalRemoveItem.close,
              handlerClick: modalRemoveItem.click,
              name: "modalRemoveItem",
              modalName: "Item",
              objectName: modalRemoveItem.objectName
            }}
          />
        )}
      </div>
    );
  }
}

export default RootLayout;
