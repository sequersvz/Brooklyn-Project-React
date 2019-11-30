import React, { PureComponent } from "react";
import DownloadModal from "./downloadModal.js";

class DownloadMinutesModal extends PureComponent {
  render() {
    const {
      show,
      close,
      items,
      vendor,
      account,
      attendees,
      reviewData,
      actionItems,
      reviewDate,
      disableExport,
      handleDisableExport,
      handlerItemReview
    } = this.props;

    const isMinute = true;
    const title = "Download Minutes";
    const summaryTitle = "Summary Minutes";
    const handlerExport = {
      reviewData,
      vendorLogo: vendor.logo !== null ? vendor.logo : undefined,
      accountLogo:
        account && account.logoPath !== null ? account.logoPath : undefined,
      nextReviewDate: reviewDate,
      vendor,
      vendorName: vendor.name,
      items,
      actionItems,
      isMinute,
      handlerItemReview
    };
    return (
      <DownloadModal
        {...{
          show,
          close,
          title,
          attendees,
          isMinute,
          summaryTitle,
          handlerExport,
          disableExport,
          handleDisableExport
        }}
      />
    );
  }
}

export default DownloadMinutesModal;
