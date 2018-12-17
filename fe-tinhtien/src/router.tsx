import React from "react"
import { Route, BrowserRouter, Switch } from "react-router-dom";
import MainPage from "./components/main/page"
import Welcome from "./components/Welcome"

const AppRouter =  () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainPage}/>
        <Route path="/welcome/" component={Welcome}/>
      </Switch>
    </BrowserRouter>
  )
};
export { AppRouter } ;
