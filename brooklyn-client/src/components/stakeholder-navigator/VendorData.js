import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faExclamationTriangle,
  faFolderOpen,
  faIdCard,
  faHandshake,
  faLightbulb,
  faMedal
} from "@fortawesome/free-solid-svg-icons";
import Select from "../../assets/materialComponents/CustomInput/CustomSelectMultiNivel";
import DownloadMinutesModal from "../meeting-organiser/modals/downloadModal";

const renderLink = ({ to, icon, text, key }) => (
  <div style={{ fontSize: "14px", margin: "0px 0px 10px" }} key={key}>
    <Link to={to}>
      <Grid container>
        <Grid item xs={1}>
          <FontAwesomeIcon icon={icon} style={{ marginRight: "8px" }} />
        </Grid>
        <Grid item xs={11}>
          {text}
        </Grid>
      </Grid>
    </Link>
  </div>
);

const VendorData = ({ vendor, selectedGroup }) => {
  const [showModal, setModal] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const selectedVendor = { label: vendor.name, value: vendor.id };
  const linkState = {
    fromStakeholder: true,
    vendor: selectedVendor,
    group: selectedGroup
  };

  const leftOptions = [
    {
      to: {
        pathname: `/assurance/action-log`,
        state: linkState
      },
      icon: faFire,
      text: `Actions (${vendor.actions})`
    },
    {
      to: {
        pathname: `/assurance/risks`,
        state: linkState
      },
      icon: faExclamationTriangle,
      text: `Risks (${vendor.risks})`
    },
    {
      to: `/vendor/${vendor.id}/files`,
      icon: faFolderOpen,
      text: `Files (${vendor.files})`
    },
    {
      to: `/vendor/${vendor.id}/contacts`,
      icon: faIdCard,
      text: `Contacts (${vendor.contacts})`
    }
  ];
  const rightOptions = [
    {
      to: { pathname: `/report`, state: linkState },
      icon: faLightbulb,
      text: `Performance score card`
    },
    {
      to: `/vendor/${vendor.id}/tier`,
      icon: faMedal,
      text: `Vendor Details`
    }
  ];

  const selectOptions = (vendor.lastReviews || []).map(review => ({
    value: review.id,
    label: review.title
  }));

  return (
    <>
      <Grid container>
        <Grid item xs={4}>
          {vendor.logo ? (
            <img src={vendor.logo} alt="Vendor Logo" style={{ width: "95%" }} />
          ) : (
            <p>{vendor.name}</p>
          )}
        </Grid>
        <Grid item xs={4}>
          {leftOptions.map((option, index) =>
            renderLink({ ...option, key: `leftOption_${index}` })
          )}
        </Grid>
        <Grid item xs={4}>
          <div style={{ fontSize: "14px", margin: "0px 0px 10px" }}>
            <Select
              name="Vendor Minutes"
              noMarginTop
              value={{
                value: 0,
                label: (
                  <Grid container style={{ color: "#9c27b0" }}>
                    <Grid item xs={1}>
                      <FontAwesomeIcon
                        icon={faHandshake}
                        style={{ marginRight: "8px" }}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      {`Meeting mins (${vendor.meetingMins})`}
                    </Grid>
                  </Grid>
                )
              }}
              options={selectOptions}
              onChange={option => {
                setReviewId(option.value);
                setModal(true);
              }}
            />
          </div>
          {rightOptions.map((option, index) =>
            renderLink({ ...option, key: `rightOptions_${index}` })
          )}
        </Grid>
      </Grid>
      <DownloadMinutesModal
        handleDisableExport={() => {}}
        disableExport={false}
        show={showModal}
        close={() => setModal(false)}
        handlerExport={{ isMinute: true, reviewData: { id: reviewId } }}
      />
    </>
  );
};

export default VendorData;
