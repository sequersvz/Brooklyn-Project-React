import React, { Fragment } from "react";
import { Breadcrumb } from "react-bootstrap";
import { Route } from "react-router-dom";
import routerConfig from "../../components/router/router.config";
const Breadcrumbs = () => {
  return (
    <Route>
      {({ location }) => {
        const pathnames = location.pathname
          .split("/")
          .filter(x => x && isNaN(Number(x)));
        return (
          <Breadcrumb
            aria-label="Breadcrumb"
            style={{
              fontSize: "1.4em",
              borderRadius: "0",
              height: 32
            }}
          >
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const [route] = routerConfig(true)
                .map(r => {
                  let mRoute = null;
                  if (!r.path.includes(to)) return mRoute;
                  mRoute = r;
                  return mRoute;
                })
                .filter(x => x);
              if (!route) return null;
              const { name, routes } = route;
              const subroute =
                pathnames.length > 1 && routes
                  ? routes.find(t =>
                      t.path.includes(pathnames[pathnames.length - 1])
                    )
                  : null;
              return (
                <Fragment key={`${index}-${to}`}>
                  {(!last || pathnames.length === 1) && (
                    <Breadcrumb.Item
                      style={{
                        fontSize: "1.2em",
                        color: "#333"
                      }}
                      href={to}
                    >
                      {name}
                    </Breadcrumb.Item>
                  )}
                  {last && pathnames.length > 1 ? (
                    <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                  ) : subroute ? (
                    <Breadcrumb.Item active>{subroute.name}</Breadcrumb.Item>
                  ) : null}
                </Fragment>
              );
            })}
          </Breadcrumb>
        );
      }}
    </Route>
  );
};
export default Breadcrumbs;
