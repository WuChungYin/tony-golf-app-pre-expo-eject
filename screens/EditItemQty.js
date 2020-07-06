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
        <View style={styles.textContainer}>
          <Text>New Quantity: </Text>
          <TextInput
            style={styles.textInput}
            placeholder=""
            onChangeText={(newQty) => this.setState({ newQty })}
          />
        </View>

        <Button title="Update Quantiy" onPress={() => this.handleUpdateQty()} />
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
  },
  textContainer: { flexDirection: "row" },
  textInput: {
    height: 40,
    width: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
  },
});
