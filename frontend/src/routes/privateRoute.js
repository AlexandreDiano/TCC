import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { store } from "~/store";
import { Toast } from "~/components/elements";
import MESSAGE from "~/utils/messages";

const PrivateRoute = ({ component: Component, ...rest }) => {
  useEffect(() => {
    if (!store.getState().authentication.token) {
      Toast("error", MESSAGE.routePrivate);
    }
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        store.getState().authentication.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
