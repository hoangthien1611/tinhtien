import React from "react";
import "./design/dist/project.css";
import { Route, Switch, HashRouter } from "react-router-dom";
import MainPage from "./components/main/page";
import Welcome from "./components/Welcome";
import Overview from "./pages/Overview";

const AppRouter = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/welcome/" component={Welcome} />
        <Route path="/activity/:code" component={Overview} />
      </Switch>
    </HashRouter>
  );
};
export { AppRouter };
