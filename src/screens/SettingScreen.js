import React, { useState,useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity,Image,Button} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from @expo/vector-icons
import { getAuth, signOut} from 'firebase/auth';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';

import { getFirestore, doc, getDoc, updateDoc,setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = ({navigation}) => {
  const [theme, setTheme] = useState('light'); // 
  const [notificationSwitch, setNotificationSwitch] = useState(true);
  const [isModalVisible,setModalVisible]=useState(false);
  const [about,setabout] = useState(false);
  const[logoutmodalvisible,setLogoutModal] = useState(false);
  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const [image, setImage] = useState(null);
  const loadSavedData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;
      const savedImage = await AsyncStorage.getItem(`profileImage_${userId}`);
  
      if (savedImage) {
        setImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading saved data:', error.message);
    }
  };
   useEffect(() => {
    loadSavedData();
  }, []);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      const imageUrl = selectedAsset.uri;
  
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        console.error('User is not authenticated');
        return;
      }
  
      const userId = auth.currentUser.uid;
      await updateProfilePictureInFirestore(userId, imageUrl);
  
      setImage(imageUrl);
      await AsyncStorage.setItem(`profileImage_${userId}`, imageUrl);
    }
  };
  
  const updateProfilePictureInFirestore = async (userId, imageUrl) => {
    const firestore = getFirestore();
  
    try {
      
      const userRef = doc(firestore, 'users', userId);
  
      const userDoc = await getDoc(userRef);
  
  await setDoc(userRef, { profilePicture: imageUrl });
  console.log('Profile picture updated successfully.');
      
    } catch (error) {
      console.error('Error updating profile picture in Firestore:', error);
    }
  };
  
  
  

  const handleNotificationToggle = () => {
    setNotificationSwitch(!notificationSwitch);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
const modal =() =>{
  setabout(!about);
}
const handleabout =()=>{
  modal();
}
  const handleNotification = () => {
    toggleModal(); 
  };
  const handleLogout = async () => {

    try {
      const auth = getAuth();
      await signOut(auth);
    
       navigation.navigate('Splash');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
    setLogoutModal(false)
  };
 
  const handleChangePassword =  () => { 
  
    navigation.navigate('changepwd')


  };
  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#333' }]}>
    
    <Text style ={styles.head}>SETTING</Text>

    <View style={styles.containerr}>
    <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
  {image ? (
    <Image source={{ uri: image }} style={styles.profileImage} />
  ) : (
    <Image source={require('../../assets/images/avatar.png')} style={styles.profileImage} />
  )}
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="pencil-outline" size={15} color="#3498db" />
    <Text style={{ marginLeft: 8 }}>Edit</Text>
  </View>
</TouchableOpacity>
    </View>
      <Text style={styles.header}>PREFERENCES</Text>

      
      <TouchableOpacity style={styles.settingItem} >
      <Ionicons name="language-outline" size={24} color="#fff" style={{ borderRadius: 20,
    backgroundColor: "#2D3250",
    padding: 3, }} />
        <Text style={{ marginRight:180 }}>Language</Text>
        <Text>English</Text>
     
      </TouchableOpacity>
      
      <View style={styles.settingItem}>
      <Ionicons name="moon-outline" size={24} color="#fff" style={{ borderRadius: 20,
    backgroundColor: "#2D3250",
    padding: 3, }}/>
        <Text style={{ marginRight:180}}>Dark Theme</Text>
      
        <Switch value={theme === 'dark'} onValueChange={handleThemeToggle} />
      </View>


      <View style={styles.settingItem}>
      <Ionicons name="notifications-outline" size={24} color="#fff" style={{ borderRadius: 20,
    backgroundColor:"#2D3250",
    padding: 3, }}/>
        <Text style={{ marginRight:130}}>Enable Notifications</Text>

        <Switch value={notificationSwitch} onValueChange={handleNotificationToggle} />
      </View>
      <Text style={styles.header}>SECURITY</Text>


<TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
<Ionicons name="lock-closed-outline" size={24} color="#fff" style={{ borderRadius: 20,
    backgroundColor: "#2D3250",
    padding: 3, }}/>
  <Text style={{ marginRight:200 }}>Change Password</Text>
</TouchableOpacity>
  
      
<Text style={styles.header}>ADDITIONAL SECTIONS</Text>


      <TouchableOpacity style={styles.settingItem} onPress={handleNotification} >
      <Ionicons name="help-circle-outline" size={24} color="#fff" style={{ borderRadius: 20,
    backgroundColor: "#2D3250",
    padding: 3, }} />
        <Text style={{ marginRight:280}}>Help</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.settingItem} onPress={handleabout}>
      <Ionicons name="information-circle-outline" size={24} color="#fff" style={{ borderRadius: 20,
    backgroundColor: "#2D3250",
    padding: 3, }}/>
        <Text  style={{ marginRight:255}} >About us</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutModal(true)} >
      <Ionicons name="log-out-outline" size={24} color="#fff" style={{ borderRadius: 20,
    backgroundColor: "#2D3250",
    padding: 3,
   }}/>
        <Text style={styles.logoutButtonText} >Logout</Text>
      </TouchableOpacity>


      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Help Center</Text>

      <Text style={{ marginBottom: 10 }}>
        Welcome to our Help Center! Here, you'll find answers to common questions and helpful resources to make the most of your experience with our app.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Frequently Asked Questions (FAQs)</Text>
      <Text>
        Q: How do I create an account?
        {'\n'}A: To create an account, tap the "Sign Up" button on the login screen. Enter your email, create a password, and provide your mobile number. Follow the on-screen instructions to complete the registration.
        {'\n\n'}
        Q: I forgot my password. What should I do?
        {'\n'}A: If you forgot your password, tap on the "Forgot Password" link on the login screen. Follow the instructions sent to your registered email to reset your password.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 20 }}>Contact Information</Text>
      <Text>
        For assistance, contact our customer support team at support@movie.com. Our team is available Monday to Friday, 9 AM to 5 PM (GMT).
      </Text>

      
      <TouchableOpacity onPress={toggleModal} style={{ marginTop: 20 }}>
        <Text style={{ color: '#092635' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
<Modal isVisible={about} onBackdropPress={modal}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>About us</Text>
<Text style ={{fontSize:15,marginBottom:10,marginTop:10}}>At Cinema Go, we're passionate about delivering a seamless movie experience. 

cinema Go is designed to make your movie-going journey enjoyable. Welcome to Cinema Go, where we celebrate the world of movies together!"
</Text>
            <TouchableOpacity onPress={modal}>
              <Text style={{ color: '#092635', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutmodalvisible}
        onRequestClose={() => setLogoutModal(false)}
      >
       
          <View style={styles.modalContent}  >
            <Text>Are you sure you want to logout?</Text>
           
            <Button title="Yes"  onPress={handleLogout} />
            <Button title="No" onPress={() => setLogoutModal(false)} />
          </View>
     
      </Modal>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
   borderColor:'black',
    marginBottom: 20,
  },
  head: {
    fontSize: 30,
    fontWeight: 'bold',
   marginLeft:100,
   padding:14
   
  },
  settingItem: {
    fontWeight:'bold',
    shadowColor: '#d3d3d3 ',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  paddingBottom: 10,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.5,
  shadowRadius: 3.84,
  elevation: 5,
  
  },
  logoutButton: {
    fontWeight:'bold',
    shadowColor: '#d3d3d3 ',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  paddingBottom: 10,
  shadowOpacity: 0.5,
  shadowRadius: 3.84,
  elevation: 5,
  },
  logoutButtonText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight:260
  },
  containerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width:70,
    height: 70,
    borderRadius: 75,
    marginBottom: 10,
  },

  modalContent: {
    backgroundColor:'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
 
});

export default SettingScreen;
