import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  Alert,
} from "react-native";

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
        this.setState({ lessonCredits: doc.data().lessonCredits });
        this.setState({ practiceCredits: doc.data().practiceCredits });
      });
  }

  handleLessonCheckAndRedirect = () => {
    if (this.state.lessonCredits > 0) {
      this.props.navigation.navigate("Reserve");
    } else {
      Alert.alert(
        "No Lesson Credits",
        "You have no lesson credits. Would you like to purchase some?",
        [
          {
            text: "No",
            onPress: () => this.props.navigation.navigate("Home"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => this.props.navigation.navigate("Purchase"),
          },
        ],
        { cancelable: false }
      );
    }
  };

  handlePracticeCheckAndRedirect = () => {
    if (this.state.practiceCredits > 0) {
      this.props.navigation.navigate("Reserve");
    } else {
      Alert.alert(
        "No Practice Credits",
        "You have no practice credits. Would you like to purchase some?",
        [
          {
            text: "No",
            onPress: () => this.props.navigation.navigate("Home"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => this.props.navigation.navigate("Purchase"),
          },
        ],
        { cancelable: false }
      );
    }
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Text>Lesson Credits: {this.state.lessonCredits}</Text>
        <Text>Practice Credits: {this.state.practiceCredits}</Text>
        <Button
          title="Reserve Lesson"
          onPress={this.handleLessonCheckAndRedirect}
        />
        <Button
          title="Reserve Practice Lane"
          onPress={this.handlePracticeCheckAndRedirect}
        />
        <Button
          title="Purchase Credits"
          onPress={() => this.props.navigation.navigate("Purchase")}
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
