import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import CitySelector from './CitySelector'

import DateTimePicker from '@react-native-community/datetimepicker';
// 🔹 Trip Screen (prefills origin/time from route params)
function TripScreen({ route, navigation }) {
  // values from Home (already coming in route params)
  
  const { user} = route.params || {};
  const [success, setSuccess] = useState("");
  const [selectedPickUpCity, setSelectedPickUpCity] = useState(null);
  const [selectedDestinationCity, setSelectedDestinatonCity] = useState(null);
  const startTime = new Date().toISOString();
  // 🔹 Trip fields
  const [userId, setUserId] = useState(user || "");

  // 🔹 Trip info
  const [mode, setMode] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [startTimeState, setStartTimeState] = useState(new Date().toISOString());
  const [endTime, setEndTime] = useState(new Date().toISOString());
  const [groupSize, setGroupSize] = useState("1");
  const [error, setError] = useState("");

  //const API_KEY = "68c7129955861561106617vqyf81d0f";

  const handleSubmit = async () => {
    setError(""); // Clear previous errors before submission

    // 1. Corrected validation logic
    if (
      !selectedPickUpCity?.name ||
      !selectedDestinationCity?.name ||
      !startTimeState ||
      !endTime ||
      !groupSize ||
      !mode
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const tripData = {
      userId: user, // from login
      origin_name: `${selectedPickUpCity.coords.lat}, ${selectedPickUpCity.coords.lon}`,
      dest_name: `${selectedDestinationCity.coords.lat}, ${selectedDestinationCity.coords.lon}`,
      mode: mode,
      start_time: startTimeState,
      end_time: endTime,
      group_size: parseInt(groupSize, 10) || 1, // 2. Parse groupSize to an integer
    };

    try {
      const response = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Trip saved successfully!");
        setTimeout(() => {
        navigation.navigate("Home", { user, tripAdded: true });},2000);
      } else {
        setError(`Failed to save trip: ${data.error || 'Internal server error'}`);
      }
    } catch (err) {
      console.error("Save Trip Error:", err);
      setError("Network error: Could not save trip. Please try again later.");
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    if(selectedDate){
      // const currentDate = selectedDate || startDate;
    // setShowStartDatePicker(Platform.OS === 'web');
    // setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(selectedDate);
    setStartTimeState(selectedDate.toISOString());
    }
    setShowStartDatePicker(false);//close picker
  };

  const onEndDateChange = (event, selectedDate) => {
    if(selectedDate){
        // const currentDate = selectedDate || endDate;
    // setShowEndDatePicker(Platform.OS === 'web');
    // setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(selectedDate);
    setEndTime(selectedDate.toISOString());
    }
    setShowEndDatePicker(false);
  };

  const showDatepicker = (picker) => {
    picker === 'start' ? setShowStartDatePicker(true) : setShowEndDatePicker(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>Trip Details</Text>
  <CitySelector onCitySelect={setSelectedPickUpCity} defaultCity="Kerala" />

      {selectedPickUpCity && (
        <View style={styles.selectedCityContainer}>
          <Text style={styles.selectedCityText}><Text style={styles.selectedCityLabel}>Selected City:</Text> {selectedPickUpCity.name}</Text>
          <Text style={styles.selectedCityText}><Text style={styles.selectedCityLabel}>Latitude:</Text> {selectedPickUpCity.coords.lat}</Text>
          <Text style={styles.selectedCityText}><Text style={styles.selectedCityLabel}>Longitude:</Text> {selectedPickUpCity.coords.lon}</Text>
        </View>
      )}
      <CitySelector onCitySelect={setSelectedDestinatonCity} defaultCity="Kerala" />

      {selectedDestinationCity && (
        <View style={styles.selectedCityContainer}>
          <Text style={styles.selectedCityText}><Text style={styles.selectedCityLabel}>Selected City:</Text> {selectedDestinationCity.name}</Text>
          <Text style={styles.selectedCityText}><Text style={styles.selectedCityLabel}>Latitude:</Text> {selectedDestinationCity.coords.lat}</Text>
          <Text style={styles.selectedCityText}><Text style={styles.selectedCityLabel}>Longitude:</Text> {selectedDestinationCity.coords.lon}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Mode of Travel"
        value={mode}
        onChangeText={setMode}
      />
      {Platform.OS === 'web' ? (
        <>
          <input
            style={styles.webInput}
            type="date"
            value={startTimeState.split("T")[0]}
            onChange={(e) => setStartTimeState(`${e.target.value}T00:00:00.000Z`)}
          />
          <input
            style={styles.webInput}
            type="date"
            value={endTime.split("T")[0]}
            onChange={(e) => setEndTime(`${e.target.value}T00:00:00.000Z`)}
          />
        </>
      ) : (
        <>
          {/*start date picker button */}

          <TouchableOpacity
           onPress={() => showDatepicker('start')} 
           style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {/* Start Date: {startDate.toLocaleDateString()} */}
              {startDate ? startDate.toLocaleDateString() : "Select Start Date"}
              </Text>
          </TouchableOpacity>

            {/*only shows when state is true */}

          {showStartDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode="date"
              is24Hour={true}
              display="calendar"
              onChange={onStartDateChange}
            />
          )}

          {/*end date picker button */}

          <TouchableOpacity
           onPress={() => showDatepicker('end')}
            style={styles.input}>
            <Text style={styles.datePickerText}>
              {endDate ? endDate.toLocaleDateString() : "Select End Date"}
              {/* End Date: {endDate.toLocaleDateString()} */}
              </Text>
          </TouchableOpacity>

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="calendar"
              minimumDate={startDate+1} // Prevent selecting an end date before the start date 
              onChange={onEndDateChange}
            />
          )}
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Group Size"
        value={String(groupSize)}
        onChangeText={setGroupSize}
        keyboardType="numeric"
      />

      

      <View style={styles.buttonContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.tripsave}>{success}</Text> : null}
        <Button title="Save Trip" onPress={handleSubmit} />
        <Button title="Back to Home" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#000",
  },
  webInput: {
    width: "79%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#000",
    fontFamily: 'sans-serif', // To match React Native's default font on web
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#006400",
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    width: '80%',
  },
  selectedCityContainer: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(230, 240, 255, 0.9)',
    borderRadius: 8,
  },
  selectedCityText: {
    color: '#333',
    fontSize: 14,
  },
  selectedCityLabel: {
    fontWeight: 'bold',
    color: '#006400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  datePickerButton: {
    width: '80%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
  },
  datePickerText: {
    color: '#000',
    fontSize: 16,
  },
  tripsave:{
    color: 'green',
    marginBottom: 15,
    textAlign: 'center',
    width: '80%',
  },
});

export default TripScreen;
