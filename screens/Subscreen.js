import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function Subscreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jumpToSurah, setJumpToSurah] = useState("");
  const [showJumpInput, setShowJumpInput] = useState(false);
  const flatListRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://api.alquran.cloud/v1/surah");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle jump to Surah
  const handleJumpToSurah = useCallback(() => {
    const surahNumber = parseInt(jumpToSurah);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      Alert.alert("Invalid Surah", "Please enter a number between 1 and 114");
      return;
    }

    // Find the exact index of the Surah
    const surahIndex = data.findIndex((surah) => surah.number === surahNumber);

    if (surahIndex !== -1) {
      // First scroll to beginning to reset any offsets
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });

      // Short delay then scroll to the exact index
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: surahIndex,
          animated: true,
          viewPosition: 0, // Position at the top
          viewOffset: 0, // Additional offset
        });
      }, 50);

      // Add visual confirmation
      setTimeout(() => {
        // Flash effect could be implemented here
      }, 300);
    }

    // Clear input and hide
    setJumpToSurah("");
    setShowJumpInput(false);
    Keyboard.dismiss();
  }, [jumpToSurah, data]);

  // Handle scroll to index failures
  const handleScrollToIndexFailed = useCallback((info) => {
    const { index, highestMeasuredFrameIndex, averageItemLength } = info;

    // If we have measured frames, use them for calculation
    if (highestMeasuredFrameIndex >= 0) {
      // Calculate a better offset based on measured items
      const estimatedOffset = averageItemLength * index;

      flatListRef.current?.scrollToOffset({
        offset: estimatedOffset,
        animated: false,
      });
    } else {
      // If no measurements, use a different approach
      // Use a fixed offset calculation
      const offset = 88 * index; // Using our fixed height estimate
      flatListRef.current?.scrollToOffset({
        offset: offset,
        animated: false,
      });
    }

    // Then attempt direct index scrolling after layout is complete
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: Math.max(0, index),
        animated: true,
        viewPosition: 0,
      });
    }, 100);
  }, []);

  // Calculate estimated item height for better scrolling
  const getItemLayout = useCallback((data, index) => {
    // More precise item height calculation
    const height = 88; // Fixed height based on padding + content + margins
    return {
      length: height,
      offset: height * index,
      index,
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F4068" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Ayah", { surah: item })}
      >
        <View style={styles.surahContainer}>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>{item.number}</Text>
          </View>
          <View style={styles.surahDetails}>
            <Text style={styles.surahName}>{item.name}</Text>
            <Text style={styles.surahInfo}>
              {item.englishName} • {item.numberOfAyahs} Ayahs
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#1F4068" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Surahs</Text>
        <TouchableOpacity
          style={styles.jumpButton}
          onPress={() => setShowJumpInput(!showJumpInput)}
        >
          <Ionicons name="navigate" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showJumpInput && (
        <View style={styles.jumpContainer}>
          <TextInput
            style={styles.jumpInput}
            placeholder="Enter Surah (1-114)"
            keyboardType="number-pad"
            value={jumpToSurah}
            onChangeText={setJumpToSurah}
            returnKeyType="go"
            onSubmitEditing={handleJumpToSurah}
            autoFocus={true}
          />
          <TouchableOpacity style={styles.goButton} onPress={handleJumpToSurah}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.number.toString()}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        windowSize={30}
        removeClippedSubviews={false}
        updateCellsBatchingPeriod={50}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#1F4068",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  surahContainer: {
    backgroundColor: "#FFF",
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 76,
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E7F5FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F4068",
  },
  surahDetails: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F4068",
    marginBottom: 4,
  },
  surahInfo: {
    fontSize: 14,
    color: "#506380",
  },
  arrowContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  jumpButton: {
    position: "absolute",
    right: 15,
    padding: 5,
  },
  jumpContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  jumpInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  goButton: {
    backgroundColor: "#1F4068",
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  goButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
