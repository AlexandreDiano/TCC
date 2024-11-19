import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { store } from "~/store";

const GuestRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !store.getState().authentication.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/dashboard",
            }}
          />
        )
      }
    />
  );
};

GuestRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default GuestRoute;
