import React, { PureComponent } from "react";
import DownloadModal from "./downloadModal";
class DownloadAgendaModal extends PureComponent {
  render() {
    const {
      show,
      close,
      items,
      vendor,
      account,
      attendees,
      reviewData,
      reviewDate,
      actionItems,
      disableExport,
      handleDisableExport
    } = this.props;
    const isAgenda = true;
    const title = "Download Agenda";
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
      isAgenda
    };
    return (
      <DownloadModal
        {...{
          show,
          close,
          title,
          attendees,
          handlerExport,
          disableExport,
          handleDisableExport
        }}
      />
    );
  }
}
export default DownloadAgendaModal;
