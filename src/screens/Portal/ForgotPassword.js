import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {fonts} from '../../assets/fonts';

const ForgotPassword = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />

      <Text style={styles.welcomeText}>
        Forgot
        {'\n'}
        Password?
      </Text>

      {/* Username or Email Input */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#626262" solid />
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#676767"
        />
      </View>

      {/* Notice */}
      <View style={styles.noticeContainer}>
        <Text style={styles.notice}>*</Text>
        <Text style={styles.noticeText}>
          We will send you a message to set or reset your new password
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
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
    marginTop: 4,
    fontFamily: fonts.primary.regular,
  },
  noticeContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  notice: {
    elevation: 3,
    color: '#ff4b26',
    marginRight: 5,
    fontFamily: fonts.primary.regular,
  },
  noticeText: {
    fontSize: 14,
    color: '#676767',
    fontFamily: fonts.primary.regular,
    elevation: 3,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#3CC7F5',
    paddingVertical: 15,
    marginVertical: 20,
    borderRadius: 6,
    elevation: 6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fonts.primary.bold,
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 50,
    color: '#575757',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  socialBorder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8f4fd',
    borderRadius: 30,
    padding: 10,
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#3cc7f5',
  },
  socialIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  signupContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  signupText: {
    fontSize: 14,
    color: '#575757',
  },
  signupLink: {
    fontSize: 14,
    marginLeft: 5,
    color: '#3cc7f5',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
export default ForgotPassword;
