import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import { ByInput, ItemNameInput, TimeSlotInput } from "./editable.inputs";
import {
  RecurringIcon,
  EqualsIcon,
  ReadyIcon,
  DeferIcon,
  ActionIcon,
  CloseIcon,
  OpenIcon,
  TrashIcon,
  CategoryIcon,
  RiskIcon
} from "./item.icons";
import Moment from "react-moment";
export const ItemNameSection = ({
  col,
  item,
  style,
  isPdf,
  isAgenda,
  isOldReview,
  handleOnBlur,
  showEdit,
  editshowEdit,
  itemreviewName,
  sortableHandle,
  handleOnKeyDown,
  handleInputChange,
  handleOnDoubleClick
}) => (
  <Fragment>
    {isAgenda && (
      <Col md={1} style={{ paddingRight: 0 }}>
        <span
          style={{
            cursor: "text",
            marginLeft: isPdf ? 10 : 0,
            ...style
          }}
        >
          {item.index + 1}
        </span>
        {!isPdf && <EqualsIcon {...{ sortableHandle, handleOnDoubleClick }} />}
      </Col>
    )}
    <Col md={col}>
      {!isAgenda && <EqualsIcon {...{ sortableHandle, handleOnDoubleClick }} />}
      <ItemNameInput
        {...{
          item,
          showEdit,
          editshowEdit,
          isOldReview,
          handleOnBlur,
          itemreviewName,
          handleOnKeyDown,
          handleInputChange
        }}
      />
    </Col>
  </Fragment>
);

export const CategoryNameSection = ({
  iconClassName,
  categoryName,
  checkpointName
}) => (
  <div>
    {iconClassName && <CategoryIcon icon={iconClassName} />}
    {checkpointName ? `${categoryName} / ${checkpointName}` : null}
  </div>
);

export const SummaryAgendaSection = ({
  item,
  isPdf,
  isOldReview,
  itemreviewBy,
  handleOnBlur,
  showByEdit,
  editByEdit,
  showTimeSlotEdit,
  editTimeSlotEdit,
  handleOnKeyDown,
  handleInputChange,
  itemreviewTimeSlot
}) => {
  const isMeetingItem = item.reviewcheckpointId === null;
  const col = isPdf ? 4 : 3;
  const inputProps = {
    item,
    isPdf,
    isOldReview,
    handleOnBlur,
    handleOnKeyDown,
    handleInputChange
  };
  return (
    <Fragment>
      <Col md={col}>
        <CategoryNameSection
          {...{
            checkpointName: item.checkpointName,
            categoryName: item.categoryName
          }}
        />
      </Col>
      <Col md={col}>
        <TimeSlotInput
          {...{
            ...inputProps,
            itemreviewTimeSlot,
            showTimeSlotEdit,
            editTimeSlotEdit
          }}
        />
      </Col>
      <Col md={isPdf ? 3 : 2}>
        {!isMeetingItem && (
          <ByInput
            {...{
              ...inputProps,
              itemreviewBy,
              showByEdit,
              editByEdit
            }}
          />
        )}
      </Col>
    </Fragment>
  );
};

export const CloseItemSection = ({
  item,
  style,
  isOldReview,
  handleOnReadyIconClick,
  handleOnDeferIconClick
}) => (
  <span>
    {item.deferred && (
      <DeferIcon
        {...{
          style,
          isOldReview,
          deferredIconColor: item.deferred === true ? "#00d3ee" : "grey",
          handleOnClick: handleOnDeferIconClick
        }}
      />
    )}
    <ReadyIcon
      {...{
        style,
        isOldReview,
        position: "up",
        handleOnClick: handleOnReadyIconClick
      }}
    />
  </span>
);

export const OpenItemSection = ({
  style,
  isOldReview,
  handleOnReadyIconClick
}) => (
  <div>
    <ReadyIcon
      {...{
        style,
        isOldReview,
        position: "down",
        handleOnClick: handleOnReadyIconClick
      }}
    />
  </div>
);

export const ReadyItemSection = ({
  nodos,
  style,
  isOldReview,
  showOverlay,
  handleOnHide,
  renderSelectScore,
  handleOnOpenIconClick,
  handleOnCloseIconClick,
  handleOnDeferIconClick
}) => (
  <div>
    <CloseIcon
      {...{
        style,
        nodos,
        showOverlay,
        handleOnHide,
        isOldReview,
        renderSelectScore,
        handleOnClick: handleOnCloseIconClick
      }}
    />
    <OpenIcon
      {...{ style, isOldReview, handleOnClick: handleOnOpenIconClick }}
    />
    <DeferIcon
      {...{
        style,
        isOldReview,
        deferredIconColor: "grey",
        handleOnClick: handleOnDeferIconClick
      }}
    />
  </div>
);

export const ReviewItemButtons = props => {
  const {
    item,
    col,
    type,
    isPdf,
    addRisk,
    isAgenda,
    categoryName,
    renderScoreSection
  } = props;
  const { closed, deferred, ready } = item;
  let isItemClosed, isItemReady, isItemOpen;
  let isMeetingItem = item.reviewcheckpointId === null;
  let isTypeAll = type === "all";
  isItemClosed = type === "closed";
  isItemReady = type === "ready";
  isItemOpen = type === "open";

  if (isTypeAll) {
    isItemClosed = !!((closed || deferred) && !ready);
    isItemReady = ready ? true : false;
    isItemOpen = !!(!closed && !deferred && !ready);
  }
  const colClosed = isItemClosed && !isAgenda ? 7 : null;
  const buttonsProps = {
    ...props,
    isTypeAll,
    isItemOpen,
    isItemReady,
    isItemClosed,
    addRisk
  };

  return (
    <Fragment>
      {!isPdf && isMeetingItem && <MeetingItemButtons {...buttonsProps} />}
      {!isPdf &&
        !isMeetingItem && (
          <Fragment>
            {isItemClosed &&
              !isAgenda && <Col md={5}>{renderScoreSection(item)}</Col>}
            {categoryName === "Action Log" ? (
              <ReviewActionItemButtons
                {...buttonsProps}
                col={colClosed || col}
              />
            ) : (
              <NormalItemButtons {...buttonsProps} col={colClosed || col} />
            )}
          </Fragment>
        )}
    </Fragment>
  );
};
export const NormalItemButtons = ({
  col,
  item,
  nodos,
  isPdf,
  addRisk,
  iconStyles: style,
  showOverlay,
  handleOnHide,
  isOldReview,
  categoryName,
  isItemOpen,
  isItemReady,
  isItemClosed,
  refFireButton,
  recurringColor,
  categoryActionId,
  renderSelectScore,
  handleOnClickCapture,
  handleOnOpenIconClick,
  handleOnTrashIconClick,
  handleOnReadyIconClick,
  handleOnCloseIconClick,
  handleOnDeferIconClick,
  handleOnActionIconClick,
  handleOnRecurringIconClick
}) => (
  <Col md={col || 3}>
    {!isPdf && (
      <Fragment>
        <TrashIcon
          {...{ style, isOldReview, handleOnClick: handleOnTrashIconClick }}
        />
        <RecurringIcon
          {...{
            isOldReview,
            style,
            categoryName,
            color: recurringColor,
            handleOnClick: handleOnRecurringIconClick
          }}
        />
      </Fragment>
    )}
    {isItemOpen && (
      <OpenItemSection
        {...{
          style,
          isOldReview,
          handleOnReadyIconClick
        }}
      />
    )}
    {isItemReady && (
      <ReadyItemSection
        {...{
          isOldReview,
          style,
          nodos,
          showOverlay,
          handleOnHide,
          renderSelectScore,
          handleOnOpenIconClick,
          handleOnCloseIconClick,
          handleOnDeferIconClick
        }}
      />
    )}
    {isItemClosed && (
      <CloseItemSection
        {...{
          item,
          style,
          isOldReview,
          handleOnReadyIconClick,
          handleOnDeferIconClick
        }}
      />
    )}
    {(isItemReady || isItemClosed) && (
      <React.Fragment>
        <ThunderboltItemSection
          {...{
            item,
            style,
            isOldReview,
            categoryName,
            categoryActionId,
            ref: refFireButton,
            handleOnClickCapture,
            handleOnIconClick: handleOnActionIconClick
          }}
        />
        <RiskIcon item={item} addRisk={addRisk} style={style} />
      </React.Fragment>
    )}
  </Col>
);

export const ReviewActionItemButtons = ({
  item,
  nodos,
  col,
  addRisk,
  iconStyles: style,
  isTypeAll,
  isItemOpen,
  isItemReady,
  isItemClosed,
  isOldReview,
  showOverlay,
  handleOnHide,
  renderSelectScore,
  handleOnTrashIconClick,
  handleOnOpenIconClick,
  handleOnCloseIconClick
}) => (
  <Col md={col}>
    <TrashIcon
      {...{
        style,
        isOldReview,
        handleOnClick: handleOnTrashIconClick
      }}
    />
    {((isItemOpen && isTypeAll) || (isItemReady && !isTypeAll)) && (
      <CloseIcon
        {...{
          nodos,
          style,
          isOldReview,
          showOverlay,
          handleOnHide,
          renderSelectScore,
          handleOnClick: handleOnCloseIconClick
        }}
      />
    )}
    {isItemClosed && (
      <OpenIcon {...{ item, style, handleOnClick: handleOnOpenIconClick }} />
    )}
    <RiskIcon item={item} addRisk={() => addRisk(item)} style={style} />
  </Col>
);

export const MeetingItemButtons = ({
  nodos,
  iconStyles: style,
  isItemClosed,
  isOldReview,
  showOverlay,
  handleOnHide,
  renderSelectScore,
  handleOnReadyIconClick,
  handleOnTrashIconClick,
  handleOnCloseIconClick
}) => (
  <Col md={4}>
    <TrashIcon
      {...{
        style,
        isOldReview,
        handleOnClick: handleOnTrashIconClick
      }}
    />
    {isItemClosed ? (
      <ReadyIcon
        {...{
          style,
          isOldReview,
          position: "up",
          handleOnClick: handleOnReadyIconClick
        }}
      />
    ) : (
      <CloseIcon
        {...{
          style,
          nodos,
          showOverlay,
          handleOnHide,
          isOldReview,
          renderSelectScore,
          handleOnClick: handleOnCloseIconClick
        }}
      />
    )}
  </Col>
);

export const ThunderboltItemSection = React.forwardRef(
  (
    {
      item,
      style,
      isOldReview,
      categoryName,
      handleOnIconClick,
      handleOnClickCapture
    },
    ref
  ) => (
    <div onClickCapture={handleOnClickCapture} ref={ref}>
      <ActionIcon
        {...{
          item,
          style,
          isOldReview,
          categoryName,
          handleOnClick: handleOnIconClick
        }}
      />
    </div>
  )
);

export const SummaryActionSection = ({ item, isPdf }) => {
  return (
    <Fragment>
      <Col md={isPdf ? 7 : 5}>
        <p style={{ cursor: "default" }} align="left">
          {item.user && item.user.name}
        </p>
      </Col>
      <Col md={isPdf ? 5 : 4}>
        <p style={{ cursor: "default" }} align="left">
          {item.dueDate && <Moment format="LL">{item.dueDate}</Moment>}
        </p>
      </Col>
    </Fragment>
  );
};
