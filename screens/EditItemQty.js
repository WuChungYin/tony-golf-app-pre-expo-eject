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
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Current Quantity:{this.state.itemQty}</Text>
        <TextInput
          placeholder="New Quantity"
          onChangeText={(newQty) => this.setState({ newQty })}
        />
        <Button title="Update Quantiy" onPress={() => this.handleUpdateQty()} />
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
