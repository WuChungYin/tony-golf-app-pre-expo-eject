import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      lessonCredits: null,
      practiceCredits: null,
    };
  }

  //state = { currentUser: null, lessonCredits: null, practiceCredits: null };

  componentDidMount() {
    this.loadInitialData();
    this.willFocusListener = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.loadInitialData();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusListener.remove();
  }

  loadInitialData = () => {
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
  };

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
        {/* <Button
          title="Reserve Lesson"
          onPress={this.handleLessonCheckAndRedirect}
        /> */}
        <TouchableOpacity onPress={this.handleLessonCheckAndRedirect}>
          <Text style={styles.buttonStyles}>Reserve Lesson</Text>
        </TouchableOpacity>
        {/* <Button
          title="Reserve Practice Lane"
          onPress={this.handlePracticeCheckAndRedirect}
        /> */}
        <TouchableOpacity onPress={this.handleLessonCheckAndRedirect}>
          <Text style={styles.buttonStyles}>Reserve Practice Lane</Text>
        </TouchableOpacity>
        {/* <Button
          title="Purchase Credits"
          onPress={() => this.props.navigation.navigate("Purchase")}
        /> */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Purchase")}
        >
          <Text style={styles.buttonStyles}>Purchase Credits</Text>
        </TouchableOpacity>
        {/* <Button
          title="View Shopping Cart"
          onPress={() => this.props.navigation.navigate("ShoppingCart")}
        /> */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("ShoppingCart")}
        >
          <Text style={styles.buttonStyles}>View Shopping Cart</Text>
        </TouchableOpacity>
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
