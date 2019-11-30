import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ActivityPipelineChart from "../ActivityPipelineChart";
import "./home.css";
import KpiBar from "./kpiBar";
import { Row, Col } from "react-bootstrap";
import iconsDataStructure from "./structure.icons";
import FixedIcons from "../fixed-icon/fixed.icons";
import AddInitiativesModal from "./modals/addInitiatives.modal";
import Searchkit from "../search-kit";

class Home extends Component {
  goToStakeholderView = () => this.props.history.push("/stakeholder");
  render() {
    const { openModal } = this.props;
    const { showModalAddInitiatives } = this.props;
    const { addInitiatives } = this.props;
    const { handleInputChange } = this.props;
    const {
      vendors,
      getVendors,
      homeData,
      getHomeData,
      rawVendors
    } = this.props;
    const { contracts, getContracts } = this.props;
    const { deleteInitiative, InitiativeId } = this.props;
    const {
      isErrorName,
      isErrorAmount,
      isErrorVendor,
      isErrorStatus,
      closeModalEvent
    } = this.props;
    const {
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange
    } = this.props;
    const {
      InitiativesName,
      InitiativesAmount,
      InitiativeVendor,
      InitiativeStatus,
      slugEditInitiatives,
      handleEditInitiatives,
      editInitiatives,
      initiativeToEdit,
      usersWithVendors,
      getUsersWithVendors
    } = this.props;
    let showKpiBarComponent = (
      <KpiBar vendors={vendors} homeData={homeData} users={usersWithVendors} />
    );
    const { handleModalEditInitiativeActivityPipeLine } = this.props;
    const openModalInitiatives = () => {
      handleEditInitiatives(false);
      openModal("showModalAddInitiatives");
    };
    const openModalEditInitiatives = contract => {
      openModal("showModalAddInitiatives");
      handleModalEditInitiativeActivityPipeLine(contract);
    };
    let showPipelineChart = (
      <ActivityPipelineChart
        contracts={contracts}
        openModalInitiatives={openModalEditInitiatives}
        handleEditInitiatives={handleEditInitiatives}
      />
    );
    const handlerIconsStructure = {
      openModalInitiatives,
      goToStakeholderView: this.goToStakeholderView
    };
    const modalHandldersInitiatives = {
      close: closeModalEvent,
      show: showModalAddInitiatives,
      addInitiatives,
      handleInputChange,
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange,
      getVendors,
      isErrorName,
      isErrorAmount,
      isErrorVendor,
      isErrorStatus,
      InitiativesName,
      InitiativesAmount,
      InitiativeVendor,
      InitiativeStatus,
      slugEditInitiatives,
      editInitiatives,
      InitiativeId,
      deleteInitiative,
      handleEditInitiatives,
      initiativeToEdit,
      rawVendors
    };
    const iconsData = iconsDataStructure(handlerIconsStructure);
    return (
      <div>
        <Searchkit
          getAllWithFilters={(filters = {}) => {
            getContracts(filters);
            getVendors(filters);
            getHomeData(filters);
            getUsersWithVendors(filters);
          }}
        >
          <Row className="show-grid home-container">
            <Col md={12}>
              <div className="kpiBarcontainer">
                {showKpiBarComponent}
                {showPipelineChart}
              </div>
            </Col>
          </Row>
          <div>
            <AddInitiativesModal {...modalHandldersInitiatives} />
            <FixedIcons iconsData={iconsData} aditionTop={300} />
          </div>
        </Searchkit>
      </div>
    );
  }
}

export default withRouter(Home);
