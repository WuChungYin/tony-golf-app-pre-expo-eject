import React from "react";
import { StyleSheet, Platform, Image, Text, View, Button } from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class Reserve extends React.Component {
  state = {};

  componentDidMount() {}

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>This is Reserve Screen</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
