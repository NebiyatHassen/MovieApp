import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  Touchable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { image500 } from "../../utils/moviesapi";
import { getAuth} from 'firebase/auth';
const { width, height } = Dimensions.get("window");

export default function SavedScreen() {
  const navigation = useNavigation();

  const [savedMovies, setSavedMovies] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const loadSavedMovies = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
  
          if (user) {
            const savedMoviesKey = `savedMovies_${user.uid}`;
            const savedMovies = await AsyncStorage.getItem(savedMoviesKey);
            const savedMoviesArray = savedMovies ? JSON.parse(savedMovies) : [];
            setSavedMovies(savedMoviesArray);
            console.log("Pull saved movie from AsyncStorage");
          }
        } catch (error) {
          console.log(error);
        }
      };
  
      loadSavedMovies();
    }, [navigation])
  );
  
  const clearSavedMovies = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        const savedMoviesKey = `savedMovies_${user.uid}`;
        await AsyncStorage.removeItem(savedMoviesKey);
        setSavedMovies([]);
        console.log("Clear all saved movies");
      }
    } catch (error) {
      console.log("Error clearing saved movies", error);
    }
  };

  return (
    <ScrollView>
      <View className=" relative flex-1 bg-[#333]" >
       
          <View className="mt-12 p-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-xl text-white ">
                My Movies
              </Text>
              <TouchableOpacity
                onPress={clearSavedMovies}
                className="bg-[#092635] py-2 px-4 rounded-sm"
              >
                <Text className="font-bold text-sm text-white">Clear</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between flex-wrap">
              {savedMovies.map((movie, index) => (
                <View className="flex-row mt-4 " key={index}>
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.push("Movie", movie)}
                  >
                    <Image
                      source={{
                        uri: image500(movie.poster_path),
                      }}
                      className="w-40 h-48 rounded-3xl"
                      style={{
                        width: width * 0.41,
                        height: height * 0.25,
                      }}
                    />
                    <Text className="text-white font-bold text-sm ml-1">
                      {movie.title.length > 15
                        ? movie.title.slice(0, 15) + "..."
                        : movie.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
     
      </View>
    </ScrollView>
  );
}
