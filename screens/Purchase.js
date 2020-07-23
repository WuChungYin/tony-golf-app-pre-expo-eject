import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class Purchase extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     purchaseItems: [],
  //     qtyArray: [],
  //   };
  // }

  state = {
    purchaseItems: [],
    qtyArray: [],
  };

  componentDidMount() {
    this.unsubscribe = db
      .collection("purchaseItems")
      .onSnapshot(this.onCollectionUpdate);
  }

  collectionWillUnMount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    var purchaseItems = [];
    querySnapshot.forEach((doc) => {
      let { id, price, credits, itemName, type } = doc.data();
      purchaseItems.push({
        id,
        price,
        credits,
        itemName,
        type,
      });
    });
    this.setState({ purchaseItems: purchaseItems });
    console.log("purchaseItems = " + JSON.stringify(this.state.purchaseItems));

    const numItems = this.state.purchaseItems.length;
    var newArray = this.state.qtyArray.slice();
    var i;
    for (i = 0; i < numItems; i++) {
      newArray.push(0);
    }
    this.setState({ qtyArray: [...this.state.qtyArray, ...newArray] }, () =>
      console.log("qtyArray: " + this.state.qtyArray)
    );
  };

  handleSetRowQty = (qty, item, index) => {
    var intqty = parseInt(qty, 10); //10 means base-10
    if (!intqty) {
      //checking if intqty is null or NaN, and if so, set it to 0
      intqty = 0;
    }
    var newArray = [...this.state.qtyArray];
    newArray[index] = intqty;
    this.setState({ qtyArray: newArray }, () =>
      console.log("qtyArray: " + this.state.qtyArray)
    );
  };

  handleAddToShoppingCart = (qtyArray, data) => {
    console.log("shopping qtyArray: " + JSON.stringify(qtyArray));
    console.log("shopping purchaseItems: " + JSON.stringify(data));

    const { currentUser } = Firebase.auth();
    const uid = currentUser.uid;
    console.log("user's UID: " + uid);

    var qtyTotal = 0;
    var batch = db.batch();
    for (var i = 0; i < qtyArray.length; i++) {
      console.log("qtyArray current qty:" + qtyArray[i]);
      qtyTotal = qtyTotal + qtyArray[i];
      if (qtyArray[i] >= 1) {
        var docRef = db.collection("shoppingCart").doc();

        console.log("Docref.id: " + docRef.id);

        const shoppingCartItem = {
          id: docRef.id,
          qty: qtyArray[i],
          price: data[i].price,
          credits: data[i].credits,
          itemName: data[i].itemName,
          type: data[i].type,
          uid: uid,
        };
        console.log(
          "Shopping Item #" + i + ":" + JSON.stringify(shoppingCartItem)
        );
        console.log("inserting this item");
        batch.set(docRef, shoppingCartItem);
      } else {
        console.log("not inserting this item");
      }
    }

    console.log("qtyTotal:" + qtyTotal);
    if (qtyTotal > 0) {
      batch
        .commit()
        .then(console.log("added to shopping cart successfully"))
        .then(
          Alert.alert(
            "Success!",
            "The items you selected have been added to your shopping cart."
          )
        );
    } else {
      Alert.alert(
        "No items to add",
        "You have not selected items to add to your shopping cart."
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.purchaseItems}
          renderItem={({ item, index }) => (
            <View style={styles.itemRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="Qty"
                style={styles.textInput}
                item={item}
                index={index}
                onChangeText={(qty) => this.handleSetRowQty(qty, item, index)}
              />
              <View style={styles.itemTextView}>
                <Text>Item: {item.itemName}</Text>
                <Text>
                  Price: ${item.price} Credits: {item.credits}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() =>
              this.handleAddToShoppingCart(
                this.state.qtyArray,
                this.state.purchaseItems
              )
            }
          >
            <Text style={styles.buttonStyles}>Add to Shopping Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("ShoppingCart")}
          >
            <Text style={styles.buttonStyles}>View Shopping Cart</Text>
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
  list: { padding: 10 },
  itemRow: { padding: 5, flexDirection: "row" },
  itemTextView: { padding: 5 },
  textInput: {
    height: 30,
    width: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "white",
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
