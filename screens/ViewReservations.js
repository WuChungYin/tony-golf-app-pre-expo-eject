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

export default class ViewReservations extends React.Component {
  state = { currentUser: null, apptSlotsData: [] };

  componentDidMount() {
    const { currentUser } = Firebase.auth();
    this.setState({ currentUser });

    this.unsubscribe = db
      .collection("appointments")
      .where("uid", "==", currentUser.uid)
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
        <Text>This is View Reservations Screen</Text>
        <FlatList
          data={this.state.apptSlotsData}
          renderItem={({ item, index }) => (
            <View>
              <Text>
                {item.date} {item.time} {item.name}
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
