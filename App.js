import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
// import the different screens
import Loading from "./screens/Loading";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Main from "./screens/Main";

import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const LoginStackNavigator = createStackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp },
});

// create our app's navigation stack
const SwitchContainer = createSwitchNavigator(
  {
    Loading,
    LoginStackNavigator,
    Main,
  },
  {
    initialRouteName: "Loading",
  }
);

const App = createAppContainer(SwitchContainer);

export default App;
