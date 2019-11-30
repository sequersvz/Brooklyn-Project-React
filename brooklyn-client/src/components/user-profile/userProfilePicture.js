import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const spinner = <FontAwesomeIcon icon="spinner" spin />;

const ProfilePicture = ({ imageUrl, openDialog, uploading, error }) => (
  <React.Fragment>
    <img
      src={imageUrl}
      alt="Profile"
      style={{ borderRadius: "50%", width: "100%" }}
    />
    {uploading ? (
      <p style={{ marginTop: "30px", marginBottom: "0px", fontSize: "18px" }}>
        {spinner} Uploading...
      </p>
    ) : (
      <React.Fragment>
        <p style={{ marginTop: "30px", marginBottom: "5px", fontSize: "12px" }}>
          Drop image here or
        </p>
        <p
          style={{ cursor: "pointer", color: "#0000ff", fontSize: "12px" }}
          onClick={openDialog}
        >
          upload from your computer
        </p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </React.Fragment>
    )}
  </React.Fragment>
);
export default ProfilePicture;
