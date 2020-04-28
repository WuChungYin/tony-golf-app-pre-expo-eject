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
      priceArray: [],
      lessonCreditArray: [],
      practiceCreditArray: [],
      totalLessonCredits: null,
      totalPracticeCredits: null,
      totalPrice: null,
    };
  }

  componentDidMount() {
    //console.log("Purchase Items: " + JSON.stringify(this.state.purchaseItems));
    const numItems = this.state.purchaseItems.length;
    //console.log("numItems: " + numItems);
    var newArray = this.state.priceArray.slice();
    //console.log("initialized newArray: " + JSON.stringify(newArray));
    var i;
    for (i = 0; i < numItems; i++) {
      newArray.push(0);
    }
    //console.log("populated newArray: " + JSON.stringify(newArray));

    this.setState({ priceArray: [...this.state.priceArray, ...newArray] }, () =>
      console.log("priceArray: " + this.state.priceArray)
    );
    this.setState(
      {
        lessonCreditArray: [...this.state.lessonCreditArray, ...newArray],
      },
      () => console.log("lessonCreditArray: " + this.state.lessonCreditArray)
    );
    this.setState(
      {
        practiceCreditArray: [...this.state.practiceCreditArray, ...newArray],
      },
      () =>
        console.log("practiceCreditArray: " + this.state.practiceCreditArray)
    );
  }

  calcRowCreditPrice = (qty, item, index) => {
    // console.log(
    //   " quantity: " +
    //     qty +
    //     " credits: " +
    //     item.credits +
    //     " type: " +
    //     item.type +
    //     " index: " +
    //     index
    // );
    qty = parseInt(qty, 10); //10 means base-10
    if (item.type == "lesson") {
      var lessonCredits = qty * item.credits;
      //console.log("Lesson credits:" + lessonCredits);
      const newArray = [...this.state.lessonCreditArray];
      newArray[index] = lessonCredits;
      this.setState({ lessonCreditArray: newArray });
      //console.log("lessonCreditArray: " + this.state.lessonCreditArray);
    } else if (item.type == "practice") {
      var practiceCredits = qty * item.credits;
      //console.log("Practice credits: " + practiceCredits);
      const newArray = [...this.state.practiceCreditArray];
      newArray[index] = practiceCredits;
      this.setState({ practiceCreditArray: newArray });
      //console.log("practiceCreditArray: " + this.state.practiceCreditArray);
    }
    var price = qty * item.price;
    //console.log("Price: " + price);
    const newArray = [...this.state.priceArray];
    newArray[index] = price;
    this.setState({ priceArray: newArray });
    //console.log("priceArray: " + this.state.priceArray);
  };

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
                onChangeText={(qty) =>
                  this.calcRowCreditPrice(qty, item, index)
                }
              />
              <Text>
                ${item.price} {item.credits} credits {item.itemName} Index:
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
