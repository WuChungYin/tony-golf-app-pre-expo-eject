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

export default class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    //this.unsubscribe = null;
    //this._isMounted = false;
    this.state = {
      shoppingCartData: [],
      currentUser: null,
      totalPrice: 0,
      totalPracticeCredits: 0,
      totalLessonCredits: 0,
    };
  }
  // state = {
  //   shoppingCartData: [],
  //   currentUser: null,
  //   totalPrice: 0,
  //   totalPracticeCredits: 0,
  //   totalLessonCredits: 0,
  // };

  componentDidMount() {
    // const { currentUser } = Firebase.auth();
    // const uid = currentUser.uid;
    // this.setState({ currentUser });

    // this.unsubscribe = db
    //   .collection("shoppingCart")
    //   .where("uid", "==", uid)
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
    const uid = currentUser.uid;
    this.setState({ currentUser });

    //this.unsubscribe = db
    db.collection("shoppingCart")
      .where("uid", "==", uid)
      .onSnapshot(this.onCollectionUpdate);
  };

  onCollectionUpdate = (querySnapshot) => {
    var shoppingCartData = [];
    querySnapshot.forEach((doc) => {
      let { id, qty, price, credits, itemName, type, uid } = doc.data();
      shoppingCartData.push({
        id,
        qty,
        price,
        credits,
        itemName,
        type,
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

  handleDeleteItem = (index, item) => {
    console.log("Delete item index: " + index);
    console.log("Delete item id:" + item.id);

    const filteredShoppingCartData = this.state.shoppingCartData.filter(
      (cartItem) => cartItem.id !== item.id
    );
    this.setState({ shoppingCartData: filteredShoppingCartData });

    db.collection("shoppingCart")
      .doc(item.id)
      .delete()
      .then(
        Alert.alert(
          "Success!",
          "You have removed the selected item from your shopping cart."
        )
      );
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
    return (
      <View style={styles.container}>
        <View style={styles.topTextView}>
          <Text>Total Price: ${this.state.totalPrice}</Text>
          <Text>Total Lesson Credits: {this.state.totalLessonCredits}</Text>
          <Text>Total Practice Credits: {this.state.totalPracticeCredits}</Text>
        </View>
        <FlatList
          data={this.state.shoppingCartData}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text>Item: {item.itemName}</Text>
              <Text>
                Qty: {item.qty} Price: ${item.price} Credits: {item.credits}
              </Text>
              <View style={styles.editDeleteButtons}>
                <TouchableOpacity
                  item={item}
                  onPress={() => this.handleEditQuantity(item)}
                >
                  <Text style={styles.buttonStyles}>Edit Quantity</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  item={item}
                  onPress={() => this.handleDeleteItem(index, item)}
                >
                  <Text style={styles.buttonStyles}>Delete Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={() => this.handleGoToPayment()}>
            <Text style={styles.buttonStyles}>Go to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
  },
  topTextView: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 },
  listItem: {
    margin: 5,
    padding: 10,
    backgroundColor: "mediumspringgreen",
    borderWidth: 1,
  },
  editDeleteButtons: {
    paddingVertical: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonView: { padding: 10 },
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
