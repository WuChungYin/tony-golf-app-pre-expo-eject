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

//import CounterInput from "react-counter-input";

import Firebase, { db } from "../config/Firebase.js";

export default class Purchase extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      purchaseItems: [
        {
          id: 1,
          price: 50,
          credits: 10,
          itemName: "Package - Adult Lessons",
          age: "Adult",
          type: "lesson",
        },
        {
          id: 2,
          price: 50,
          credits: 10,
          itemName: "Package - Junior Lessons",
          age: "Junior",
          type: "lesson",
        },
        {
          id: 3,
          price: 150,
          credits: 30,
          itemName: "Package - Practice Lane",
          age: null,
          type: "practice",
        },
        {
          id: 4,
          price: 5,
          credits: 1,
          itemName: "Single - Adult Lesson",
          age: "Adult",
          type: "lesson",
        },
        {
          id: 5,
          price: 5,
          credits: 1,
          itemName: "Single - Junior Lesson",
          age: "Junior",
          type: "lesson",
        },
        {
          id: 6,
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
    return (
      <View style={{ flex: 1, paddingTop: 36 }}>
        <FlatList
          data={this.state.purchaseItems}
          renderItem={({ item }) => (
            <View>
              <Text>
                ${item.price} {item.credits} credits {item.itemName}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
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
