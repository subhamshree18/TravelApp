import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError(""); // Clear previous errors
    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter both username and password");
      return;
    }
    // Dummy check (replace with real auth later)
    if (username === "admin" && password === "admin@1234") {
      navigation.replace("Home", { user: username });
    } else {
      setError("Wrong username or password");
    }
  };
 
  return (
    <ImageBackground
      source={{
        uri: "https://www.peakadventuretour.com/assets/imgs/kerala-tourism-04.webp",
      }}
      style={styles.background}
      blurRadius={1}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Journo</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#333"
          value={username}
          onChangeText={(text) => { setUsername(text); setError(""); }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#333"
          value={password}
          onChangeText={(text) => { setPassword(text); setError(""); }}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button title="Login" onPress={handleLogin} />

        <TouchableOpacity
          style={{ marginTop: 15 }}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.link}>New user? Create an account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#ffffffff", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#ffffffff" },
  input: { width: "80%", padding: 12, marginBottom: 15, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", backgroundColor: "rgba(255,255,255,0.8)", color: "#000" },
  link: { color: "#abdaf7c7", fontSize: 14, textDecorationLine: "underline" },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
});

export default LoginScreen;
