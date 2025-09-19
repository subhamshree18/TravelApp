import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from "react-native";

function HomeScreen({ route, navigation }) {
  // Use optional chaining and provide a fallback for the user
  const user = route.params?.user || "Guest";
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "68c7129955861561106617vqyf81d0f"; // Geocoding API Key

  useEffect(() => {
    const fetchTrips = async () => {
      if (user === "Guest") {
        setLoading(false);
        return;
      }
      try {
        // The backend expects userId as a query parameter
        const response = await fetch(`http://localhost:5000/api/trips?userId=${user}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const tripsData = await response.json();

        // Requirement 2: Use reverse geocoding to get names from coordinates
        const tripsWithLocationNames = await Promise.all(
          tripsData.map(async (trip) => {
            try {
              const [originRes, destRes] = await Promise.all([
                fetch(`https://geocode.maps.co/reverse?lat=${trip.origin_lat}&lon=${trip.origin_lng}&api_key=${API_KEY}`),
                fetch(`https://geocode.maps.co/reverse?lat=${trip.dest_lat}&lon=${trip.dest_lng}&api_key=${API_KEY}`)
              ]);
              const originData = await originRes.json();
              const destData = await destRes.json();
              return {
                ...trip,
                origin_name: originData.display_name || `${trip.origin_lat}, ${trip.origin_lng}`,
                dest_name: destData.display_name || `${trip.dest_lat}, ${trip.dest_lng}`,
              };
            } catch (e) { return trip; } // Fallback to original data on API error
          })
        );
        setTrips(tripsWithLocationNames);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError("Could not load trips. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user, route.params?.tripAdded]);

  if (!user || user === "Guest") {
    console.warn("HomeScreen loaded without a user. Navigating from Login or Signup should provide a user.");
  }

  return (
    <ImageBackground
      source={{
        uri: "https://preview.redd.it/solo-in-kerala-backwaters-beaches-and-the-art-of-letting-go-v0-yjsmtb4he2ie1.jpg?width=640&crop=smart&auto=webp&s=5a86e4496466ea8cc33fc405c90dc99425d5902d"
        ,
      }}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay} />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome, {user}!</Text>
        <Text style={styles.subtitle}>
          Track your trips and explore destinations.
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="START A NEW TRIP" onPress={() => navigation.navigate("Trip", { user })} />
          <View style={{ marginLeft: 10 }}>
            <Button title="Logout" color="#0909097e" onPress={() => navigation.replace("Login")} />
          </View>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Your Recent Trips</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item) => item.trip_number}
            renderItem={({ item }) => (
              <View style={styles.tripItem}>
                <Text style={styles.tripText}><b>From:</b> {item.origin_name}</Text>
                <Text style={styles.tripText}><b>To:</b> {item.dest_name}</Text>
                <Text style={styles.tripText}><b>Mode:</b> {item.mode}</Text>
                <Text style={styles.tripText}><b>Duration:</b> {(item.duration_sec / 3600).toFixed(0)} days</Text>
                <Text style={styles.tripText}><b>Group Size:</b> {item.group_size}</Text>
                <Text style={styles.tripDate}>
                  On: {new Date(item.start_time).toLocaleDateString()}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>
                  You haven't recorded any trips yet.
                </Text>
                <Text style={styles.emptyListText}>Start a new trip to begin!</Text>
              </View>
            }
          />
        )}
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  headerContainer: {
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#f0f0f0",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 15,
  },
  tripItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  tripText: {
    color: '#fff',
    fontSize: 16,
  },
  tripDate: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  errorText: { color: 'orange', textAlign: 'center', marginTop: 20 },
  emptyListContainer: { alignItems: 'center', marginTop: 30 },
  emptyListText: { color: '#aaa', fontSize: 16, textAlign: 'center' },
});

export default HomeScreen;
