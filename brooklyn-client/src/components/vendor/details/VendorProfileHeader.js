import React from "react";
import Dropzone from "react-dropzone";
import Grid from "@material-ui/core/Grid";
import CircularProgressBar from "../tier-and-score/CircularProgressBar";

const getScore = profile =>
  profile.tierSlider1 +
    profile.tierSlider2 +
    profile.tierSlider3 +
    profile.tierSlider4 +
    profile.tierSlider5 || 0;

class VendorProfileHeader extends React.Component {
  render() {
    const {
      vendor,
      vendorLogo,
      handleUploadLogo,
      handleErrorUploadingLogo,
      errorUploadingLogo,
      isEditing
    } = this.props;
    const logo = vendor.logo;
    const vendorProfile = (vendor.profile || [])[0] || {};
    const { tierId } = vendorProfile;
    const tier = tierId;
    const score = getScore(vendorProfile);
    let dropzoneRef;
    return (
      <Grid container style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <Dropzone
            disabled={isEditing}
            accept="image/jpeg, image/png, image/jpeg"
            onDrop={accepted => {
              if (accepted.length > 0) {
                return handleUploadLogo(accepted);
              }
              handleErrorUploadingLogo();
            }}
            style={{
              marginLeft: 30,
              borderStyle: "none",
              minHeight: 40
            }}
            ref={node => {
              dropzoneRef = node;
            }}
            className="dropzone"
            activeClassName="dropzoneactive"
            activeStyle={{ border: "#117ede solid 1px" }}
            disableClick
            minSize={150}
          >
            <div>
              {!vendorLogo && !logo ? (
                <p>{vendor.name}</p>
              ) : (
                <img
                  style={{
                    marginBottom: 20
                  }}
                  src={vendorLogo ? vendorLogo[0].preview : logo}
                  crossOrigin={"use-credentials"}
                  width={250}
                  alt="profile"
                />
              )}
            </div>
            <span style={{ fontSize: 10, cursor: "pointer" }}>
              Drop logo here or{" "}
              <span
                onClick={() => {
                  dropzoneRef.open();
                }}
                style={{ color: "blue" }}
              >
                upload from your computer
              </span>
              {errorUploadingLogo && (
                <p style={{ color: "red" }}>
                  Only jpeg, jpg and png images are permitted
                </p>
              )}
            </span>
          </Dropzone>
        </Grid>
        <Grid item xs={12} md={6}>
          <div
            style={{
              width: "100px",
              float: "right",
              marginLeft: 10,
              marginRight: 30
            }}
          >
            <CircularProgressBar
              percentage={score * 4}
              text={`${score}`}
              title="Score"
            />
          </div>
          <div style={{ width: "100px", float: "right" }}>
            <CircularProgressBar
              percentage={tier * 20}
              text={`${tier}`}
              title="Tier"
            />
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default VendorProfileHeader;
