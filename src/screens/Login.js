
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constant/colors';
import Button from '../components/Button';
import { getAuth,signInWithEmailAndPassword,sendPasswordResetEmail  } from 'firebase/auth';

const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    else if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    } 
    else if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
   
    try {
      const authInstance = getAuth();
      await signInWithEmailAndPassword(authInstance, email, password);

     
      setEmail('');
      setPassword('');

   
      navigation.navigate("Welcome"); 
    } catch (error) {
   
     const errorCode = error.code;
     const errorMessage = error.message;
 
     if (errorCode === 'auth/wrong-password') {
       alert('Invalid password');
     } else if (errorCode === 'auth/invalid-email') {
       alert('Invalid email address');
     } else {
       alert(errorMessage);
     }
 
     console.error(error);
    }
  };
  const handleresetpassword = async () => { 
    try { 
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email); 
      alert('Password reset email sent. Check your inbox.'); 
    } catch (error) { 
      console.log(error); 
      alert('Error sending password reset email.'); 
    } 
  };

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <Text style={{
          fontSize: 46,
          fontWeight: '800',
          color: COLORS.black,
          marginLeft: 100,
          marginTop: 67,
        }}>LOGIN</Text>

        <View style={{ marginBottom: 12, marginTop: 8 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8,
          }}>Email address</Text>

          <View style={{
            width: '100%',
            height: 48,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 22,
          }}>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{
                width: '100%',
              }}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8,
          }}>Password</Text>

          <View style={{
            width: '100%',
            height: 48,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 22,
          }}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={isPasswordShown}
              style={{
                width: '100%',
              }}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: 'absolute',
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Button
  title="Login"
  filled
  onPress={() => {
    handleLogin(); 
    
  }}
  style={{
    marginTop: 18,
    marginBottom: 4,
  }}
/>
<TouchableOpacity style={{ padding: 10 }} onPress={handleresetpassword}>
        <Text style={{fontWeight:'bold', color: COLORS.primary}}>Forgot Password ?</Text>
      </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
          
          <Text style={{ fontSize: 14 }}>Or Login with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
        </View>


        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        
        
       
          <TouchableOpacity
            onPress={() => console.log("Pressed")}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require('../../assets/images/facebook.png')}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode='contain'
            />
            <Text>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Pressed")}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require('../../assets/images/google.png')}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode='contain'
            />
            <Text>Google</Text>
          </TouchableOpacity>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 22,
        }}>
          <Text style={{ fontSize: 16, color: COLORS.black }}>Don't have an account ? </Text>
          <TouchableOpacity
  onPress={() => navigation.navigate('Signup')}
>
  <Text style={{
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  }}>Register</Text>
</TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
