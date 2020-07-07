import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  FlatList,
  Alert,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class ViewReservations extends React.Component {
  state = { currentUser: null, apptSlotsData: [] };

  componentDidMount() {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });

    this.unsubscribe = db
      .collection("appointments")
      .where("uid", "==", currentUser.uid)
      .onSnapshot(this.onCollectionUpdate);
  }

  collectionWillUnMount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const apptSlotsData = [];
    querySnapshot.forEach((doc) => {
      const { id, date, time, type, name, credits } = doc.data();
      apptSlotsData.push({
        id,
        date,
        time,
        type,
        name,
        credits,
      });
    });
    this.setState({ apptSlotsData: apptSlotsData });
    console.log("appSlotsData = " + JSON.stringify(this.state.apptSlotsData));
  };

  handleCancelReservation = (index, item) => {
    const userID = this.state.currentUser.uid;

    //updating appt slot with "null" for uid field in Firebase
    db.collection("appointments").doc(item.id).update({ uid: "null" });

    //adding credits back to user after cancelling appt
    if (item.type == "lesson") {
      db.collection("users")
        .doc(userID)
        .get()
        .then((doc) => {
          var oldLessonCredits = doc.data().lessonCredits;
          var newLessonCredits = oldLessonCredits + 1;
          db.collection("users").doc(userID).update({
            lessonCredits: newLessonCredits,
          });
          //return to home screen
          this.props.navigation.navigate("Home");
        })
        .then(
          Alert.alert(
            "Successful cancellation!",
            "Your credits have been updated."
          )
        );
    } else {
      db.collection("users")
        .doc(userID)
        .get()
        .then((doc) => {
          var oldPracticeCredits = doc.data().practiceCredits;
          var newPracticeCredits = oldPracticeCredits + 1;
          db.collection("users").doc(userID).update({
            practiceCredits: newPracticeCredits,
          });
          //return to home screen
          this.props.navigation.navigate("Home");
        })
        .then(
          Alert.alert(
            "Successful cancellation!",
            "Your credits have been updated."
          )
        );
    }
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Below are your scheduled reservations:</Text>
        <FlatList
          style={styles.list}
          data={this.state.apptSlotsData}
          renderItem={({ item, index }) => (
            <View>
              <Text>
                {item.date} {item.time} {item.name}
              </Text>
              <Button
                title="Cancel Reservation"
                item={item}
                onPress={() => this.handleCancelReservation(index, item)}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
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
    backgroundColor: "lightgreen",
  },
  list: {
    backgroundColor: "mediumspringgreen",
  },
});
