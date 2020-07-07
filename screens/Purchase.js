import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  Alert,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class Purchase extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      // purchaseItems: [
      //   // {
      //   //   id: 1,
      //   //   price: 50,
      //   //   credits: 10,
      //   //   itemName: "Package - Adult Lessons",
      //   //   age: "Adult",
      //   //   type: "lesson",
      //   // },
      //   // {
      //   //   id: 2,
      //   //   price: 50,
      //   //   credits: 10,
      //   //   itemName: "Package - Junior Lessons",
      //   //   age: "Junior",
      //   //   type: "lesson",
      //   // },
      //   {
      //     id: 1,
      //     price: 50,
      //     credits: 10,
      //     itemName: "Package - Lessons",
      //     type: "lesson",
      //   },
      //   {
      //     id: 3,
      //     price: 150,
      //     credits: 30,
      //     itemName: "Package - Practice Lane",
      //     //age: null,
      //     type: "practice",
      //   },
      //   // {
      //   //   id: 4,
      //   //   price: 5,
      //   //   credits: 1,
      //   //   itemName: "Single - Adult Lesson",
      //   //   age: "Adult",
      //   //   type: "lesson",
      //   // },
      //   // {
      //   //   id: 5,
      //   //   price: 5,
      //   //   credits: 1,
      //   //   itemName: "Single - Junior Lesson",
      //   //   age: "Junior",
      //   //   type: "lesson",
      //   // },
      //   {
      //     id: 4,
      //     price: 5,
      //     credits: 1,
      //     itemName: "Single - Lesson",
      //     type: "lesson",
      //   },
      //   {
      //     id: 6,
      //     price: 5,
      //     credits: 1,
      //     itemName: "Single - Practice Lane",
      //     //age: null,
      //     type: "practice",
      //   },
      // ],
      purchaseItems: [],
      qtyArray: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = db
      .collection("purchaseItems")
      .onSnapshot(this.onCollectionUpdate);
  }

  collectionWillUnMount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const purchaseItems = [];
    querySnapshot.forEach((doc) => {
      const { id, price, credits, itemName, type } = doc.data();
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

    //console.log("Purchase Items: " + JSON.stringify(this.state.purchaseItems));
    const numItems = this.state.purchaseItems.length;
    //console.log("numItems: " + numItems);
    var newArray = this.state.qtyArray.slice();
    //console.log("initialized newArray: " + JSON.stringify(newArray));
    var i;
    for (i = 0; i < numItems; i++) {
      newArray.push(0);
    }
    //console.log("populated newArray: " + JSON.stringify(newArray));
    this.setState({ qtyArray: [...this.state.qtyArray, ...newArray] }, () =>
      console.log("qtyArray: " + this.state.qtyArray)
    );
  };

  setRowQty = (qty, item, index) => {
    var intqty = parseInt(qty, 10); //10 means base-10
    if (!intqty) {
      //checking if intqty is null or NaN, and if so, set it to 0
      intqty = 0;
    }
    const newArray = [...this.state.qtyArray];
    newArray[index] = intqty;
    this.setState({ qtyArray: newArray }, () =>
      console.log("qtyArray: " + this.state.qtyArray)
    );
  };

  addToShoppingCart = (qtyArray, data) => {
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
          //age: data[i].age,
          type: data[i].type,
          uid: uid,
        };
        console.log(
          "Shopping Item #" + i + ":" + JSON.stringify(shoppingCartItem)
        );
        console.log("inserting this item");
        //var docRef = db.collection("shoppingCart").doc();
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
          data={this.state.purchaseItems}
          renderItem={({ item, index }) => (
            <View style={styles.inputRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="Qty"
                style={styles.textInput}
                item={item}
                index={index}
                onChangeText={(qty) => this.setRowQty(qty, item, index)}
              />
              <View>
                <Text>Item: {item.itemName}</Text>
                <Text>
                  Price: ${item.price} Credits: {item.credits}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button
          title="Add to Shopping Cart"
          onPress={() =>
            this.addToShoppingCart(
              this.state.qtyArray,
              this.state.purchaseItems
            )
          }
        />
        <Button
          title="View Shopping Cart"
          onPress={() => this.props.navigation.navigate("ShoppingCart")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
  },
  inputRow: { flexDirection: "row" },
  textInput: {
    height: 40,
    width: "10%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "white",
  },
});
