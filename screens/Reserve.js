import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DatePicker from "react-native-datepicker";
//import DateTimePicker from "@react-native-community/datetimepicker";

export default class Reserve extends React.Component {
  state = { date: "06-22-2020" };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.topTextStyles}>
            Please select the date and type of appointment you would like to
            reserve.
          </Text>
        </View>
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
            onChange={(date) => {
              this.setState({ date: date });
            }}
          />
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("ViewApptSlots", {
                  date: this.state.date,
                  type: "lesson",
                })
              }
            >
              <Text style={styles.buttonStyles}>Lessons</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("ViewApptSlots", {
                  date: this.state.date,
                  type: "practice",
                })
              }
            >
              <Text style={styles.buttonStyles}>Practice Lanes</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
  },
  topTextStyles: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 },
  dateAndButtons: {
    padding: 10,
  },
  datePicker: { width: 200, backgroundColor: "white" },
  buttonView: { padding: 10, flexDirection: "row" },
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
