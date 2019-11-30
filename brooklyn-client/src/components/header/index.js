import React, { PureComponent } from "react";
import { connect } from "react-redux";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardCheck,
  faGlasses,
  faSignOutAlt,
  faMedal,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import logo from "./logo.png";
import { withRouter } from "react-router-dom";
import IconHeaderNotification from "../icon-header-notification";
import timeout from "timeout";
import { sendPinpoint } from "../../Utils";
import { getLogo } from "../../containers/service";
import SearchBox from "./SearchBox";
import Grid from "@material-ui/core/Grid";

class Header extends PureComponent {
  state = {
    title: "Home",
    logo: ""
  };

  componentDidMount() {
    if ((this.props.account || {}).logoPath) {
      getLogo(this.props.account.logoPath)
        .then(logo => {
          this.setState({ logo });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidUpdate(prevProps) {
    const { account, location, user } = this.props;
    if (prevProps.account.logoPath !== account.logoPath) {
      getLogo(account.logoPath)
        .then(logo => {
          this.setState({ logo });
        })
        .catch(error => {
          console.log(error);
        });
    }
    if (location.pathname !== prevProps.location.pathname) {
      sendPinpoint(user, location.pathname);
      this.setMainTitle(location);
    }
  }
  componentWillMount() {
    const { location } = this.props;
    this.setMainTitle(location);
  }

  setMainTitle = location => {
    const { pathname } = location;
    const vendorExpression = /\Wvendor\W/;
    const assuranceExpression = /^(\/assurance?\/[\da-z-]+)/;
    const entryPointAssurance = pathname.match(assuranceExpression);
    const entryPointVendor = pathname.match(vendorExpression);
    const setTitle = title => this.setState({ title });
    if (entryPointVendor !== null && entryPointVendor[0] === "/vendor/") {
      setTitle("Vendor Profile");
    }
    if (entryPointAssurance !== null) {
      setTitle("Assurance");
    }
    switch (pathname) {
      case "/home":
        setTitle("Home");
        break;
      case "/vendorstudio":
        setTitle("Vendor Studio");
        break;
      case "/insight":
        setTitle("Insight");
        break;
      case "/report":
        setTitle("Reports");
        break;
      case "/machine-learning-studio":
        setTitle("Machine Learning Studio");
        break;
      case "/invoice-studio":
        setTitle("Invoice Studio");
        break;
      case "/configuration":
        setTitle("Configuration");
        break;
      default:
        break;
    }
  };
  render() {
    if (!this.props.user) {
      return null;
    }
    const {
      Link,
      myhandleLogout,
      menuOpened,
      changeMenuOpened,
      user
    } = this.props;
    const logoMain = this.state.logo;

    let userRole = user ? user.attributes["custom:role"] : null;

    return (
      <header>
        <Grid container className="header">
          <Grid item xs={4} md={2}>
            <img src={logo} className="brooklynLogo" alt={"logo"} />
            <span>Brooklyn</span>
          </Grid>
          <Grid item xs={8} md={4}>
            <div className="containerSearch">
              <SearchBox />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="header-btn">
              <Link
                to={{ pathname: "/home", title: "Home" }}
                className="btn btn-link"
                role="button"
                activeClassName="activeTopMenu"
              >
                <FontAwesomeIcon icon={faHome} />
                <p>Home</p>
              </Link>
              <Link
                to={{ pathname: "/assurance", title: "Assurance" }}
                className="btn btn-link"
                activeClassName="activeTopMenu"
                role="button"
              >
                <FontAwesomeIcon icon={faClipboardCheck} />
                <p>Assurance</p>
              </Link>
              <Link
                to={{ pathname: "/vendor", title: "Vendor Studio" }}
                className="btn btn-link"
                activeClassName="activeTopMenu"
                role="button"
              >
                <FontAwesomeIcon icon={faMedal} />
                <p>Vendor Studio</p>
              </Link>
              <Link
                to={{ pathname: "/report", title: "Report" }}
                className="btn btn-link"
                activeClassName="activeTopMenu"
                role="button"
              >
                <FontAwesomeIcon icon={faChartLine} />
                <p>Reports</p>
              </Link>
              <Link
                to={{ pathname: "/insight", title: "Insight" }}
                className="btn btn-link"
                role="button"
                activeClassName="activeTopMenu"
              >
                <FontAwesomeIcon icon={faGlasses} />
                <p>Insight</p>
              </Link>
              |
              <div className="drop-menu-icon-header">
                <div className="customer-logo">
                  <IconHeaderNotification />
                  {logoMain && (
                    <img
                      src={logoMain}
                      crossOrigin={"use-credentials"}
                      className="SectionNavbars-img-500"
                      alt="profile"
                      onMouseOver={e => {
                        e.preventDefault();
                        changeMenuOpened(true);
                      }}
                      onMouseLeave={() => {
                        timeout.timeout("myTimeout", 3000, () => {
                          changeMenuOpened(false);
                        });
                      }}
                    />
                  )}
                </div>
                <div
                  className="drop-content-menu-icon-header"
                  style={{ display: menuOpened === true ? "block" : "none" }}
                  onMouseEnter={() => {
                    timeout.timeout("myTimeout", null);
                    changeMenuOpened(true);
                  }}
                  onMouseLeave={e => {
                    e.preventDefault();
                    changeMenuOpened(false);
                  }}
                >
                  <Link to="/profile">
                    <span>
                      <p>Profile</p>
                    </span>
                  </Link>
                  <span
                    style={{
                      display: userRole === "admin" ? "block" : "none"
                    }}
                  >
                    <p
                      onClick={e => {
                        e.preventDefault();
                        this.props.history.push("/configuration");
                      }}
                    >
                      Configuration
                    </p>
                  </span>
                  <hr
                    className="style1"
                    style={{
                      position: "relative",
                      top: userRole === "admin" ? 25 : 10
                    }}
                  />
                  <span className="exitText" onClick={myhandleLogout}>
                    <p>
                      Exit{" "}
                      <FontAwesomeIcon
                        style={{ float: "right", marginTop: 5 }}
                        icon={faSignOutAlt}
                      />
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    account: state.account
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { pure: false }
)(withRouter(Header));
