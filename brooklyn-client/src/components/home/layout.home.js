import React from "react";
import Home from "./home";
import Loading from "../loading-spinner";
import { Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";

class LayoutHome extends React.Component {
  render() {
    const { showMockup, changeMockup } = this.props;
    const { load } = this.props;
    const { openModal, closeModal } = this.props;
    const { showModalAddInitiatives } = this.props;
    const { addInitiatives } = this.props;
    const {
      isErrorName,
      isErrorAmount,
      isErrorVendor,
      isErrorStatus,
      closeModalEvent
    } = this.props;
    const { handleInputChange } = this.props;
    const { vendors, getVendors, rawVendors } = this.props;
    const {
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange
    } = this.props;
    const {
      contracts,
      getContracts,
      homeData,
      usersWithVendors,
      getUsersWithVendors,
      getHomeData
    } = this.props;
    const { handleModalEditInitiativeActivityPipeLine } = this.props;
    const { deleteInitiative, InitiativeId } = this.props;
    const {
      initiativeToEdit,
      InitiativesName,
      InitiativesAmount,
      InitiativeVendor,
      InitiativeStatus,
      slugEditInitiatives,
      handleEditInitiatives,
      editInitiatives
    } = this.props;

    const handlerHomeMockup = {
      showMockup,
      changeMockup,
      openModal,
      closeModal,
      showModalAddInitiatives,
      vendorView: this.props.vendorView,
      addInitiatives,
      handleInputChange,
      click: this.props.handlerClick,
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange,
      vendors,
      getVendors,
      isErrorName,
      isErrorAmount,
      isErrorVendor,
      isErrorStatus,
      closeModalEvent,
      contracts,
      getContracts,
      homeData,
      usersWithVendors,
      getUsersWithVendors,
      getHomeData,
      handleModalEditInitiativeActivityPipeLine,
      InitiativesName,
      InitiativesAmount,
      InitiativeVendor,
      InitiativeStatus,
      slugEditInitiatives,
      handleEditInitiatives,
      editInitiatives,
      deleteInitiative,
      InitiativeId,
      initiativeToEdit,
      rawVendors
    };
    if (showMockup === "whatDoIHaveToDoToday") {
      return (
        <div>
          <Row className="show-grid">
            <Col xs={12} md={12} lg={12}>
              <span
                className={"whatDoIHaveToDoToday"}
                style={{
                  height: 1485,
                  position: "relative",
                  top: 20,
                  display: "block"
                }}
                onClick={e => {
                  e.preventDefault();
                  changeMockup("homeDashboard");
                }}
              />
              <span
                style={{
                  width: "82%",
                  height: 560,
                  position: "relative",
                  display: "block",
                  cursor: "pointer",
                  top: -1046,
                  left: 221
                }}
                onClick={e => {
                  e.preventDefault();
                  this.props.history.push("/assurance/review/3");
                }}
              />
            </Col>
          </Row>
        </div>
      );
    } else {
      return load ? (
        <Loading load />
      ) : (
        <Col lg={12}>
          <Home {...handlerHomeMockup} />
        </Col>
      );
    }
  }
}

export default withRouter(LayoutHome);
