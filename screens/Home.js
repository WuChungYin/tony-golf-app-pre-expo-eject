import React from "react";
import { StyleSheet, Platform, Image, Text, View, Button } from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class Home extends React.Component {
  state = { currentUser: null, lessonCredits: null, practiceCredits: null };

  componentDidMount() {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });

    const uid = currentUser.uid;
    console.log("user's UID: " + uid);

    db.collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        //console.log("Lesson credits: " + doc.data().lessonCredits);
        //console.log("Practice credits: " + doc.data().practiceCredits);
        this.setState({ lessonCredits: doc.data().lessonCredits });
        this.setState({ practiceCredits: doc.data().practiceCredits });
      });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Text>Lesson Credits: {this.state.lessonCredits}</Text>
        <Text>Practice Credits: {this.state.practiceCredits}</Text>
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
