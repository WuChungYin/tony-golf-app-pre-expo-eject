import React from "react";
import { StyleSheet, Platform, Image, Text, View, Button } from "react-native";
import DatePicker from "react-native-datepicker";

import Firebase, { db } from "../config/Firebase.js";

export default class Reserve extends React.Component {
  state = { date: "06-22-2020" };

  componentDidMount() {}

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          Please select the date and type of appointment you would like to
          reserve.
        </Text>
        <View style={styles.dateAndButtons}>
          <DatePicker
            style={styles.datePicker}
            date={this.state.date} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder=""
            format="MM-DD-YYYY"
            minDate="01-01-1900"
            maxDate="01-01-2050"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={(date) => {
              this.setState({ date: date });
            }}
          />
          <View style={styles.buttons}>
            <Button
              title="Lessons"
              onPress={() =>
                this.props.navigation.navigate("ViewApptSlots", {
                  date: this.state.date,
                  type: "lesson",
                })
              }
            />
            <Button
              title="Practice Lanes"
              onPress={() =>
                this.props.navigation.navigate("ViewApptSlots", {
                  date: this.state.date,
                  type: "practice",
                })
              }
            />
          </View>
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
  dateAndButtons: { justifyContent: "center", alignItems: "center" },
  datePicker: { width: 200, backgroundColor: "white" },
  buttons: { flexDirection: "row" },
});
