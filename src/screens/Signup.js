import { View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constant/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../components/Button';
import { Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db} from '../../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[mobile,setmobile]=useState('')
    
    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

       
        const phoneRegex = /^\+?\d{9,}$/;
      
        if (!email.trim() || !password.trim() || !mobile.trim() || !isChecked) {
            Alert.alert('Validation Error', 'Please enter all values and agree to the terms and conditions.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
            return;
          } 
          if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return;
          }  if (!phoneRegex.test(mobile)) {
            Alert.alert('Validation Error', 'Please enter a valid phone number (at least 10 digits).');
            return;
          }
          
             try {
                const auth = getAuth();
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
               
                const user = userCredential.user;
          
                
                await addDoc(collection(db, 'users'), {
                  uid: user.uid,
                  email: email,
                  mobile: mobile,
                  createdAt: serverTimestamp()
                
                 });
          
                setEmail('');
                setPassword('');
                setmobile('');
                setIsChecked('');
                navigation.navigate('Login');
              } catch (error) {
            {
                    if (error.code === 'auth/email-already-in-use') {
                      Alert.alert('Error', 'The email address is already in use. Please use a different email.');
                    } else {
                      console.error('Error signing up:', error.message);
                    }
                  }
                
              }
      };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        marginVertical: 14,
                        marginLeft:65,
                        color: COLORS.black
                    }}>
                        Create an Account
                    </Text>

                   
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 5
                    }}>Email address</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your email address'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
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
                        marginVertical: 8
                    }}>Mobile Number</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='+251'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "12%",
                                borderRightWidth: 1,
                                borderLeftColor: COLORS.grey,
                                height: "100%"

                            }}
                            
                        />

                        <TextInput
                            placeholder='Enter your phone number'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "80%"
                            }}
                            value={mobile}
              onChangeText={(text) => setmobile(text)}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your password'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                            value={password}
              onChangeText={(text) => setPassword(text)}
                           
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />

                    <Text>I aggree to the terms and conditions</Text>
                </View>

                <Button
                    title="Sign Up"
                    filled
                    onPress={handleSubmit} 
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                />

              

                
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Signup