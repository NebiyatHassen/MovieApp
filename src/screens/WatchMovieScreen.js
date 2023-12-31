import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Video } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../constant/theme";
import { Platform } from "react-native";
import {movieapikey} from "../../utils/apikey"

const VirtualMovieScreen = ({ route }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigation = useNavigation();

  const ios = Platform.OS === "ios";
  const topMargin = ios ? "" : " mt-3";
  const { movieId } = route.params;
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: newMessage, user: "User" },
      ]);
      setNewMessage("");
    }
  };
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${movieapikey}`
        );
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  return (
    <View
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-neutral-900"
    >
      <View>
        <SafeAreaView
          className={
            "absolute z-20 w-full flex-row justify-between items-center px-4 " +
            topMargin
          }
        >
          <TouchableOpacity
            style={styles.background}
            className="rounded-xl p-1"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <View className="flex-1 justify-center">
            <Text className="text-white text-3xl font-bold text-center">
              <Text style={styles.text}>V</Text>irtual Room
            </Text>
          </View>
        </SafeAreaView>
      </View>
      {movieDetails && (
        <>
          <Video
            //source={{ uri: movieDetails.streamingLink }}
            source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay={isPlaying}
            useNativeControls
            style={styling.videoPlayer}
          />
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styling.playPauseButton}
          >
            <Text>{isPlaying ? "Pause" : "Play"}</Text>
          </TouchableOpacity>

          <Text style={styling.movieTitle}>{movieDetails.title}</Text>
          <Text style={styling.movieOverview}>{movieDetails.overview}</Text>
        </>
      )}
      <View style={styling.chatContainer}>
        <Text style={styling.chatHeader}>Live Chat</Text>
        <FlatList
          data={chatMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text
                style={styling.messageText}
              >{`${item.user}: ${item.text}`}</Text>
            </View>
          )}
        />
      </View>

      <View style={styling.inputContainer}>
        <TextInput
          style={styling.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          style={styling.sendButton}
        >
          <Text style={styling.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styling = StyleSheet.create({
  videoPlayer: {
    width: "100%",
    height: 350,
    marginBottom: 10,
  },
  playPauseButton: {
    marginBottom: 10,
    backgroundColor: "#607274",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  movieTitle: {
    color: "white",
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  movieOverview: {
    color: "#FFFFFF",
    marginLeft: 10,
  },
  chatContainer: {
    marginTop: 20,
    flex: 1,
  },
  chatHeader: {
    fontSize: 24,
    marginBottom: 10,
    color: "white",
    marginLeft: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom:15
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    color: "#FFFFFF",
    paddingLeft: 5,
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 15
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#607274",
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
  },
});

export default VirtualMovieScreen;