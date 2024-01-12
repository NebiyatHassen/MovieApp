import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "../screens/WelcomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SavedScreen from "../screens/SavedScreen";
import HomeScreen from "../screens/HomeScreen";
import Settingscreen from "../screens/SettingScreen";
import PersonScreen from "../screens/PersonScreen";
import { Ionicons } from "@expo/vector-icons";
import MovieScreen from "../screens/MovieScreen";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Signup from "../screens/Signup";

import changepwd from "../screens/changepwd"
import WatchMovieScreen from "../screens/WatchMovieScreen";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  function HomeStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="HomeTab" component={HomeTabs} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Movie" component={MovieScreen} />
        <Stack.Screen name="Person" component={PersonScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Splash" component={Welcome}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="VirtualMovieScreen" component={WatchMovieScreen} />

        <Stack.Screen name="changepwd" component={changepwd} />
      </Stack.Navigator>
    );
  }

  function HomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Search") {
              iconName = "search";
            } else if (route.name === "Favorite") {
              iconName = "star";
            } else if(route.name==="Setting"){
              iconName ="settings"
            }

            const customizeSize = 25;

            return (
              <Ionicons
                name={iconName}
                size={customizeSize}
                color={focused ? "white" : "white"}
              />
            );
          },
          tabBarActiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "#333",
            borderTopWidth: 0,
            paddingBottom: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Favorite" component={SavedScreen} />
        <Tab.Screen name="Setting" component={Settingscreen}/>
        

      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
