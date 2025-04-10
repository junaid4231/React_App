import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { TextInput } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Searchscreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 20; // Number of items to show per page

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.alquran.cloud/v1/quran/en.asad"
      );
      const surahs = response.data.data.surahs;
      console.log(surahs.length);
      for (const surah of surahs) {
        await AsyncStorage.setItem(
          `ayahs_${surah.number}`,
          JSON.stringify(surah.ayahs)
        );
        console.log(`ayahs_${surah.number}`);
      }
      setData(surahs);
      // Initially show only first page of items
      setFilteredData(surahs.slice(0, ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = () => {
    if (isLoadingMore || search) return; // Don't load more while searching

    setIsLoadingMore(true);
    const start = page * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newItems = data.slice(start, end);
    console.log("the new items are", newItems.length);

    if (newItems.length > 0) {
      setFilteredData((prevData) => [...prevData, ...newItems]);
      setPage((prevPage) => prevPage + 1);
    }
    setIsLoadingMore(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F4068" />
      </View>
    );
  }

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.englishName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      // When search is cleared, show first page
      setFilteredData(data.slice(0, ITEMS_PER_PAGE));
      setPage(1);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore || search) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#1F4068" />
      </View>
    );
  };

  const renderitem = ({ item }) => {
    return (
      <Pressable onPress={() => navigation.navigate("Ayah", { surah: item })}>
        <View style={styles.item}>
          <View style={styles.contentcontainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{item.number}</Text>
            </View>
            <View style={styles.textcontainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText2}>{item.englishName}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.headerText}
          placeholder="Search"
          placeholderTextColor="#fff"
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderitem}
        keyExtractor={(item) => item.number.toString()}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#1F4068",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F4068",
    marginBottom: 5,
  },
  itemText2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F4068",
  },
  contentcontainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: "#1F4068",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  circleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textcontainer: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
