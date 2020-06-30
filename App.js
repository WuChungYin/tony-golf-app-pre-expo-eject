import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
// import the different screens
import Loading from "./screens/Loading";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Purchase from "./screens/Purchase";
import ShoppingCart from "./screens/ShoppingCart";
import EditItemQty from "./screens/EditItemQty";
import Payment from "./screens/Payment";
import Reserve from "./screens/Reserve";
import ViewApptSlots from "./screens/ViewApptSlots";
import Settings from "./screens/Settings";
import ViewReservations from "./screens/ViewReservations";

import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const LoginStackNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    SignUp: { screen: SignUp },
  },
  { initialRouteName: "Login" }
);

const HomeStackNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Purchase: { screen: Purchase },
    ShoppingCart: { screen: ShoppingCart },
    EditItemQty: { screen: EditItemQty },
    Payment: { screen: Payment },
    Reserve: { screen: Reserve },
    ViewApptSlots: { screen: ViewApptSlots },
  },
  { initialRouteName: "Home" }
);

const BottomTabNavigator = createBottomTabNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarLabel: "Settings",
      },
    },
    Home: {
      screen: HomeStackNavigator,
      navigationOptions: {
        tabBarLabel: "Home",
      },
    },
    ViewReservations: {
      screen: ViewReservations,
      navigationOptions: {
        tabBarLabel: "View Reservations",
      },
    },
  },
  { initialRouteName: "Home", order: ["Settings", "Home", "ViewReservations"] }
);

// create our app's navigation stack
const SwitchContainer = createSwitchNavigator(
  {
    Loading,
    LoginStackNavigator,
    BottomTabNavigator,
  },
  {
    initialRouteName: "Loading",
  }
);

const App = createAppContainer(SwitchContainer);

export default App;
