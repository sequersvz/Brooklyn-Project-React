import React from "react";
import FixedIcons from "../fixed-icon/fixed.icons";
import iconsDataStructure from "./structure.icons";
import ModalAddVendor from "./modals/addVendor.modal";
import ModalRemoveVendor from "./modals/removeVendor.modal";
import LoadingSpinner from "../loading-spinner";
import VendorsTable from "./vendorsTable";
import SearchKit from "../search-kit";
import Alert from "../snackbar-alert";

class LayoutVendorStudio extends React.Component {
  state = {
    vendorId: undefined
  };

  render() {
    const { vendors, vendor } = this.props;
    const {
      openModal,
      closeModal,
      name,
      vendorLogoUploaded,
      logo,
      handleDeleteVendor,
      vendorFiles
    } = this.props;
    const { showModalAddVendor, showModalRemoveVendor } = this.props;
    const {
      addVendor,
      removeVendor,
      getVendors,
      loadingVendors,
      vendorsCount
    } = this.props;
    const { handleInputChange } = this.props;
    const { load } = this.props;
    const { vendorQueryString } = this.props;
    const { isErrorName } = this.props;
    const { closeModalAddVendorEvent } = this.props;
    const { disableSaveButton } = this.props;
    const { putAttachments } = this.props;
    const { handleShowUploadingMessage, showUploadingMessage } = this.props;
    const { alert, closeAlert } = this.props;

    const openModalAddVendor = () => openModal("showModalAddVendor");
    const importCsv = () => {
      this.props.history.push("/integrations/csv");
    };
    const importApi = () => {
      this.props.history.push("/integrations/api");
    };
    const closeModalAddVendor = () => {
      closeModalAddVendorEvent();
      closeModal("showModalAddVendor");
    };
    const closeModalRemoveVendor = () => closeModal("showModalRemoveVendor");
    const handlerIconsStructure = {
      openModalAddVendor,
      importCsv,
      importApi
    };
    const HandlerModalAdd = {
      show: showModalAddVendor,
      close: closeModalAddVendor,
      addVendor,
      handleInputChange,
      vendor,
      name,
      vendorLogoUploaded,
      isErrorName,
      putAttachments,
      handleShowUploadingMessage,
      showUploadingMessage,
      logo,
      disableSaveButton,
      vendorFiles
    };
    const HandlerModalRemove = {
      show: showModalRemoveVendor,
      close: closeModalRemoveVendor,
      removeVendor
    };

    const iconsData = iconsDataStructure(handlerIconsStructure);

    const vendorsTableProps = {
      vendors,
      onClickDelete: vendor => {
        handleDeleteVendor(vendor.id);
        openModal("showModalRemoveVendor");
      },
      loading: loadingVendors,
      getVendors,
      totalSize: vendorsCount
    };

    return (
      <React.Fragment>
        {load && <LoadingSpinner load />}
        <div className="col-md-12" style={{ display: load ? "none" : "block" }}>
          <SearchKit
            getAllWithFilters={filters => {
              getVendors(undefined, { name: vendorQueryString }, filters);
            }}
          >
            <div className="row">
              <div className="col-md-12">
                <VendorsTable {...vendorsTableProps} />
              </div>
            </div>
          </SearchKit>
          <FixedIcons iconsData={iconsData} />
          <ModalAddVendor {...HandlerModalAdd} />
          <ModalRemoveVendor {...HandlerModalRemove} />
          <Alert
            open={alert.open}
            message={alert.message}
            duration={alert.duration}
            variant={alert.variant}
            handleClose={closeAlert}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default LayoutVendorStudio;
