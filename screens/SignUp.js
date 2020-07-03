import React from "react";
import { StyleSheet, Text, TextInput, View, Button, Alert } from "react-native";
import DatePicker from "react-native-datepicker";

import Firebase, { db } from "../config/Firebase.js";

export default class SignUp extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    //dob: "01-01-2020",
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
                //dob: this.state.dob,
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
        <Text>Sign Up</Text>
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
        {/* <DatePicker
          style={{ width: 200 }}
          date={this.state.dob} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder=""
          format="MM-DD-YYYY"
          minDate="01-01-1900"
          maxDate="01-01-2050"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={(dob) => {
            this.setState({ dob: dob });
          }}
        /> */}
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate("Login")}
        />
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
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
  },
});
