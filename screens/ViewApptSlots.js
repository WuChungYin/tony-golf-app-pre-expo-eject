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

export default class ViewApptSlots extends React.Component {
  state = { currentUser: null, apptSlotsData: [], date: "", type: "" };

  componentDidMount() {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });

    const { date } = this.props.navigation.state.params;
    this.setState({ date });
    const { type } = this.props.navigation.state.params;
    this.setState({ type });

    this.unsubscribe = db
      .collection("appointments")
      .where("date", "==", date)
      .where("type", "==", type)
      .where("uid", "==", "null")
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

  selectApptSlot = (index, item) => {
    const userID = this.state.currentUser.uid;

    //updating appt slot with user id

    var itemID = item.id;
    console.log("updated appt slot id:" + item.id);
    db.collection("appointments").doc(itemID).update({ uid: userID });

    //deducting credits from user after setting appt
    if (item.type == "lesson") {
      db.collection("users")
        .doc(userID)
        .get()
        .then((doc) => {
          var oldLessonCredits = doc.data().lessonCredits;
          var newLessonCredits = oldLessonCredits - 1;
          db.collection("users").doc(userID).update({
            lessonCredits: newLessonCredits,
          });
          //return to home screen
          this.props.navigation.navigate("Home");
        })
        .then(
          Alert.alert(
            "Successful reservation!",
            "Your credits have been updated."
          )
        );
    } else {
      db.collection("users")
        .doc(userID)
        .get()
        .then((doc) => {
          var oldPracticeCredits = doc.data().practiceCredits;
          var newPracticeCredits = oldPracticeCredits - 1;
          db.collection("users").doc(userID).update({
            practiceCredits: newPracticeCredits,
          });
          //return to home screen
          this.props.navigation.navigate("Home");
        })
        .then(
          Alert.alert(
            "Successful reservation!",
            "Your credits have been updated."
          )
        );
    }
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>This is ViewApptSlotss Screen</Text>
        <Text>
          Date:{this.state.date} Type:{this.state.type}
        </Text>
        <FlatList
          data={this.state.apptSlotsData}
          renderItem={({ item, index }) => (
            <View>
              <Text>
                {item.date} {item.time} {item.name} Credits:
                {item.credits}
              </Text>
              <Button
                title="Select Appointment Slot"
                item={item}
                onPress={() => this.selectApptSlot(index, item)}
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
  },
});
