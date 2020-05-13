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

export default class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      shoppingCartData: [],
      currentUser: null,
      totalPrice: 0,
      totalPracticeCredits: 0,
      totalLessonCredits: 0,
    };
  }

  componentDidMount() {
    const { currentUser } = Firebase.auth();
    const uid = currentUser.uid;
    this.setState({ currentUser });

    this.unsubscribe = db
      .collection("shoppingCart")
      .where("uid", "==", uid)
      .onSnapshot(this.onCollectionUpdate);
  }

  collectionWillUnMount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const shoppingCartData = [];
    querySnapshot.forEach((doc) => {
      const { qty, price, credits, itemName, type, age, uid } = doc.data();
      shoppingCartData.push({
        qty,
        price,
        credits,
        itemName,
        type,
        age,
        uid,
      });
    });
    this.setState({ shoppingCartData: shoppingCartData });
    console.log(
      "shoppingCartData = " + JSON.stringify(this.state.shoppingCartData)
    );

    var tempTotalPrice = 0;
    var tempLessonCredits = 0;
    var tempPracticeCredits = 0;
    for (var i = 0; i < shoppingCartData.length; i++) {
      tempTotalPrice =
        shoppingCartData[i].qty * shoppingCartData[i].price + tempTotalPrice;
      if (shoppingCartData[i].type == "practice") {
        tempPracticeCredits =
          shoppingCartData[i].qty * shoppingCartData[i].credits +
          tempPracticeCredits;
      } else if (shoppingCartData[i].type == "lesson") {
        tempLessonCredits =
          shoppingCartData[i].qty * shoppingCartData[i].credits +
          tempLessonCredits;
      }
    }
    this.setState({ totalPrice: tempTotalPrice }, () =>
      console.log("Total Price: " + this.state.totalPrice)
    );
    this.setState({ totalLessonCredits: tempLessonCredits }, () =>
      console.log("Total Lesson Credits: " + this.state.totalLessonCredits)
    );
    this.setState({ totalPracticeCredits: tempPracticeCredits }, () =>
      console.log("Total Practice Credits: " + this.state.totalPracticeCredits)
    );
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 36 }}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Text>Total Price:{this.state.totalPrice}</Text>
        <Text>Total Lesson Credits:{this.state.totalLessonCredits}</Text>
        <Text>Total Practice Credits:{this.state.totalPracticeCredits}</Text>
        <FlatList
          data={this.state.shoppingCartData}
          renderItem={({ item, index }) => (
            <View>
              <Text>
                Qty:{item.qty} Price:${item.price} Credits:{item.credits} Item
                Name:{item.itemName} UID:{item.uid} Index:
                {index}
              </Text>
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
