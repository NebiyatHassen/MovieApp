import React, { useState,useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity,Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from @expo/vector-icons
import { getAuth, signOut,sendPasswordResetEmail,updateProfile} from 'firebase/auth';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';

import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = ({navigation}) => {
  const [theme, setTheme] = useState('light'); // 
  const [notificationSwitch, setNotificationSwitch] = useState(true);
  const [isModalVisible,setModalVisible]=useState(false);
  const [about,setabout] = useState(false);
  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const [image, setImage] = useState(null);
 
  useEffect(() => {
  
    const loadSavedData = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');

        if (savedImage) {
          setImage(savedImage);
        }

  
      } catch (error) {
        console.error('Error loading saved data:', error.message);
      }
    };

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
  
      
      setImage(selectedAsset.uri);
      await AsyncStorage.setItem('profileImage', selectedAsset.uri);
    }
  };
  

  const handleUpdateProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (image) {
        await updateProfile(user, { photoURL: image });
      }
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('An error occurred while updating the profile. Please try again.');
    }}

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
  };
 
  const handleChangePassword =  () => { 
  
    navigation.navigate('changepwd')


  };
  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#333' }]}>
    
    <Text style ={styles.head}>Setting</Text>

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
      <Text style={styles.header}>User Preferences</Text>

      
      <TouchableOpacity style={styles.settingItem} >
        <Text>Language</Text>
        <Ionicons name="language-outline" size={24} color="#3498db" />
      </TouchableOpacity>
      
      <View style={styles.settingItem}>
        <Text>Dark Theme</Text>
        <Switch value={theme === 'dark'} onValueChange={handleThemeToggle} />
      </View>


      <View style={styles.settingItem}>
        <Text>Enable Notifications</Text>
        <Switch value={notificationSwitch} onValueChange={handleNotificationToggle} />
      </View>
      <Text style={styles.header}>Security</Text>


<TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
  <Text>Change Password</Text>
</TouchableOpacity>
  
      
<Text style={styles.header}>Additional Sections</Text>


      <TouchableOpacity style={styles.settingItem} onPress={handleNotification} >
        <Text>Help</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.settingItem} onPress={handleabout}>
        <Text>About us</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
        <Text style={styles.logoutButtonText}>Logout</Text>
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
        <Text style={{ color: 'blue' }}>Close</Text>
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
              <Text style={{ color: 'blue', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
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
   marginLeft:120,
   padding:14
   
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  paddingBottom: 10,
  
  },
  logoutButton: {
    backgroundColor: '#9A031E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  
});

export default SettingScreen;
