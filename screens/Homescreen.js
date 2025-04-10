import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section (Header) */}
      <View style={styles.header}>
        <Text style={styles.title}>Quran</Text>
        {/* <Image
          source={require("../assets/quranicon.png")}
          style={styles.quranIcon}
        /> */}
        <Text style={styles.lastRead}>Last Read</Text>
        <Text style={styles.surah}>Al-Faatiha</Text>
        <Text style={styles.verse}>Verse No. 7</Text>
        <Text style={styles.date}>Thu Feb 27 2025 09:31 AM</Text>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Features</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Subscreen");
            }}
          >
            <View style={styles.card}>
              <Ionicons name="book-outline" size={40} color="black" />
              <Text style={styles.cardText}>Read Quran</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Search");
            }}
          >
            <View style={styles.card}>
              <Ionicons name="search-outline" size={40} color="black" />
              <Text style={styles.cardText}>Search</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.card}>
            <Ionicons name="bookmark-outline" size={40} color="black" />
            <Text style={styles.cardText}>Book Mark</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="settings-outline" size={40} color="black" />
            <Text style={styles.cardText}>Settings</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#3b5998" },

  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#3b5998",
  },
  title: { fontSize: 30, fontWeight: "bold", color: "white" },
  quranIcon: { width: 50, height: 50, marginVertical: 10 },
  lastRead: { fontSize: 16, color: "white" },
  surah: { fontSize: 22, fontWeight: "bold", color: "white" },
  verse: { fontSize: 16, color: "white" },
  date: { fontSize: 14, color: "white", marginTop: 5 },

  features: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  featuresTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },

  card: {
    width: 120,
    height: 120,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    elevation: 20, // Shadow effect for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardText: { fontSize: 16, marginTop: 10 },
});
