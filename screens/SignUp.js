import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class SignUp extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    errorMessage: null,
  };

  handleSignUp = () => {
    if (this.state.firstName != "") {
      if (this.state.lastName != "") {
        if (this.state.phone != "") {
          Firebase.auth()
            .createUserWithEmailAndPassword(
              this.state.email,
              this.state.password
            )
            .then((credentials) => {
              const user = {
                uid: credentials.user.uid,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phone: this.state.phone,
                email: this.state.email,
                practiceCredits: 0,
                lessonCredits: 0,
              };
              console.log(credentials.user.uid);
              db.collection("users")
                .doc(credentials.user.uid)
                .set(user)
                .then(() => {
                  console.log("Succesfully set!");
                })
                .catch((error) =>
                  console.log("Error with set" + error.message)
                );
            })
            .then(() => this.props.navigation.navigate("Home"))
            .catch((error) => this.setState({ errorMessage: error.message }));
        } else {
          Alert.alert("Empty Required Field!", "Please input a phone number.");
        }
      } else {
        Alert.alert("Empty Required Field!", "Please input a last name.");
      }
    } else {
      Alert.alert("Empty Required Field!", "Please input a first name.");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Bob's Golf Appointment App</Text>
        </View>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          placeholder="First Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(firstName) => this.setState({ firstName })}
          value={this.state.firstName}
        />
        <TextInput
          placeholder="Last Name"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(lastName) => this.setState({ lastName })}
          value={this.state.lastName}
        />
        <TextInput
          placeholder="Phone Number"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(phone) => this.setState({ phone })}
          value={this.state.phone}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={this.handleSignUp}>
            <Text style={styles.buttonStyles}>Sign Up</Text>
          </TouchableOpacity>
          <Button
            title="Already have an account? Login"
            onPress={() => this.props.navigation.navigate("Login")}
          />
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
  titleView: { padding: 10 },
  titleText: { fontSize: 20, fontWeight: "bold" },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "white",
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
