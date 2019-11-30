import React, { Fragment } from "react";
import CustomDropzone from "./dropzone.component";
import OwnerDescriptionComponent from "./ownerdescriptionitem.component";
import { Panel, Row, Col } from "react-bootstrap";
export default function CustomPanel({
  item,
  isAgenda,
  openPanel,
  isOldReview,
  categoryName,
  handleOnPanelClick,
  handlerCustomDropZone,
  handlerOwnerDescriptionComponent
}) {
  const { closed, deferred, ready } = item;
  let panelStyle = {
    border: "none",
    boxShadow: "none",
    marginBottom: 0
  };
  panelStyle =
    isAgenda && (closed || deferred) && !ready
      ? { ...panelStyle, backgroundColor: "#f5f5f5" }
      : panelStyle;

  const panelContent = () => {
    const isAction = categoryName === "Action Log";
    const isMeetingItem = item.reviewcheckpointId === null;

    const actionContent = (
      <OwnerDescriptionComponent
        {...{ ...handlerOwnerDescriptionComponent, isOldReview }}
      />
    );
    return (
      <Fragment>
        <Row>
          <Col md={isAction ? 8 : 12}>
            {isAgenda && (
              <h3 style={{ margin: 0 }}>
                <strong>Description</strong>
              </h3>
            )}
            <CustomDropzone {...{ ...handlerCustomDropZone, isMeetingItem }} />
          </Col>
          {isAction && <Col md={4}>{isAction ? actionContent : null}</Col>}
        </Row>
        <br />
        {!isOldReview &&
          !isMeetingItem && (
            <span style={{ float: "right", fontSize: 10 }}>
              Drop files here, or{" "}
              <span onClick={handleOnPanelClick} style={{ color: "blue" }}>
                upload from your computer{" "}
              </span>
            </span>
          )}
      </Fragment>
    );
  };
  const isItemPanelOpen = !!(
    openPanel &&
    typeof openPanel[item.id] !== "undefined" &&
    openPanel[item.id].open === true
  );

  return isItemPanelOpen ? (
    <Panel
      id="demo"
      key={`panel-${item.id}`}
      style={panelStyle}
      expanded={isItemPanelOpen}
      onToggle={() => {}}
    >
      <Panel.Collapse>
        <Panel.Body>{panelContent()}</Panel.Body>
      </Panel.Collapse>
    </Panel>
  ) : null;
}
