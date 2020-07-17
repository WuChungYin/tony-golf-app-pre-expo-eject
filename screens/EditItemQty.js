import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";

import Firebase, { db } from "../config/Firebase.js";

export default class EditItemQty extends React.Component {
  state = { currentUser: null, itemID: null, itemQty: null, newQty: null };

  componentDidMount() {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });

    const { item } = this.props.navigation.state.params;
    this.setState({ itemID: item.id, itemQty: item.qty }, () =>
      console.log(this.state.item)
    );
  }

  handleUpdateQty = () => {
    //check this.state.newQty to make sure it isn't null or 0
    if (
      !isNaN(this.state.newQty) &&
      this.state.newQty != null &&
      this.state.newQty != 0 &&
      this.state.newQty != ""
    ) {
      db.collection("shoppingCart")
        .doc(this.state.itemID)
        .update({ qty: this.state.newQty })
        .then(this.props.navigation.navigate("ShoppingCart"))
        .then(
          Alert.alert(
            "Update successful!",
            "The quantity of this item as been successfully updated."
          )
        );
    } else {
      Alert.alert(
        "Invalid input!",
        "Please input a number for the updated quantity."
      );
    }
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Current Quantity: {this.state.itemQty}</Text>
        <Text>Enter new quantity below: </Text>
        <TextInput
          style={styles.textInput}
          placeholder=""
          onChangeText={(newQty) => this.setState({ newQty })}
        />
        <View style={{ padding: 10 }}>
          <TouchableOpacity onPress={() => this.handleUpdateQty()}>
            <Text style={styles.buttonStyles}>Update Quantity</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgreen",
  },
  textInput: {
    height: 40,
    width: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "white",
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
