import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import TrendingMovies from "../components/TrendingMovie";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGenres,
  fetchPopularMovie,
  fetchTopRatedMovie,
  fetchTrendingMovie,
  fetchUpComingMovie,
} from "../../utils/moviesapi";
import Loading from "../components/Loading";
import TopRatedMovies from "../components/TopRatedMovies";
import PopularMovie from "../components/PopularMovie";
import UpcomingMovie from "../components/UpcomingMovie";
import Modal from 'react-native-modal';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [trending, SetTrending] = useState([]);
  const [topRated, SetTopRated] = useState([]);
  const [popular, SetPopular] = useState([]);
  const [upcoming, SetUpcoming] = useState([]);
  const [genre, SetGenres] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleNotification = () => {
    toggleModal(); 
  };


  const { isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovie,
    onSuccess: (data) => {
      SetTrending(data.results);
    },
    onError: (error) => {
      console.log("Error fetching trending Movies", error);
    },
  });

  const { isLoading: isTopRatedLoading } = useQuery({
    queryKey: ["topratedMovies"],
    queryFn: fetchTopRatedMovie,
    onSuccess: (data) => {
      SetTopRated(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Top Rated Movies", error);
    },
  });

  const { isLoading: isPopularLoading } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: fetchPopularMovie,
    onSuccess: (data) => {
      SetPopular(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Popular Movies", error);
    },
  });

  const { isLoading: isUpcomingLoading } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: fetchUpComingMovie,
    onSuccess: (data) => {
      SetUpcoming(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Popular Movies", error);
    },
  });

  const { isLoading: isGenresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    onSuccess: (data) => {
      SetGenres(data.genres);
    },
    onError: (error) => {
      console.log("Error fetching Genre", error);
    },
  });

  

  return (
    <View className="flex-1 bg-[#333]">
      {/* <Image
        source={require("../../assets/images/Blackbg.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      /> */}
      <ScrollView className="mt-16">
        <StatusBar style="light" />

        

        <View className="flex-row justify-between items-center mx-4 mg-4">
          <View className=" border-black rounded-full overflow-hidden">
            {/* <Image
              source={require("../../assets/images/avatar.png")}
              style={{
                width: 45,
                height: 45,
              }}
              resizeMode="cover"
            /> */}
          </View>

        
          <View className="flex-row space-x-4">
          <TouchableOpacity onPress={handleNotification}>
        <BellIcon size={30} strokeWidth={2} color="white" />
      </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />
            </TouchableOpacity>
          </View>
          
 <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Notification Content</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
   
        </View>

        {isTrendingLoading ? (
          <Loading />
        ) : (
          <ScrollView>
           
            {trending?.length > 0 && <TrendingMovies data={trending} />}

            
            {popular?.length > 0 && (
              <PopularMovie title="Popular" data={popular} />
            )}

            
            {topRated?.length > 0 && (
              <TopRatedMovies genre={genre} title="Suggested Movie" data={topRated} />
            )}

           
            {upcoming?.length > 0 && (
              <UpcomingMovie title="Upcoming" data={upcoming} />
            )}
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
}
