import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class ViewReservations extends React.Component {
  constructor(props) {
    super(props);
    //this._isMounted = false;
    this.state = { currentUser: null, apptSlotsData: [] };
  }
  //state = { currentUser: null, apptSlotsData: [] };

  componentDidMount() {
    // const { currentUser } = Firebase.auth();
    // this.setState({ currentUser });

    // this.unsubscribe = db
    //   .collection("appointments")
    //   .where("uid", "==", currentUser.uid)
    //   .onSnapshot(this.onCollectionUpdate);
    //this._isMounted = true;
    this.loadInitialData();
    this.willFocusListener = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.loadInitialData();
      }
    );
  }

  collectionWillUnMount() {
    //this.unsubscribe();
    //this._isMounted = false;
    this.willFocusListener.remove();
  }

  loadInitialData = () => {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });

    //this.unsubscribe = db
    db.collection("appointments")
      .where("uid", "==", currentUser.uid)
      .onSnapshot(this.onCollectionUpdate);
  };

  onCollectionUpdate = (querySnapshot) => {
    var apptSlotsData = [];
    querySnapshot.forEach((doc) => {
      let { id, date, time, type, name, credits } = doc.data();
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
          let oldLessonCredits = doc.data().lessonCredits;
          let newLessonCredits = oldLessonCredits + 1;
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
          let oldPracticeCredits = doc.data().practiceCredits;
          let newPracticeCredits = oldPracticeCredits + 1;
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
    return (
      <View style={styles.container}>
        <Text style={styles.topTextStyles}>
          Below are your scheduled reservations:
        </Text>
        <FlatList
          data={this.state.apptSlotsData}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text>
                {item.date} {item.time} {item.name}
              </Text>
              <TouchableOpacity
                item={item}
                onPress={() => this.handleCancelReservation(index, item)}
              >
                <Text style={styles.buttonStyles}>Cancel Reservation</Text>
              </TouchableOpacity>
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
  topTextStyles: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 },
  listItem: {
    margin: 5,
    padding: 10,
    backgroundColor: "mediumspringgreen",
    borderWidth: 1,
  },
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
