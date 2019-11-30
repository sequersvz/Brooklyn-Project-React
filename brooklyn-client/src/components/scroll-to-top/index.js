import { useEffect } from "react";
import { withRouter } from "react-router-dom";

const ScrollToTop = ({ children, location }) => {
  const { pathname } = location;
  useEffect(
    () => {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {}
    },
    [pathname]
  );
  return children;
};

export default withRouter(ScrollToTop);
