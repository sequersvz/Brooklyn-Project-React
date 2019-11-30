import React from "react";
import Alert from "../snackbar-alert";
import { API } from "aws-amplify";

class OfflineIndicator extends React.PureComponent {
  state = { open: false, failed: 0, interval: null };

  componentDidMount() {
    const interval = setInterval(async () => {
      try {
        await API.get("UsersAPI", "/ping", {});
        if (this.state.failed > 0) {
          this.setState(prevState => ({
            ...prevState,
            failed: 0,
            ...(prevState.open && { open: false })
          }));
        }
      } catch (error) {
        if (this.state.failed < 3) {
          this.setState(prevState => ({
            ...prevState,
            failed: prevState.failed + 1,
            ...(prevState.failed === 2 && { open: true })
          }));
        }
      }
    }, 5000);
    this.setState(prevState => ({ ...prevState, interval }));
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  handleCloseOfflineAlert = () => {
    this.setState(prevState => ({
      ...prevState,
      open: false
    }));
  };

  render() {
    return (
      <Alert
        open={this.state.open}
        message="Uh oh, network not responding... some services may be unavailable"
        duration={0}
        variant="warning"
        position="center"
        handleClose={this.handleCloseOfflineAlert}
      />
    );
  }
}

export default OfflineIndicator;
