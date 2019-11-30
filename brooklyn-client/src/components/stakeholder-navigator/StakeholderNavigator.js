import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import StakeholderSelects from "./Selects";
import VendorData from "./VendorData";
import ScoreData from "./ScoreData";
import MiscInformation from "./MiscInformation";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { LoadingSpinner } from "../loading-spinner";

const styles = () => ({
  rootContainer: {
    padding: "0px 15px"
  },
  padding: {
    padding: "10px 30px"
  }
});

class StakeholderNavigator extends React.Component {
  render() {
    const { classes } = this.props;
    const {
      vendor,
      vendors,
      handleSelectVendor,
      selectedVendor,
      loading,
      groups,
      selectedGroup,
      handleSelectGroup,
      loadingVendorInformation
    } = this.props;
    return (
      <Grid container justify="center" className={classes.padding}>
        <Grid item xs={12}>
          <Paper className={classes.padding}>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className={classes.padding}>
                  <Typography variant="h5">
                    Stakeholder Navigator View
                  </Typography>
                </div>
                <Divider />

                <StakeholderSelects
                  className={classes.padding}
                  vendors={vendors}
                  handleSelectVendor={handleSelectVendor}
                  selectedVendor={selectedVendor}
                  groups={groups}
                  handleSelectGroup={handleSelectGroup}
                  selectedGroup={selectedGroup}
                />

                {vendor &&
                  !loadingVendorInformation && (
                    <>
                      <Grid container className={classes.padding}>
                        <Grid item xs={8}>
                          <VendorData
                            vendor={vendor}
                            selectedGroup={selectedGroup}
                          />
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={3}>
                          <ScoreData vendor={vendor} />
                        </Grid>
                      </Grid>
                      <div className={classes.padding}>
                        <Typography variant="h6">Profile Data</Typography>
                        <Divider />
                        <MiscInformation vendor={vendor} />
                      </div>
                    </>
                  )}
                {loadingVendorInformation && (
                  <LoadingSpinner text="Loading vendor information..." />
                )}
                {!vendor &&
                  !loadingVendorInformation && (
                    <p style={{ textAlign: "center", padding: "50px" }}>
                      No vendor selected
                    </p>
                  )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(StakeholderNavigator);
