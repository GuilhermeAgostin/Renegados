import React, { Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ModalContainer } from "react-router-modal";
import "react-router-modal/css/react-router-modal.css";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { isAuthenticated } from "./services/auth";
import { Colors } from "./constants/Colors";
import { Fonts } from "./constants/Fonts";

import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SendMessage from "./pages/SendMessage";
import UnitList from "./pages/UnitList";
import UserList from "./pages/UserList";
import InsertUser from "./pages/InsertUser";

import ActivateAccount from "./pages/ActivateAccount";
import InfoScreen from "./pages/InfoScreen";

import PasswordRecovery from "./pages/PasswordRecovery";
import SetNewPassword from "./pages/SetNewPassword";
import Monitoring from "./pages/Monitoring";
import DeviceList from "./pages/DeviceList";
import InspectionList from "./pages/InspectionList";

import App from "./pages/App";

const theme = createMuiTheme( {
  palette: {
    primary: { main: Colors.Primary, light: Colors.Primary, main: Colors.Primary, dark: Colors.Black, contrastText: Colors.White }
    , secondary: { main: Colors.Red }
    , error: { main: Colors.Red }
    , textSecondary: { main: Colors.White }
    , White: { main: Colors.White }
    , inherit: { main: Colors.Primary, light: Colors.Primary, main: Colors.Primary, dark: Colors.Black, contrastText: Colors.Black }
  }
  , typography: { fontFamily: Fonts.primary }
} );

const PrivateRoute = ( { component: Component, ...rest } ) => (
  <Route
    { ...rest }
    render={ props =>
      isAuthenticated()
        ? ( <Component { ...props } /> )
        : ( <Redirect to={ { pathname: "/", state: { from: props.location } } } /> )
    }
  />
);

const Routes = () => (

  <ThemeProvider theme={ theme }>
    <Fragment>
      <Switch>
        <Route exact path={ process.env.PUBLIC_URL + "/" } component={ SignIn } />
        <Route path={ process.env.PUBLIC_URL + "/ActivateAccount:redirectParam" } component={ ActivateAccount } />
        <Route path={ process.env.PUBLIC_URL + "/InfoScreen:redirectParam" } component={ InfoScreen } />
        <Route path={ process.env.PUBLIC_URL + "/PasswordRecovery" } component={ PasswordRecovery } />
        <Route path={ process.env.PUBLIC_URL + "/SetNewPassword" } component={ SetNewPassword } />
        <Route path={ process.env.PUBLIC_URL + "/Dashboard" } component={ Dashboard } />
        <Route path={ process.env.PUBLIC_URL + "/InsertUser" } component={ InsertUser } />

        <PrivateRoute path={ process.env.PUBLIC_URL + "/SendMessage:redirectParam" } component={ SendMessage } />

        <PrivateRoute path={ process.env.PUBLIC_URL + "/Monitoring" } component={ Monitoring } />
        <PrivateRoute path={ process.env.PUBLIC_URL + "/DeviceList" } component={ DeviceList } />
        <PrivateRoute path={ process.env.PUBLIC_URL + "/InspectionList" } component={ InspectionList } />

        <PrivateRoute path={ process.env.PUBLIC_URL + "/app" } component={ App } />
        <PrivateRoute path={ process.env.PUBLIC_URL + "/UnitList" } component={ UnitList } />
        <Route path={ process.env.PUBLIC_URL + "/UserList" } component={ UserList } />
        <Route path="*" component={ () => <h1>Page not found</h1> } />

      </Switch>
      <ModalContainer />
    </Fragment>
  </ThemeProvider>

);

export default Routes;
