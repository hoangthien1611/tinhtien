import React from "react";
import "./design/dist/project.css";
import { Route, Switch, HashRouter, Redirect } from "react-router-dom";
import MainPage from "./components/main/page";
import Welcome from "./components/Welcome";
import Overview from "./pages/Overview";
import Page404 from "./components/Page404";

const AppRouter = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/welcome/" component={Welcome} />
        <Route exact path="/activity/:code/:tab" component={Overview} />
        <Route exact path="/activity/:code" component={Overview} />
        <Route path="/404" component={Page404} />
        <Redirect from="*" to="/404" />
      </Switch>
    </HashRouter>
  );
};
export { AppRouter };
