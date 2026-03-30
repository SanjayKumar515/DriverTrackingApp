import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './loginScreen.styles';


const LoginScreen: React.FC = () => {
  

  const navigation =useNavigation()
  const [emailOrMobile, setEmailOrMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back you’ve{'\n'} 
        been missed!</Text>

      {/* Email or Mobile Input */}
      <TextInput
        style={styles.input}
        placeholder="Email or mobile no"
        placeholderTextColor="#999"
        value={emailOrMobile}
        onChangeText={(text: string) => setEmailOrMobile(text)}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(text: string) => setPassword(text)}
      />

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("VerifyOTP" as never)}}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={()=>navigation.navigate("SignUp" as never)}>
      <Text style={styles.createAccountText}>Create new account</Text>
      </TouchableOpacity>
    
     
    </View>
  );
};


export default LoginScreen;
