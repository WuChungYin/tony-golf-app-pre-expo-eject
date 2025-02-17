import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class Payment extends React.Component {
  state = {
    currentUser: null,
    price: null,
    lessonCredits: null,
    practiceCredits: null,
    CCNum: null,
    MM: null,
    YY: null,
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
    if (
      !isNaN(this.state.CCNum) &&
      this.state.CCNum != null &&
      this.state.CCNum != ""
    ) {
      if (
        !isNaN(this.state.MM) &&
        this.state.MM != null &&
        this.state.MM != "" &&
        this.state.MM > 0 &&
        this.state.MM < 13
      ) {
        if (
          !isNaN(this.state.YY) &&
          this.state.YY != null &&
          this.state.YY != "" &&
          this.state.YY > 0 &&
          this.state.YY < 32
        ) {
          if (
            !isNaN(this.state.CSC) &&
            this.state.CSC != null &&
            this.state.CSC != ""
          ) {
            var userID = this.state.currentUser.uid;
            console.log("User ID for payment is:" + userID);

            //deleting shoppingCart items for curent user in Firebase
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
                var oldLessonCredits = doc.data().lessonCredits;
                var oldPracticeCredits = doc.data().practiceCredits;
                //set user practice and lesson credits to current credits plus total credits from shopping cart
                var newLessonCredits =
                  oldLessonCredits + this.state.lessonCredits;
                var newPracticeCredits =
                  oldPracticeCredits + this.state.practiceCredits;

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
                Alert.alert(
                  "Successful payment!",
                  "Your credits have been updated."
                )
              );
          } else {
            Alert.alert("Invalid input!", "Please input a valid CSC.");
          }
        } else {
          Alert.alert("Invalid input!", "Please input a valid day in YY form.");
        }
      } else {
        Alert.alert("Invalid input!", "Please input a valid month in MM form.");
      }
    } else {
      Alert.alert("Invalid input!", "Please input a valid credit card number.");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topTextView}>
          <Text>Total Price: ${this.state.price}</Text>
          <Text>Total Lesson Credits: {this.state.lessonCredits}</Text>
          <Text>Total Practice Credits: {this.state.practiceCredits}</Text>
        </View>
        <View style={styles.inputView}>
          <Text>Credit Card Number</Text>
          <TextInput
            placeholder="Credit Card Number"
            autoCapitalize="none"
            style={styles.textInputCC}
            onChangeText={(CCNum) => this.setState({ CCNum })}
            value={this.state.CCNum}
            maxLength={16}
          />
          <Text>Expiration Date</Text>
          <View style={styles.expirationDateRow}>
            <TextInput
              placeholder="MM"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={(MM) => this.setState({ MM })}
              value={this.state.MM}
              maxLength={2}
            />
            <Text></Text>
            <TextInput
              placeholder="YY"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={(YY) => this.setState({ YY })}
              value={this.state.YY}
              maxLength={2}
            />
          </View>
          <Text>CSC</Text>
          <TextInput
            placeholder="CSC"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={(CSC) => this.setState({ CSC })}
            value={this.state.CSC}
            maxLength={3}
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={this.handlePayment}>
            <Text style={styles.buttonStyles}>Process Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
  },
  topTextView: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 },
  inputView: { paddingHorizontal: 15 },
  expirationDateRow: { flexDirection: "row" },
  textInputCC: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "white",
  },
  textInput: {
    height: 40,
    width: 40,
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
