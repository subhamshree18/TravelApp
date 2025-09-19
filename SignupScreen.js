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

function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    setError(""); // Clear previous errors
    if (!name.trim() || !email.trim() || !password.trim() || !contact.trim()) {
      setError("Please fill all fields");
      return;
    }

    // Dummy signup logic
    Alert.alert("Success", "Account created successfully");
    navigation.navigate("Home", { user: name });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://www.indianpanorama.in/assets/images/tourpackages/banner/kerala-backwaters.webp",
      }}
      style={styles.background}
      blurRadius={1}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Signup to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#333"
          value={name}
          onChangeText={(text) => { setName(text); setError(""); }}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#333"
          value={email}
          onChangeText={(text) => { setEmail(text); setError(""); }}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#333"
          value={password}
          onChangeText={(text) => { setPassword(text); setError(""); }}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#333"
          value={contact}
          onChangeText={(text) => { setContact(text); setError(""); }}
          keyboardType="phone-pad"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button title="Sign Up" onPress={handleSignup} />

        <TouchableOpacity
          style={{ marginTop: 15 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
    title: { fontSize: 26, fontWeight: "bold", color: "#002640ff", marginBottom: 10, textAlign: "center" },
    subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#000000ff" },
    input: { width: "80%", padding: 12, marginBottom: 15, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", backgroundColor: "rgba(255,255,255,0.8)", color: "#000" },
    link: { color: "#87cefa", fontSize: 14, textDecorationLine: "underline" },
    errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
});

export default SignupScreen;
