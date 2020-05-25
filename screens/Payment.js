import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  FlatList,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";
import { StackRouter } from "react-navigation";

export default class Payment extends React.Component {
  state = {
    currentUser: null,
    price: null,
    lessonCredits: null,
    practiceCredits: null,
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

  render() {
    const { currentUser } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 36 }}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Text>Total Price: {this.state.price}</Text>
        <Text>Total Lesson Credits: {this.state.lessonCredits}</Text>
        <Text>Total Practice Credits: {this.state.practiceCredits}</Text>
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
