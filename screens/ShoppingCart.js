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
  //state = { currentUser: null };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      shoppingCartData: [],
      currentUser: null,
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
      //   console.log(
      //     "doc data:" + qty + price + credits + itemName + type + age + uid
      //   );
      shoppingCartData.push({
        //key: doc.id,
        //doc,
        qty,
        price,
        credits,
        itemName,
        type,
        age,
        uid,
      });
    });
    // console.log(
    //   "initial shopping cart data: " + JSON.stringify(shoppingCartData)
    // );
    this.setState({ shoppingCartData: shoppingCartData });
    console.log(
      "shoppingCartData = " + JSON.stringify(this.state.shoppingCartData)
    );
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 36 }}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
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
