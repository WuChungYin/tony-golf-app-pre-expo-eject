import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
// import the different screens
import Loading from "./Loading";
import SignUp from "./SignUp";
import Login from "./Login";
import Main from "./Main";

import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

// create our app's navigation stack
const SwitchContainer = createSwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Main,
  },
  {
    initialRouteName: "Loading",
  }
);

const App = createAppContainer(SwitchContainer);

export default App;
