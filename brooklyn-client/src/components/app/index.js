import React, { Component, useState } from "react";
import "./App.css";
import { Auth } from "aws-amplify";
import { Authenticator, Greetings, SignUp } from "aws-amplify-react";
import RouterApp from "../router/router.app";
import Header from "../header";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch
} from "react-router-dom";
import OfflineIndicator from "../offline-indicator";
import AllProviders from "../../containers/providers";
import MarkAsDone from "../../pages/markAsDone";
import Toolbar from "../../components/tool-bar";
import ScrollToTop from "../scroll-to-top";
import Alert from "../snackbar-alert";
import CustomIconLibrary from "../../containers/providers/customIconLibrary";
import { useBrooklynAlert } from "../../containers/providers/context/Alert";

function AppContainer({ user, myhandleLogout, authState }) {
  const [menuOpened, setMenuOpened] = useState(false);
  const { open, message, variant, closeAlert } = useBrooklynAlert();
  const headersProps = {
    Link: NavLink,
    myhandleLogout: myhandleLogout,
    menuOpened: menuOpened,
    changeMenuOpened: value => setMenuOpened(value)
  };
  if (authState !== "signedIn") return null;
  const enablePing = process.env.REACT_APP_ENABLE_PING === "true";
  return (
    <React.Fragment>
      <Header {...headersProps} />
      <Toolbar />
      {enablePing && <OfflineIndicator />}
      <Alert
        {...{
          open,
          message,
          variant,
          duration: 3000,
          handleClose: closeAlert
        }}
      />
      <ScrollToTop>
        <div className="marginApp">{user && <RouterApp user={user} />}</div>
      </ScrollToTop>
    </React.Fragment>
  );
}
class App extends Component {
  myhandleLogout = () => {
    Auth.signOut();
    this.handleAuthStateChange("signIn");
  };
  handleAuthStateChange = authState => {
    switch (authState) {
      case "signedIn":
        Auth.currentAuthenticatedUser().then(user =>
          this.props.userLoggedIn(user)
        );
        break;
      case "signIn":
        this.props.userSignedOut();
        break;
      default:
        this.forceUpdate();
        break;
    }
  };

  renderProviders = () => (
    <AllProviders>
      <div className="App">
        <Authenticator
          onStateChange={this.handleAuthStateChange}
          hideDefault={!(this.props.user === null)}
          hide={[Greetings, SignUp]}
        >
          <AppContainer
            {...{ myhandleLogout: this.myhandleLogout, user: this.props.user }}
          />
        </Authenticator>
      </div>
    </AllProviders>
  );

  render() {
    return (
      <Router>
        {this.props.user && <CustomIconLibrary user={this.props.user} />}
        <Switch>
          <Route
            path="/public/action-item/mark-as-done"
            exact
            component={MarkAsDone}
          />
          <Route render={this.renderProviders} />
        </Switch>
      </Router>
    );
  }
}

export default App;
