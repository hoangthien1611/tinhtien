import React from "react"
import {Route, Switch, HashRouter} from "react-router-dom";
import MainPage from "./components/main/page"
import Welcome from "./components/Welcome"

const AppRouter =  () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={MainPage}/>
        <Route path="/welcome/" component={Welcome}/>
      </Switch>
    </HashRouter>
  )
};
export { AppRouter } ;
