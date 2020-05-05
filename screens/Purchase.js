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
      //   priceArray: [],
      //   lessonCreditArray: [],
      //   practiceCreditArray: [],
      //   totalLessonCredits: null,
      //   totalPracticeCredits: null,
      //   totalPrice: null,
      qtyArray: [],
    };
  }

  componentDidMount() {
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
    // this.setState({ priceArray: [...this.state.priceArray, ...newArray] }, () =>
    //   console.log("priceArray: " + this.state.priceArray)
    // );
    // this.setState(
    //   {
    //     lessonCreditArray: [...this.state.lessonCreditArray, ...newArray],
    //   },
    //   () => console.log("lessonCreditArray: " + this.state.lessonCreditArray)
    // );
    // this.setState(
    //   {
    //     practiceCreditArray: [...this.state.practiceCreditArray, ...newArray],
    //   },
    //   () =>
    //     console.log("practiceCreditArray: " + this.state.practiceCreditArray)
    // );
  }

  setRowQty = (qty, item, index) => {
    var intqty = parseInt(qty, 10); //10 means base-10
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

    var batch = db.batch();
    for (var i = 0; i < qtyArray.length; i++) {
      const shoppingCartItem = {
        qty: qtyArray[i],
        price: data[i].price,
        credits: data[i].credits,
        itemName: data[i].itemName,
        age: data[i].age,
        type: data[i].type,
        uid: uid,
      };

      console.log(
        "Shopping Item #" + i + ":" + JSON.stringify(shoppingCartItem)
      );

      if (shoppingCartItem.qty == 0) {
        console.log("not inserting this item");
      } else {
        console.log("inserting this item");

        var docRef = db.collection("shoppingCart").doc();
        batch.set(docRef, shoppingCartItem);
      }
    }
    batch
      .commit()
      .then(() => this.props.navigation.navigate("ShoppingCart"))
      .then(console.log("added to shopping cart successfully"));
  };

  //   calcRowCreditPrice = (qty, item, index) => {
  //     // console.log(
  //     //   " quantity: " +
  //     //     qty +
  //     //     " credits: " +
  //     //     item.credits +
  //     //     " type: " +
  //     //     item.type +
  //     //     " index: " +
  //     //     index
  //     // );
  //     var intqty = parseInt(qty, 10); //10 means base-10
  //     if (item.type == "lesson") {
  //       var lessonCredits = intqty * item.credits;
  //       //console.log("Lesson credits:" + lessonCredits);
  //       const newArray = [...this.state.lessonCreditArray];
  //       newArray[index] = lessonCredits;
  //       this.setState({ lessonCreditArray: newArray }, () =>
  //         console.log("lessonCreditArray: " + this.state.lessonCreditArray)
  //       );
  //     } else if (item.type == "practice") {
  //       var practiceCredits = intqty * item.credits;
  //       //console.log("Practice credits: " + practiceCredits);
  //       const newArray = [...this.state.practiceCreditArray];
  //       newArray[index] = practiceCredits;
  //       this.setState({ practiceCreditArray: newArray }, () =>
  //         console.log("practiceCreditArray: " + this.state.practiceCreditArray)
  //       );
  //     }
  //     var price = intqty * item.price;
  //     //console.log("Price: " + price);
  //     const newArray = [...this.state.priceArray];
  //     newArray[index] = price;
  //     this.setState({ priceArray: newArray }, () =>
  //       console.log("priceArray: " + this.state.priceArray)
  //     );
  //   };

  //   calcTotalCreditPrice = () => {
  //     var numPrice = this.state.priceArray.length;
  //     var i;
  //     var totalPrice = 0;
  //     //console.log("priceArray before totaling: " + this.state.priceArray);
  //     for (i = 0; i < numPrice; i++) {
  //       totalPrice = totalPrice + this.state.priceArray[i];
  //     }
  //     this.setState({ totalPrice: totalPrice }, () =>
  //       console.log("Total Price: " + this.state.totalPrice)
  //     );
  //     //console.log("Total Price: " + totalPrice);

  //     var numLessonCredits = this.state.lessonCreditArray.length;
  //     var i;
  //     var totalLessonCredits = 0;
  //     for (i = 0; i < numLessonCredits; i++) {
  //       totalLessonCredits = totalLessonCredits + this.state.lessonCreditArray[i];
  //     }
  //     this.setState({ totalLessonCredits: totalLessonCredits }, () =>
  //       console.log("Total Lesson Credits: " + this.state.totalLessonCredits)
  //     );

  //     var numPracticeCredits = this.state.practiceCreditArray.length;
  //     var i;
  //     var totalPracticeCredits = 0;
  //     for (i = 0; i < numPracticeCredits; i++) {
  //       totalPracticeCredits =
  //         totalPracticeCredits + this.state.practiceCreditArray[i];
  //     }
  //     this.setState({ totalPracticeCredits: totalPracticeCredits }, () =>
  //       console.log("Total Practice Credits: " + this.state.totalPracticeCredits)
  //     );
  //   };

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 36 }}>
        <FlatList
          data={this.state.purchaseItems}
          renderItem={({ item, index }) => (
            <View>
              <TextInput
                autoCapitalize="none"
                placeholder="Qty"
                item={item}
                index={index}
                onChangeText={(qty) => this.setRowQty(qty, item, index)}
              />
              <Text>
                ${item.price} {item.credits} credits {item.itemName} Index:
                {index}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button
          title="See Shopping Cart"
          onPress={() =>
            this.addToShoppingCart(
              this.state.qtyArray,
              this.state.purchaseItems
            )
          }
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
