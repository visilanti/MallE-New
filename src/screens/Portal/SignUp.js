import React, { useState } from 'react';
import axios from 'axios';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fonts } from '../../assets/fonts';
import { FIREBASE_AUTH } from '../../../FirebaseConfig'; // Import Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import function to create users

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk confirm password visibility

  const onSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Membuat akun dengan Firebase
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;

      Alert.alert('Success', `Account created for: ${user.email}`);

      // Mendapatkan token (misalnya Firebase token, sesuaikan dengan aplikasi Anda)
      const token = await user.getIdToken();

      // Mengirimkan data ke API
      try {
        const response = await axios.post(
          'https://backend-malle.vercel.app/api/users/',
          { email: user.email },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token dikirimkan di header
            },
          }
        );
        console.log('API Response:', response.data);
      } catch (apiError) {
        console.error('API Error:', apiError.response?.data || apiError.message);
        Alert.alert('API Error', apiError.response?.data?.message || 'Failed to save user data');
      }

      // Navigasi ke halaman login
      navigation.navigate('SignIn');
    } catch (error) {
      const errorMessage = error.message;
      Alert.alert('Registration Error', errorMessage);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />

      <Text style={styles.welcomeText}>
        Create an
        {'\n'}
        Account
      </Text>

      {/* Username or Email Input */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#626262" solid />
        <TextInput
          style={[styles.input, { color: '#626262' }]}
          placeholder="Email"
          placeholderTextColor="#676767"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#626262" solid />
        <TextInput
          style={[styles.input, { color: '#626262' }]}
          placeholder="Password"
          placeholderTextColor="#676767"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Ubah berdasarkan state
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#626262" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#626262" solid />
        <TextInput
          style={[styles.input, { color: '#626262' }]}
          placeholder="Confirm Password"
          placeholderTextColor="#676767"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword} // Ubah berdasarkan state
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#626262" />
        </TouchableOpacity>
      </View>

      {/* Agree Text */}
      <Text style={styles.agreeText}>
        By clicking the <Text style={styles.registerText}>Register</Text>{' '}
        button, you agree to the public offer
      </Text>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.createButton} onPress={onSignUp}>
        <Text style={styles.createText}>Create Account</Text>
      </TouchableOpacity>

      {/* Sign In */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>I Already Have an Account</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: 30,
  },
  welcomeText: {
    fontSize: 48,
    fontFamily: fonts.primary.bold,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a8a8a9',
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5,
    fontFamily: fonts.primary.regular,
  },
  agreeText: {
    elevation: 3,
    marginVertical: 5,
    color: '#676767',
    marginRight: 20,
    fontFamily: fonts.primary.regular,
  },
  registerText: {
    fontSize: 14,
    color: '#3CC7F5',
    fontFamily: fonts.primary.regular,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: '#3CC7F5',
    paddingVertical: 15,
    marginVertical: 20,
    borderRadius: 6,
    elevation: 6,
  },
  createText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fonts.primary.bold,
  },
  signInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  signInText: {
    fontSize: 14,
    color: '#575757',
    fontFamily: fonts.primary.regular,
  },
  signInLink: {
    fontSize: 14,
    marginLeft: 5,
    color: '#3cc7f5',
    fontFamily: fonts.primary.bold,
    textDecorationLine: 'underline',
  },
});


export default SignUp;

