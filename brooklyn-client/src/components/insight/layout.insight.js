import React, { PureComponent } from "react";
import InsightMockup from "./insight.mockup/insight_mockup";
import { mockup } from "../../config/config";
import CustomTabs from "../../assets/materialComponents/CustomTabs/CustomCard";
import "./insight.css";
import ItemReviews from "./items/insight.items";
import iconsDataStructure from "./structure.icons";
import FixedIcons from "../fixed-icon/fixed.icons";
import AddInsightModal from "./modals/addInsight.modal";
import { withRouter } from "react-router-dom";
import Loading from "../loading-spinner";
import { connect } from "react-redux";

class LayoutInsight extends PureComponent {
  componentDidMount() {
    setTimeout(() => this.props.changeLoad(false), 1500);
  }
  state = {
    showModal: false,
    item: null
  };
  loadItem = item => {
    this.setState({ item });
  };

  render() {
    const { showModalCreateInsight, showModalCreateReviewItem } = this.props;
    const {
      showMockup,
      showMockupLayout,
      insights,
      openModal,
      closeModal
    } = this.props;
    const { changeMockup, changeMockupLayout } = this.props;
    const {
      vendors,
      date,
      itemTitle,
      itemDescription,
      itemImpact,
      itemVendorId,
      itemInsightstatusId,
      itemTargetAmount,
      itemFindingAmount,
      itemOptimisedAmount,
      itemValidatedAmount,
      itemPctLikelihoodPessimistic,
      itemPctLikelihoodMiddle,
      itemPctLikelihoodOptimistic,
      itemCheckpointId,
      handleDateChange,
      handleInputChange,
      addInsights,
      insightStatus
    } = this.props;

    const { checkpoints, categories } = this.props;
    const { nextReview, editInsight, addReviewItem, checkpointId } = this.props;

    const handlerInsightItem = {
      items: insights,
      insightStatus,
      editInsight,
      nextReview,
      handleDateChange,
      handleInputChange,
      itemTitle,
      itemDescription,
      date,
      checkpointId,
      closeModal,
      openModal,
      showModalCreateReviewItem,
      addReviewItem,
      categories,
      checkpoints,
      loadItem: this.loadItem,
      vendors
    };
    const { load } = this.props;
    const handlerInsightMockup = {
      showMockup,
      changeMockup,
      mockup,
      changeMockupLayout
    };

    const handlerIconsStructure = {
      openModalAdd: () => openModal("createInsight")
    };
    const handlerAddInsightModal = {
      close: () => {
        this.setState({ item: null });
        closeModal("createInsight");
      },
      show: showModalCreateInsight,
      vendors,
      date,
      itemTitle,
      itemDescription,
      itemImpact,
      itemVendorId,
      itemInsightstatusId,
      itemTargetAmount,
      itemFindingAmount,
      itemOptimisedAmount,
      itemValidatedAmount,
      itemPctLikelihoodPessimistic,
      itemPctLikelihoodMiddle,
      itemPctLikelihoodOptimistic,
      itemCheckpointId,
      handleInputChange,
      handleDateChange,
      addInsights,
      insightStatus,
      checkpoints,
      categories,
      item: this.state.item,
      editInsight
    };

    const iconsData = iconsDataStructure(handlerIconsStructure);

    if (showMockup === "insightDashboardProd") {
      return (
        <div>
          <Loading load={load} />
          <div
            className="insightBack"
            style={{ display: load === true ? "none" : "block" }}
          >
            <div
              className="col-xs-9 col-md-9"
              style={{
                position: "relative",
                display:
                  showMockupLayout === "insightShowCase" ? "none" : "block"
              }}
            >
              <CustomTabs
                headerColor="warning"
                title="Insight"
                headerStyle={{ fontSize: 18 }}
                cardBodyContent={<ItemReviews {...handlerInsightItem} />}
              />
              <FixedIcons iconsData={iconsData} />
              <AddInsightModal {...handlerAddInsightModal} />
            </div>
            <div
              className="col-xs-12 col-md-12 insightShowCase"
              style={{
                position: "relative",
                display:
                  showMockupLayout !== "insightShowCase" ? "none" : "block",
                cursor: "pointer"
              }}
              onClick={e => {
                e.preventDefault();
                changeMockupLayout("insightDashboard");
              }}
            />
            <div className="col-xs-3 col-md-3">
              <span
                className={"insightNumbersPiece"}
                style={{
                  width: 253,
                  height: 189,
                  float: "right",
                  position: "relative",
                  top: 20,
                  left: -44,
                  display:
                    showMockupLayout === "insightShowCase" ? "none" : "block",
                  cursor: "pointer"
                }}
                onClick={e => {
                  e.preventDefault();
                  changeMockupLayout("insightShowCase");
                }}
              />
              <span
                className={"machineLearningStudioPiece"}
                style={{
                  width: 253,
                  height: 272,
                  float: "right",
                  position: "relative",
                  top: 38,
                  left: -44,
                  display:
                    showMockupLayout === "insightShowCase" ? "none" : "block"
                }}
                onClick={() => {
                  if (/@brooklynva.com$/.test(this.props.userEmail)) {
                    this.props.history.push("machine-learning-studio");
                  }
                }}
              />
              <span
                className={"invoiceStudioPiece"}
                style={{
                  width: 253,
                  height: 270,
                  float: "right",
                  position: "relative",
                  top: 17,
                  left: -44,
                  display:
                    showMockupLayout === "insightShowCase" ? "none" : "block"
                }}
                onClick={e => {
                  e.preventDefault();
                  this.props.history.push("invoice-studio");
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Loading load={load} />
        <div style={{ display: load === true ? "none" : "block" }}>
          <InsightMockup {...handlerInsightMockup} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userEmail: ((state.user || {}).attributes || {}).email || ""
});

export default connect(mapStateToProps)(withRouter(LayoutInsight));
