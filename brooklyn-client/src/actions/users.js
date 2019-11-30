import { Auth } from "aws-amplify/lib/index";
import AWS from "aws-sdk";
import { API } from "aws-amplify";

export const UsersStatuses = {
  GET_USERS: "GET_USERS",
  GET_USERS_ERROR: "GET_USERS_ERROR",
  GET_USER_BY_COGNITOID: "GET_USER_BY_COGNITOID",
  GET_USER_BY_COGNITOID_ERROR: "GET_USER_BY_COGNITOID_ERROR"
};

let requestInitiated = false;

export function getUsers() {
  const parameters = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID /* required */,
    // Filter: 'STRING_VALUE',
    Limit: 50
  };
  return async dispatch => {
    try {
      const credentials = await Auth.currentCredentials();
      const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
        {
          credentials: Auth.essentialCredentials(credentials),
          region: process.env.REACT_APP_AWS_REGION
        }
      );
      CognitoIdentityServiceProvider.listUsers(parameters, (err, data) => {
        dispatch({
          type: "GET_USERS",
          ...{ users: data }
        });
      });
    } catch (error) {
      console.error(`Error fetching `, error);
      dispatch({
        type: "GET_USERS_ERROR" // or, better, 'FAILED_ACTION' or something like that
      });
    }
  };
}

export const insertUserCognitoToApi = async userCognito => {
  const objectToInsert = {
    name: userCognito.attributes["name"],
    email: userCognito.attributes["email"],
    role: userCognito.attributes["custom:role"],
    cognitoId: userCognito.attributes["sub"],
    phoneNumber: "0",
    notificationPreference: "none"
  };
  const options = {
    body: objectToInsert
  };
  return await API.post("UsersAPI", `/user/`, options);
};

const getUserByEmail = async email => {
  return await API.get("UsersAPI", `/user/email?value=${email}`);
};

const updateUserCognitoId = async ({ userId, cognitoId }) => {
  return await API.patch("UsersAPI", `/user/${userId}`, {
    body: { cognitoId }
  });
};

export const getUserByCognitoId = userCognito => {
  return async dispatch => {
    try {
      if (requestInitiated) {
        return;
      }
      requestInitiated = true;
      let result = await API.get(
        "UsersAPI",
        `/user/cognito/${userCognito.attributes["sub"]}`
      );
      if (!("id" in result)) {
        const userByEmail = await getUserByEmail(
          userCognito.attributes["email"]
        );
        if (!Object.keys(userByEmail).length) {
          result = await insertUserCognitoToApi(userCognito);
        } else {
          await updateUserCognitoId({
            userId: userByEmail.id,
            cognitoId: userCognito.attributes["sub"]
          });
        }
      }
      dispatch({
        type: "SIGN_IN_USERAPI",
        ...{ userApi: result }
      });
      requestInitiated = false;
    } catch (error) {
      requestInitiated = false;
      console.error(`Error fetching `, error);
      dispatch({
        type: "GET_USER_BY_COGNITOID_ERROR" // or, better, 'FAILED_ACTION' or something like that
      });
    }
  };
};
