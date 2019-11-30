import React, { memo } from "react";
import { Redirect, Switch } from "react-router-dom";
import RouteWithSubRoutes from "./RouteWithSubRoutes";
import routerConfig from "./router.config";
function RouterApp({ user }) {
  if (!user) return null;
  let userRole = user.attributes["custom:role"];
  const isAdmin = userRole === "admin";
  const routes = routerConfig(isAdmin);
  return (
    <Switch>
      {routes.map(route => (
        <RouteWithSubRoutes key={route.path} {...route} />
      ))}
      <Redirect to="/home" />
    </Switch>
  );
}

export default memo(RouterApp, (prev, next) => prev.user.id === next.user.id);
