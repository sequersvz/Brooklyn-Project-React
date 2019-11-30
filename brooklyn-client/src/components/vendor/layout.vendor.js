import React, { useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import "./vendor.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import { withStyles } from "@material-ui/core";
import MuiGrid from "@material-ui/core/Grid";
import ContactsTable from "./contacts/ContactsTable";
import { LoadingSpinner } from "../loading-spinner";
import VendorFiles from "./files/VendorFiles";
import VendorTierAndScoreTab from "./tier-and-score/VendorTierAndScore";
import VendorProfile from "./details/VendorProfile";
import ActivitiesContainer from "../../containers/activities";
import ActivityList from "../activities";
import VendorEmailContainer from "../../containers/vendorEmail";
import VendorEmail from "./email";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import Alert from "../snackbar-alert";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    marginLeft: 15,
    marginRight: 15
  },
  shadowTabs: {
    boxShadow: "none"
  }
});
function LayoutVendor(props) {
  const {
    match,
    vendor,
    account,
    editAccount,
    classes,
    isLoading,
    getVendorById,
    editVendorProfile
  } = props;
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    variant: "success",
    duration: 0
  });
  const openAlert = ({ message, variant, duration }) =>
    setAlert({
      open: true,
      variant,
      duration,
      message
    });

  const closeAlert = () =>
    setAlert(prevState => ({
      ...prevState,
      open: false
    }));

  const alertHandler = { openAlert, closeAlert };
  const renderProfile = () => (
    <VendorProfile
      vendorId={vendor.id}
      getVendorById={getVendorById}
      {...alertHandler}
    />
  );

  const renderContacts = () => <ContactsTable vendorId={vendor.id} />;

  const renderTierAndScore = () => (
    <VendorTierAndScoreTab
      vendor={vendor}
      account={account}
      editAccount={editAccount}
      renderVendorLogo={renderVendorLogo}
      editVendorProfile={editVendorProfile}
    />
  );

  const renderEmailSettings = () => (
    <VendorEmailContainer vendorId={vendor.id}>
      {vendorEmail => <VendorEmail {...vendorEmail} />}
    </VendorEmailContainer>
  );

  const renderActivities = () => (
    <ActivitiesContainer vendorId={vendor.id}>
      {activities => <ActivityList {...activities} />}
    </ActivitiesContainer>
  );

  const renderFiles = () => (
    <VendorFiles vendor={vendor} getVendorById={getVendorById} />
  );

  const renderVendorLogo = () => {
    if (!vendor) return null;
    return vendor.logo ? (
      <img src={vendor.logo} alt={"logo"} />
    ) : (
      <p
        style={{
          marginBottom: 22
        }}
      >
        {vendor && vendor.name}
      </p>
    );
  };

  const tabs = [
    {
      label: "Vendor Tier",
      to: `${match.url}/tier`,
      render: renderTierAndScore
    },
    {
      label: "Vendor Profile",
      to: `${match.url}/profile`,
      render: renderProfile
    },
    {
      label: "Contacts",
      to: `${match.url}/contacts`,
      render: renderContacts
    },
    {
      label: "Email settings",
      to: `${match.url}/email-settings`,
      render: renderEmailSettings
    },
    {
      label: "Activity",
      to: `${match.url}/activity`,
      render: renderActivities
    },
    {
      label: "Files",
      to: `${match.url}/files`,
      render: renderFiles
    }
  ];

  return (
    <MuiGrid container justify="center">
      <MuiGrid item xs={12}>
        <Route>
          {({ location }) => {
            const pathnames = location.pathname
              .split("/")
              .filter(x => x && isNaN(Number(x)));
            const lastRoute = pathnames[pathnames.length - 1];
            return (
              <div className={classes.root}>
                <AppBar
                  position="static"
                  color="default"
                  className={classes.shadowTabs}
                >
                  <Tabs
                    value={location.pathname}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    {tabs.map(({ label, to }) => (
                      <Tab
                        to={to}
                        value={to}
                        key={label}
                        label={label}
                        component={Link}
                        className="tabButton"
                      />
                    ))}
                  </Tabs>
                </AppBar>
                {["profile", "tier"].includes(lastRoute) ? null : (
                  <div className="vendorTabLogo">{renderVendorLogo()}</div>
                )}
                {isLoading ? (
                  <LoadingSpinner height={500} size={150} />
                ) : vendor && account.id ? (
                  <Switch>
                    {tabs.map(({ render, to }, i) => (
                      <Route key={i} path={to} exact render={render} />
                    ))}
                  </Switch>
                ) : null}
              </div>
            );
          }}
        </Route>
        <Alert
          open={alert.open}
          message={alert.message}
          duration={alert.duration}
          variant={alert.variant}
          handleClose={closeAlert}
        />
      </MuiGrid>
    </MuiGrid>
  );
}
const VendorMemo = React.memo(LayoutVendor);
export default withRouter(withStyles(styles)(VendorMemo));
