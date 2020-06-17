import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  Alert,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";
import { StackRouter } from "react-navigation";

export default class Payment extends React.Component {
  state = {
    currentUser: null,
    price: null,
    oldLessonCredits: null,
    oldPracticeCredits: null,
    lessonCredits: null,
    practiceCredits: null,
    CCNum: null,
    MM: null,
    DD: null,
    CSC: null,
  };

  componentDidMount() {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });
    const { price } = this.props.navigation.state.params;
    this.setState({ price });
    const { lessonCredits } = this.props.navigation.state.params;
    this.setState({ lessonCredits });
    const { practiceCredits } = this.props.navigation.state.params;
    this.setState({ practiceCredits });
  }

  handlePayment = () => {
    var userID = this.state.currentUser.uid;
    console.log("User ID for payment is:" + userID);

    // First perform the query
    db.collection("shoppingCart")
      .where("uid", "==", userID)
      .get()
      .then(function (querySnapshot) {
        // Once we get the results, begin a batch
        var batch = db.batch();

        querySnapshot.forEach(function (doc) {
          // For each doc, add a delete operation to the batch
          batch.delete(doc.ref);
        });
        // Commit the batch
        batch.commit();
      })
      .then(function () {
        // Delete completed!
      });

    //get user's current practice and lesson credits and save to variables
    db.collection("users")
      .doc(userID)
      .get()
      .then((doc) => {
        this.setState({ oldLessonCredits: doc.data().lessonCredits });
        this.setState({ oldPracticeCredits: doc.data().practiceCredits });

        //set user practice and lesson credits to current credits plus total credits from shopping cart
        var newLessonCredits =
          this.state.oldLessonCredits + this.state.lessonCredits;
        var newPracticeCredits =
          this.state.oldPracticeCredits + this.state.practiceCredits;

        db.collection("users").doc(userID).update({
          lessonCredits: newLessonCredits,
        });
        db.collection("users").doc(userID).update({
          practiceCredits: newPracticeCredits,
        });

        //return to home screen
        this.props.navigation.navigate("Home");
      })
      .then(
        Alert.alert("Successful payment!", "Your credits have been updated.")
      );
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 36 }}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Text>Total Price: {this.state.price}</Text>
        <Text>Total Lesson Credits: {this.state.lessonCredits}</Text>
        <Text>Total Practice Credits: {this.state.practiceCredits}</Text>

        <Text>Credit Card Number</Text>
        <TextInput
          placeholder="Credit Card Number"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(CCNum) => this.setState({ CCNum })}
          value={this.state.CCNum}
          maxLength="16"
        />

        <Text>Expiration Date</Text>
        <TextInput
          placeholder="MM"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(MM) => this.setState({ MM })}
          value={this.state.MM}
          maxLength="2"
        />
        <TextInput
          placeholder="DD"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(DD) => this.setState({ DD })}
          value={this.state.DD}
          maxLength="2"
        />

        <Text>CSC</Text>
        <TextInput
          placeholder="CSC"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(CSC) => this.setState({ CSC })}
          value={this.state.CSC}
          maxLength="3"
        />
        <Button title="Process Payment" onPress={this.handlePayment} />
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
