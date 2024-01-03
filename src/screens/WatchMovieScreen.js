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
import { getAuth} from 'firebase/auth';
import 'firebase/firestore'; 
import { addDoc, collection,getDocs,serverTimestamp,query,orderBy,onSnapshot,where} from 'firebase/firestore';
import { db} from '../../firebase';
import { Ionicons } from '@expo/vector-icons'; 

const VirtualMovieScreen = ({ route }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [videoSource, setVideoSource] = useState('');

  const navigation = useNavigation();

  const ios = Platform.OS === "ios";
  const topMargin = ios ? "" : " mt-3";
  const { movieId } = route.params;
 
const auth = getAuth();
const user = auth.currentUser;
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const userMessage = {
        text: newMessage,
        user: user.email,
        createdAt: serverTimestamp(),
        movieId: movieId,
      };
  
      await addDoc(collection(db, 'comments'), userMessage);

      fetchComments();
      setNewMessage("");
    }
  };
 
  
  const fetchComments = async () => {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'comments'),
          where('movieId', '==', movieId),
          orderBy('createdAt', 'desc')
        )
      );
  
      const comments = snapshot.docs.map((doc) => doc.data());
      setChatMessages(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  useEffect(() => {

    fetchComments();
  
   
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'comments'),
        where('movieId', '==', movieId),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const comments = snapshot.docs.map((doc) => doc.data());
        setChatMessages(comments);
      }
    );
  
    return () => unsubscribe();
  }, [movieId]); 

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${movieapikey}`
        );
        const data = await response.json();
        setMovieDetails(data);
        const videoResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${movieapikey}`
        );
        const videoData = await videoResponse.json();
       
        const videoKey = videoData.results[0]?.key;
  
        setVideoSource(`https://www.youtube.com/watch?v=${videoKey}`);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
  
    fetchMovieDetails();
  }, [movieId]);
  
  

  
  return (
   
    <View
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-white"
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
          
        </SafeAreaView>
      </View>
      {movieDetails && videoSource && (
  <>
    <Video
      source={{
        uri: videoSource,
      }}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="cover"
      shouldPlay={isPlaying}
      useNativeControls
      style={styling.videoPlayer}
    />

    <Text style={styling.movieTitle}>{movieDetails.title}</Text>
    <Text style={styling.movieOverview}>{movieDetails.overview}</Text>
  </>
)}

     
      <View style={styling.chatContainer}>
        <Text style={styling.chatHeader}>Comments</Text>
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
          placeholder="Add comment here..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />

<TouchableOpacity
          onPress={handleSendMessage}
          style={styling.sendButton}
        >
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
   
  );
 
};

const styling = StyleSheet.create({
  videoPlayer: {
    width: "100%",
    height: 280,
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
    color: "black",
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 13,
  },
  movieOverview: {
    color: "black",
    marginLeft: 10,
    fontSize: 13,
  },
  chatContainer: {
    marginTop: 20,
    flex: 1,
  },
  chatHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: "black",
    marginLeft: 10,
    fontWeight:'bold'
  },
  messageContainer: {
    marginBottom: 10,
    fontSize:13
  },
  messageText: {
    fontSize: 16,
    color: "black",
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom:20
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "black",
    color: "black",
    paddingLeft: 5,
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 15
  },
  sendButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
  },
});

export default VirtualMovieScreen;