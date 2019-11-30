import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BrooklynLogo from "../../assets/img/logo-brooklyn.png";
import { Button } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  state = { error: false };

  componentDidCatch() {
    this.setState({ error: true });
  }

  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    if (this.state.error) {
      return (
        <React.Fragment>
          <div
            style={{
              textAlign: "center",
              paddingTop: "50px"
            }}
          >
            <FontAwesomeIcon
              icon="robot"
              style={{
                color: "#555555",
                fontSize: "200px",
                marginBottom: "50px"
              }}
            />
            <p
              style={{
                color: "#f05b4f",
                fontSize: "80px",
                marginBottom: "30px"
              }}
            >
              <strong>ERROR</strong>
            </p>
            <p
              style={{
                color: "#555555",
                fontSize: "22px",
                fontWeight: "lighter"
              }}
            >
              Sorry, something went wrong.
            </p>
            <Button
              href="/"
              style={{
                padding: "10px 60px",
                marginTop: "20px",
                background: "#683364",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
                textDecoration: "none"
              }}
            >
              GO BACK
            </Button>
          </div>
          <div
            style={{
              textAlign: "center",
              background: "#683364",
              position: "absolute",
              right: "0",
              bottom: "0",
              left: "0"
            }}
          >
            <img src={BrooklynLogo} alt="W3Schools" width="200" />
          </div>
        </React.Fragment>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
