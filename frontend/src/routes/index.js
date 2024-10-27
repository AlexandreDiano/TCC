import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import GuestRoute from "./guestRoute";

import {
  Dashboard,
  Users,
  Doors,
  Keys,
  Accesses,
  Error404,
  Login,
  VirtualDoor,
} from "~/pages";

const Routes = () => {
  return (
    <Route
      render={({ location }) => (
        <Switch location={location} key={location.pathname}>
          {/* Login */}
          <GuestRoute exact path="/" component={Login} />

          {/* Dashboard */}
          <PrivateRoute exact path="/dashboard" component={Dashboard} />

          {/* Usuários */}
          <PrivateRoute exact path="/users" component={Users} />

          {/* Portas */}
          <PrivateRoute exact path="/doors" component={Doors} />

          {/* Chaves */}
          <PrivateRoute exact path="/keys" component={Keys} />

          {/* Acessos */}
          <PrivateRoute exact path="/accesses" component={Accesses} />

          {/* Porta Virtual */}
          <Route exact path="/porta-virtual" component={VirtualDoor} />

          {/* Erro */}
          <Route component={Error404} />
        </Switch>
      )}
    />
  );
};

export default Routes;
