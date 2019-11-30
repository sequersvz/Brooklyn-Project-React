import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import * as icons from "@fortawesome/free-solid-svg-icons/index";
import { Overlay } from "react-bootstrap";

export const EqualsIcon = ({ style, sortableHandle, handleOnDoubleClick }) => {
  const Equals = () => (
    <FontAwesomeIcon
      icon={icons["faEquals"]}
      pull="left"
      color={"grey"}
      onDoubleClick={handleOnDoubleClick}
      style={{
        cursor: "pointer",
        marginRight: 10,
        marginTop: 1,
        ...style
      }}
    />
  );
  if (!sortableHandle) return <Equals />;
  const SortableIcon = sortableHandle(() => <Equals />);
  return <SortableIcon />;
};
export const CloseIcon = ({
  style,
  nodos,
  showOverlay,
  handleOnHide,
  isOldReview,
  handleOnClick,
  renderSelectScore
}) => {
  return (
    !isOldReview && (
      <div>
        <div
          style={{ width: "auto" }}
          ref={nodo => (nodos["overlayItem"] = nodo)}
        >
          <FontAwesomeIcon
            icon={icons["faArrowAltCircleDown"]}
            pull="right"
            color={"gray"}
            onClick={handleOnClick}
            style={{ cursor: "pointer", ...style }}
            data-tip={`Close ${messageIsOldReview(isOldReview)}`}
          />
        </div>
        <Overlay
          show={showOverlay}
          onHide={handleOnHide}
          placement="top"
          target={((nodos["overlayItem"] || {}).children || [])[0]}
        >
          {renderSelectScore()}
        </Overlay>
      </div>
    )
  );
};

export const TrashIcon = ({ style, isOldReview, handleOnClick }) =>
  !isOldReview && (
    <FontAwesomeIcon
      icon={icons["faTrash"]}
      pull="right"
      onClick={handleOnClick}
      color={"grey"}
      style={{ cursor: "pointer", ...style }}
      data-tip="Delete"
    />
  );

export const ReadyIcon = ({ style, position, isOldReview, handleOnClick }) =>
  !isOldReview && (
    <FontAwesomeIcon
      icon={icons[`faArrowAltCircle${getIconPosition(position)}`]}
      pull="right"
      onClick={handleOnClick}
      color={"grey"}
      style={{ cursor: "pointer", ...style }}
      data-tip={`Ready ${messageIsOldReview(isOldReview)}`}
    />
  );

export const DeferIcon = ({
  style,
  isOldReview,
  handleOnClick,
  deferredIconColor = "grey"
}) => {
  let action = deferredIconColor !== "grey" ? "ready" : "deferred";
  return !isOldReview ? (
    <FontAwesomeIcon
      icon={icons["faClock"]}
      pull="right"
      onClick={handleOnClick(action)}
      color={deferredIconColor}
      style={{ cursor: "pointer", ...style }}
      data-tip={`Defer ${messageIsOldReview(isOldReview)}`}
    />
  ) : null;
};

export const OpenIcon = ({ style, isOldReview, handleOnClick }) =>
  !isOldReview && (
    <FontAwesomeIcon
      icon={icons["faArrowAltCircleUp"]}
      pull="right"
      onClick={handleOnClick}
      color={"grey"}
      style={{ cursor: "pointer", ...style }}
      data-tip={`Open ${messageIsOldReview(isOldReview)}`}
    />
  );

export const PaperclipIcon = ({ style, isOldReview }) =>
  !isOldReview && (
    <FontAwesomeIcon
      icon={icons["faPaperclip"]}
      color={"grey"}
      style={{
        fontSize: 20,
        cursor: "default",
        ...style
      }}
    />
  );

export const RecurringIcon = ({
  style,
  color,
  isOldReview,
  categoryName,
  handleOnClick
}) =>
  !isOldReview && (
    <FontAwesomeIcon
      color={color}
      pull="right"
      icon={icons["faRedo"]}
      onClick={handleOnClick}
      style={{
        cursor: "pointer",
        display: categoryName !== "Action Log" ? "block" : "none",
        ...style
      }}
      data-tip={`Recurring ${messageIsOldReview(isOldReview)}`}
    />
  );

export const ActionIcon = ({
  item,
  style,
  isOldReview,
  categoryName,
  handleOnClick
}) =>
  !isOldReview && (
    <FontAwesomeIcon
      icon={icons["faFire"]}
      pull="right"
      onClick={handleOnClick}
      color={item.actioned ? "#00d3ee" : "gray"}
      style={{
        cursor: item.actioned ? "default" : "pointer",
        display: categoryName !== "Action Log" ? "block" : "none",
        ...style
      }}
      data-tip={getActionMessage({ isOldReview, item })}
    />
  );

export const CategoryIcon = ({ icon, style }) => (
  <FontAwesomeIcon
    icon={icon}
    pull="left"
    color={"gray"}
    style={{
      fontSize: 20,
      cursor: "default",
      marginTop: -3,
      ...style
    }}
  />
);

export const AttendeePologiesIcon = ({ icon, style }) => (
  <FontAwesomeIcon
    icon={!icon ? icons["faUserCheck"] : icons["faUserTimes"]}
    pull="right"
    color={"#555555"}
    style={{
      fontSize: 18,
      cursor: "default",
      marginTop: -25,
      ...style
    }}
  />
);

export const RiskIcon = ({ item, addRisk, style }) => (
  <FontAwesomeIcon
    icon={icons["faExclamationTriangle"]}
    pull="right"
    color={item.riskId ? "#00d3ee" : "grey"}
    style={{
      ...style,
      cursor: item.riskId ? "default" : "pointer"
    }}
    data-tip={item.riskId ? "Risk Item Created" : "Create risk item"}
    onClick={() => {
      if (!item.riskId) {
        addRisk(item);
      }
    }}
    onDoubleClick={e => e.stopPropagation()}
  />
);

const getActionMessage = ({ isOldReview, item }) => {
  if (isOldReview) return "Can not be modified";
  return (item.actioned && "Action Item created") || "Create action item";
};

const messageIsOldReview = isOldReview => {
  if (isOldReview) return "Can not be modified";
  return "";
};

const getIconPosition = pos => `${pos.charAt(0).toUpperCase()}${pos.slice(1)}`;
