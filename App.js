import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/Homescreen";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}
