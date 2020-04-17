import React from "react";
import { StyleSheet, Platform, Image, Text, View, Button } from "react-native";

import Firebase from "../config/Firebase.js";

export default class Settings extends React.Component {
  state = { currentUser: null };
  componentDidMount() {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });
  }
  handleLogout = () => {
    Firebase.auth()
      .signOut()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    this.setState({ currentUser: null });
  };
  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Button title="Logout" onPress={this.handleLogout} />
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
