import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/index";
import "./index.css";
import App from "./containers/app";
import Amplify from "aws-amplify";
import thunk from "redux-thunk";

import ErrorBoundary from "./components/error-boundary";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

// const middleware = applyMiddleware(thunk, createLogger())
const middleware = applyMiddleware(thunk);
const store = createStore(rootReducer, middleware);
const isPinPointDisabled = process.env.REACT_APP_PINPOINT_APP_ID === "false";
Amplify.configure({
  Auth: {
    // Amazon Cognito Identity Pool ID
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    // Amazon Cognito Region
    region: process.env.REACT_APP_AWS_REGION,
    // Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_APPID,
    // Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false
  },
  Storage: {
    bucket: process.env.REACT_APP_ATTACHMENTS_BUCKET,
    region: "eu-west-2"
  },
  API: {
    aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_ENDPOINT,
    aws_appsync_region: process.env.REACT_APP_APPSYNC_REGION,
    aws_appsync_authenticationType: "AWS_IAM",
    endpoints: [
      {
        name: "UsersAPI",
        endpoint: process.env.REACT_APP_API_URL + `/users`,
        region: process.env.REACT_APP_AWS_REGION
      },
      {
        name: "PublicAPI",
        endpoint: process.env.REACT_APP_API_URL + `/public`,
        region: process.env.REACT_APP_AWS_REGION
      },
      {
        name: "PdfLambda",
        endpoint: process.env.REACT_APP_PDF_LAMBDA,
        service: "lambda",
        region: process.env.REACT_APP_AWS_REGION
      }
    ]
  },
  AWSPinpoint: {
    disabled: isPinPointDisabled,
    appId: process.env.REACT_APP_PINPOINT_APP_ID,
    region: "eu-west-1",
    mandatorySignIn: true
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#683364"
    }
  },
  typography: {
    htmlFontSize: 10,
    useNextVariants: true
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </MuiThemeProvider>,
  document.getElementById("root")
);
