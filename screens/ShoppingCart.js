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
      const { id, qty, price, credits, itemName, type, uid } = doc.data();
      shoppingCartData.push({
        id,
        qty,
        price,
        credits,
        itemName,
        type,
        //age,
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

  deleteItem = (index, item) => {
    console.log("Delete item index: " + index);
    console.log("Delete item id:" + item.id);

    const filteredShoppingCartData = this.state.shoppingCartData.filter(
      (cartItem) => cartItem.id !== item.id
    );
    this.setState({ shoppingCartData: filteredShoppingCartData });

    db.collection("shoppingCart")
      .doc(item.id)
      .delete()
      .then(() => console.log(item.id + "deleted successfully!"));
  };

  handleGoToPayment = () => {
    if (
      this.state.totalPrice == 0 &&
      this.state.totalLessonCredits == 0 &&
      this.state.totalLessonCredits == 0
    ) {
      Alert.alert(
        "Empty Shopping Cart",
        "Please add items to your shopping cart before proceeding to payment."
      );
    } else {
      this.props.navigation.navigate("Payment", {
        price: this.state.totalPrice,
        lessonCredits: this.state.totalLessonCredits,
        practiceCredits: this.state.totalPracticeCredits,
      });
    }
  };

  handleEditQuantity = (item) => {
    this.props.navigation.navigate("EditItemQty", { item: item });
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text>Total Price: ${this.state.totalPrice}</Text>
          <Text>Total Lesson Credits: {this.state.totalLessonCredits}</Text>
          <Text>Total Practice Credits: {this.state.totalPracticeCredits}</Text>
        </View>

        <FlatList
          data={this.state.shoppingCartData}
          renderItem={({ item, index }) => (
            <View>
              <Text>Item: {item.itemName}</Text>
              <Text>
                Qty: {item.qty} Price: ${item.price} Credits: {item.credits}
              </Text>
              <View style={styles.editDelete}>
                <Button
                  title="Edit Quantity"
                  item={item}
                  onPress={() => this.handleEditQuantity(item)}
                />
                <Button
                  title="Delete Item"
                  item={item}
                  onPress={() => this.deleteItem(index, item)}
                />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button
          title="Go to Payment"
          onPress={() => this.handleGoToPayment()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  editDelete: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
