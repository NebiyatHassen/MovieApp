import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Linking } from 'react-native';

import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../../utils/moviesapi";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import Loading from "../components/Loading";
import Cast from "../components/Cast";
import PopularMovie from "../components/PopularMovie";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth} from 'firebase/auth';

var { width, height } = Dimensions.get("window");

export default function MovieScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFavorite, toggleFavourite] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);



  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    setLoading(false);
    if (data) {
      setMovie({ ...movie, ...data });
    }
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data) {
      setCast(data.cast);
    }
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };


  const formatPopularity = (popularity) => {
    const percentage = (popularity / 1000) * 170;
    return `${Math.round(percentage)} %`;
  };
  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}mins`;
    }
  };


  const toggleFavouriteAndSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      const savedMoviesKey = `savedMovies_${user.uid}`;
      const savedMovies = await AsyncStorage.getItem(savedMoviesKey);
      let savedMoviesArray = savedMovies ? JSON.parse(savedMovies) : [];
      
      const isMovieSaved = savedMoviesArray.some(
        (savedMovie) => savedMovie.id === item.id
      );
  
      if (!isMovieSaved) {
        savedMoviesArray.push(movie);
      } else {
        savedMoviesArray = savedMoviesArray.filter(
          (savedMovie) => savedMovie.id !== item.id
        );
      }
  
      await AsyncStorage.setItem(savedMoviesKey, JSON.stringify(savedMoviesArray));
      toggleFavourite(!isMovieSaved);
      console.log("Movie is added/removed to/from the list of saved movies");
    } catch (error) {
      console.log("Error Saving Movie", error);
    }
  };
  
  useEffect(() => {
    const loadSavedMovies = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
  
        const savedMoviesKey = `savedMovies_${user.uid}`;
        const savedMovies = await AsyncStorage.getItem(savedMoviesKey);
        const savedMoviesArray = savedMovies ? JSON.parse(savedMovies) : [];
  
        const isMovieSaved = savedMoviesArray.some(
          (savedMovie) => savedMovie.id === item.id
        );
  
        toggleFavourite(isMovieSaved);
        console.log("Check if the current movie is in the saved list");
      } catch (error) {
        console.log("Error Loading Saved Movies", error);
      }
    };
  
    loadSavedMovies();
  }, [item.id]);
  

  
  const handleInvite = () => {
    const movieTitle = movie?.title || "Movie Title";
    const subject = `Invitation to Watch ${movieTitle}`;
    const body = `Hey! Let's watch ${movieTitle} together. What do you think?\n\n${movie?.overview}`;

    Linking.openURL(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleWatch=()=>{
    console.log(item.id)
      navigation.navigate("VirtualMovieScreen", { movieId: item.id });
 }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      className="flex-1 ng-neutral-900"
    >
     
      <View className="w-full">
     
        <View className="z-20 w-full flex-row justify-between items-center px-4 mt-12 absolute">
          
          <View className="bg-[#092635] p-2 rounded-full items-center justify-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeftIcon size={30} strokeWidth={2} color="white" />
            </TouchableOpacity>
          </View>

         
          <View className="bg-[#092635] p-2 rounded-full items-center justify-center">
            <TouchableOpacity onPress={toggleFavouriteAndSave}>
              <HeartIcon
                size={30}
                strokeWidth={2}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri:
                  image500(movie.poster_path) ||
                  "https://th.bing.com/th/id/R.4dc29c271625202308a26ed96d1d962d?rik=qKnKhs7roVDpXA&pid=ImgRaw&r=0",
              }}
              style={{
                width,
                height: height * 0.55,
              }}
            />
          </View>
        )}
      </View>

     
      <View
        className="space-y-3 flex-1 bg-white relative py-4 mt-[-98] overflow-hidden"
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Image
          source={require("../../assets/images/gray.jpg")}
          style={{
            width,
            height,
          }}
          resizeMode="cover"
          className="absolute top-0 left-0"
        />

        

        <View className="space-y-3 p-4 ">
          <Text className="text-black text-left text-2xl font-bold tracking-widest">
            {movie?.title}
          </Text>

         
          <Text className="flex-row space-x-2">
            {movie?.genres?.map((genre, index) => {
              let showDot = index + 1 != movie.genres.length;

              return (
                <Text
                  key={index}
                  className="text-black font-semibold text-base text-center"
                >
                  {genre?.name} {showDot ? "• " : null}
                </Text>
              );
            })}
          </Text>

          {/* Release Year, Runtime */}
          {movie?.id ? (
            <View className=" bg-[white] p-2 w-3/4 rounded-lg]">
              <Text className="text-black font-semibold text-base text-left">
                {formatPopularity(movie?.popularity)}
                {" * "}
                {formatRuntime(movie?.runtime)} {}{" "}
                {movie?.release_date?.split("-")[0] || "N/A"}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity onPress={handleInvite} style={{ marginTop: 20, alignSelf: 'center' }}>
        <View style={{ backgroundColor: '#092635', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Invite</Text>
        </View>
          
      </TouchableOpacity>
      <TouchableOpacity onPress={handleWatch} style={{ marginTop: 20, alignSelf: 'center' }}>
        <View style={{ backgroundColor: '#092635', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Watch Movie</Text>
        </View>
          
      </TouchableOpacity>

          {/* Description */}
          <Text className="text-black text-sm tracking-widest leading-6">
            {movie?.overview}
          </Text>

        

          {movie?.id && cast.length > 0 && (
            <Cast navigation={navigation} cast={cast} />
          )}

         
          {movie?.id && similarMovies.length > 0 && (
            <PopularMovie title="Similar Movies" data={similarMovies}   />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
