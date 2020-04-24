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

export default class Purchase extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      purchaseItems: [
        {
          price: 50,
          credits: 10,
          itemName: "Package - Adult Lessons",
          age: "Adult",
          type: "lesson",
        },
        {
          price: 50,
          credits: 10,
          itemName: "Package - Junior Lessons",
          age: "Junior",
          type: "lesson",
        },
        {
          price: 150,
          credits: 30,
          itemName: "Package - Practice Lane",
          age: null,
          type: "practice",
        },
        {
          price: 5,
          credits: 1,
          itemName: "Single - Adult Lesson",
          age: "Adult",
          type: "lesson",
        },
        {
          price: 5,
          credits: 1,
          itemName: "Single - Junior Lesson",
          age: "Junior",
          type: "lesson",
        },
        {
          price: 5,
          credits: 1,
          itemName: "Single - Practice Lane",
          age: null,
          type: "practice",
        },
      ],
      totalLessonCredits: null,
      totalPracticeCredits: null,
      totalPrice: null,
    };
  }

  componentDidMount() {
    console.log("Purchase Items: " + JSON.stringify(this.state.purchaseItems));
  }

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>This is Purchase Screen</Text>
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
