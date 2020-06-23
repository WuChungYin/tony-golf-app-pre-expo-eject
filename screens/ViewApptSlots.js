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

export default class ViewApptSlots extends React.Component {
  state = { apptSlotsData: [], date: "", type: "" };

  componentDidMount() {
    const { date } = this.props.navigation.state.params;
    this.setState({ date });
    const { type } = this.props.navigation.state.params;
    this.setState({ type });

    this.unsubscribe = db
      .collection("appointments")
      .where("date", "==", date)
      .where("type", "==", type)
      .where("uid", "==", "null")
      .onSnapshot(this.onCollectionUpdate);
  }

  collectionWillUnMount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const apptSlotsData = [];
    querySnapshot.forEach((doc) => {
      const { id, date, time, type, name, credits } = doc.data();
      apptSlotsData.push({
        id,
        date,
        time,
        type,
        name,
        credits,
      });
    });
    this.setState({ apptSlotsData: apptSlotsData });
    console.log("appSlotsData = " + JSON.stringify(this.state.apptSlotsData));
  };

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>This is ViewApptSlots Screen</Text>
        <Text>
          Date:{this.state.date} Type:{this.state.type}
        </Text>
        <FlatList
          data={this.state.apptSlotsData}
          renderItem={({ item, index }) => (
            <View>
              <Text>
                {item.date} {item.time} {item.name} Credits:
                {item.credits}
              </Text>
              <Button title="Select Appointment Slot" item={item} />
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
