import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AyahScreen({ route }) {
  const { surah } = route.params;
  const [displayedAyahs, setDisplayedAyahs] = useState([]); // Ayahs currently shown
  const [allAyahs, setAllAyahs] = useState([]); // Store all Ayahs in memory
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // Load all Ayahs once at the start
  const getStoredAyahs = async () => {
    try {
      setLoading(true);
      console.log("Fetching Ayahs from AsyncStorage...");
      const storedAyahs = await AsyncStorage.getItem(`ayahs_${surah.number}`);

      if (storedAyahs) {
        const parsedAyahs = JSON.parse(storedAyahs);
        console.log("Total Ayahs Loaded:", parsedAyahs.length);
        setAllAyahs(parsedAyahs); // Store all Ayahs in memory

        // Display first page
        setDisplayedAyahs(parsedAyahs.slice(0, ITEMS_PER_PAGE));
      } else {
        console.warn("No Ayahs found in AsyncStorage for this Surah.");
      }
    } catch (error) {
      console.error("Error getting stored Ayahs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load more Ayahs when user scrolls
  const loadMoreAyahs = useCallback(() => {
    if (isLoadingMore) return; // Stop execution if already loading

    setIsLoadingMore(true);
    const start = page * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, allAyahs.length);

    console.log(
      `Loading more Ayahs... Page: ${page}, Start: ${start}, End: ${end}`
    );

    if (start < allAyahs.length) {
      setDisplayedAyahs((prev) => [...prev, ...allAyahs.slice(start, end)]);
      setPage((prev) => {
        console.log("Updating Page Number to:", prev + 1);
        return prev + 1;
      });
    } else {
      console.warn("No more Ayahs to load.");
    }

    setIsLoadingMore(false);
  }, [page, isLoadingMore, allAyahs]);

  useEffect(() => {
    getStoredAyahs();
  }, []);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#1F4068" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F4068" />
      </View>
    );
  }
  const handleRefreshing = async () => {
    setRefreshing(true);
    await getStoredAyahs();
    setPage(1);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{surah.englishName}</Text>
        <Text style={styles.subHeaderText}>
          {`${displayedAyahs.length} of ${allAyahs.length} Ayahs`}
        </Text>
      </View>

      <FlatList
        data={displayedAyahs}
        renderItem={({ item }) => (
          <View style={styles.ayahContainer}>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>{item.numberInSurah}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.ayahText}>{item.text}</Text>
              <Text style={[styles.translationText, { textAlign: "left" }]}>
                {item.translation}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.numberInSurah.toString()}
        onEndReached={loadMoreAyahs}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefreshing}
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
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#E3E3E3",
    textAlign: "center",
  },
  ayahContainer: {
    backgroundColor: "#FFF",
    marginVertical: 8,
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  ayahNumber: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ayahNumberText: {
    color: "#506380",
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  ayahText: {
    fontSize: 18,
    color: "#506380",
    lineHeight: 28,
    textAlign: "left",
  },
  translationText: {
    fontSize: 18,
    color: "#506380",
    lineHeight: 28,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
});
