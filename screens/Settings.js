import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  TouchableOpacity,
} from "react-native";

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
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={this.handleLogout}>
            <Text style={styles.buttonStyles}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgreen",
  },
  buttonView: { padding: 10 },
  buttonStyles: {
    backgroundColor: "blue",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 12,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
  },
});
