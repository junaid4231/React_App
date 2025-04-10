import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Subscreen from "./screens/Subscreen";
import AyahScreen from "./screens/AyahScreen";
import Searchscreen from "./screens/Searchscreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1F4068",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Subscreen"
          component={Subscreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Ayah"
          component={AyahScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={Searchscreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
