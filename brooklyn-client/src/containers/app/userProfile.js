import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { connect } from "react-redux";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import {
  UserProfileData,
  UserProfilePicture
} from "../../components/user-profile";
import { getAllEntities } from "../service/root.service";
import LoadingSpinner from "../../components/loading-spinner";
import Dropzone from "react-dropzone";
import { Storage } from "aws-amplify";
import { baseUrlUploads } from "../../config/config";
import { getLogo } from "../service";

const getAllGroups = getAllEntities("user/groups");

class UserProfile extends Component {
  state = {
    userData: undefined,
    loadingUserData: false,
    errorLoadingUserData: false,
    uploadingProfilePicture: false,
    errorUploadingProfilePicture: false,
    errors: {
      name: null,
      email: null,
      phoneNumber: null,
      profilePic: null
    }
  };

  componentDidMount() {
    const cognitoId = (this.props.user || {}).username || "";
    this.getUserByCognitoId(cognitoId);
    this.getAllGroups();
  }

  getUserByCognitoId = cognitoId =>
    this.setState(
      { loadingUserData: true, errorLoadingUserData: false },
      async () => {
        try {
          let userData = await API.get(
            "UsersAPI",
            `/user/cognito/${cognitoId}`
          );
          if (cognitoId.length > 0 && Object.keys(userData).length === 0) {
            try {
              const cognitoUserAttr = { ...this.props.user.attributes };
              userData = {
                name: cognitoUserAttr.name || cognitoUserAttr.email,
                role: cognitoUserAttr["custom:role"],
                email: cognitoUserAttr.email,
                phoneNumber: cognitoUserAttr.phoneNumber || "",
                cognitoId
              };
              await API.post("UsersAPI", `/user`, {
                body: { ...userData }
              });
            } catch (error) {
              console.log(error);
              throw error;
            }
          }
          const pic = await getLogo(userData.profilePic);
          userData.profilePic = pic;
          userData.groups = (userData.groups || []).map(group => ({
            label: group.name,
            value: group.id
          }));

          this.setState({ userData, loadingUserData: false });
        } catch (error) {
          console.log(error);
          this.setState({ loadingUserData: false, errorLoadingUserData: true });
        }
      }
    );

  getAllGroups = () =>
    this.setState(
      prevState => ({
        ...prevState,
        loadingUserGroup: true,
        erroLoadingUserGroup: false
      }),
      async () => {
        const onSuccess = result =>
          this.setState(prevState => ({
            ...prevState,
            groups: result.map(group => ({
              label: group.name,
              value: group.id
            }))
          }));
        const onError = error =>
          this.setState(
            prevState => ({
              ...prevState,
              loadingUserGroup: false,
              erroLoadingUserGroup: true
            }),
            console.log(error)
          );
        await getAllGroups(onSuccess, onError)();
      }
    );

  handleSubmitChanges = (field, done) => {
    const cognitoId = (this.props.user || {}).username || "";
    const [fieldName] = Object.keys(field);

    this.setState(
      prevState => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          [fieldName]: false
        }
      }),
      async () => {
        try {
          const user = await Auth.currentAuthenticatedUser();
          let userFieldToUpdate = field;
          if (fieldName === "phoneNumber") {
            userFieldToUpdate = { phone_number: field[fieldName] };
          }
          if (fieldName === "groups") {
            field = { [fieldName]: field[fieldName].map(g => g.value) };
          }
          if (fieldName === "notificationPreference") {
            field = { [fieldName]: field[fieldName].label };
          }
          if (fieldName === "profilePic") {
            userFieldToUpdate = { picture: field[fieldName] };
          }
          if (
            fieldName !== "notificationPreference" &&
            fieldName !== "groups"
          ) {
            await Auth.updateUserAttributes(user, userFieldToUpdate);
          }
          await API.patch("UsersAPI", `/user/cognito/${cognitoId}`, {
            method: "PATCH",
            body: { ...field }
          });

          if (fieldName === "profilePic") {
            const pic = await getLogo(field[fieldName]);
            field[fieldName] = pic;
          }
          this.setState(
            prevState => ({
              ...prevState,
              userData: { ...prevState.userData, ...field }
            }),
            done
          );
        } catch (error) {
          this.setState(
            prevState => ({
              ...prevState,
              errors: {
                ...prevState.errors,
                [fieldName]: true
              }
            }),
            done
          );
        }
      }
    );
  };

  handleOnDrop = accepted => {
    if (accepted.length > 0) {
      const [file] = accepted;
      const timestamp = Date.now().toString();
      const name = `${timestamp}.${file.name}`;
      const fileName = `uploads/logos/${name}`;

      this.setState(
        prevState => ({
          ...prevState,
          uploadingProfilePicture: true,
          errorUploadingProfilePicture: false,
          errors: {
            ...prevState.errors,
            profilePic: null
          }
        }),
        async () => {
          try {
            await Storage.put(fileName, file, { contentType: file.type });
            await this.handleSubmitChanges({
              profilePic: baseUrlUploads + fileName
            });
            this.setState({ uploadingProfilePicture: false });
          } catch (error) {
            this.setState(prevState => ({
              ...prevState,
              uploadingProfilePicture: false,
              errorUploadingProfilePicture: true,
              errors: {
                ...prevState.errors,
                profilePic: "There was an error uploading the image"
              }
            }));
          }
        }
      );
      return;
    }

    this.setState(prevState => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        profilePic: "Only jpeg, jpg and png images are permitted"
      }
    }));
  };

  render() {
    if (this.state.loadingUserData) {
      return <LoadingSpinner load />;
    }
    const fallbackImg =
      "https://lh3.googleusercontent.com/-cmGywGggzqQ/XDjOMjhYGII/AAAAAAAAHV4/r-D8F_Xj7uAyuhUNUI4u-52fweJY4MnxwCL0BGAYYCw/h512/2019-01-11.png";

    const dropzoneRef = React.createRef();

    return (
      <Grid>
        <Row>
          <Col md={8} mdOffset={2}>
            <Panel style={{ padding: "50px" }}>
              <Row>
                <Col xs={12} md={6} style={{ textAlign: "center" }}>
                  <Dropzone
                    ref={dropzoneRef}
                    onDrop={this.handleOnDrop}
                    accept="image/jpeg, image/jpg, image/png"
                    disableClick
                    disabled={this.state.uploadingProfilePicture}
                    style={{
                      width: "100%",
                      borderWidth: "0px",
                      borderRadius: "0px"
                    }}
                  >
                    <UserProfilePicture
                      imageUrl={
                        (this.state.userData || {}).profilePic || fallbackImg
                      }
                      openDialog={() => dropzoneRef.current.open()}
                      uploading={this.state.uploadingProfilePicture}
                      error={this.state.errors.profilePic}
                    />
                  </Dropzone>
                </Col>
                <Col xs={12} md={6}>
                  <UserProfileData
                    user={this.state.userData || {}}
                    errors={this.state.errors}
                    submitChanges={this.handleSubmitChanges}
                    groups={this.state.groups}
                  />
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(UserProfile);
