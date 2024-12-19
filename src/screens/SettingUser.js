import React, { useState, useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { fonts } from '../assets/fonts';

const SettingUser = ({ navigation }) => {
  const [userToken, setUserToken] = useState(null); // State for user token
  const [profileImage, setProfileImage] = useState(require('../assets/images/avatar.png')); // Default profile image
  const [userData, setUserData] = useState({
    uid: '',
    name: '',
    telp: '',
    email: '',
  });

  // Fungsi untuk mengambil data pengguna
  const fetchUserData = async (user, token) => {
    try {
      const response = await axios.get(
        `https://backend-malle.vercel.app/api/users/${user.uid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(response.data); // Set data pengguna
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

 useEffect(() => {
   const auth = getAuth();

   const unsubscribe = onAuthStateChanged(auth, async (user) => {
     if (user) {
       const token = await user.getIdToken();
       setUserToken(token);

       try {
         const response = await axios.get(
           `https://backend-malle.vercel.app/api/users/${user.uid}`,
           {
             headers: { Authorization: `Bearer ${token}` },
           }
         );

         const userData = response.data;

         setUserData(userData);

         // Mengatur gambar profil dengan URL Cloudinary jika ada
          if (userData.image && userData.image.length > 0) {
             setProfileImage({ uri: userData.image[0] }); // Remote image
           } else {
             setProfileImage(require('../assets/images/avatar.png')); // Default local image
           }
       } catch (error) {
         console.error('Error fetching user data:', error.message);
       }
     } else {
       setUserToken(null);
     }
   });

   return () => unsubscribe();
 }, []);

  // Fungsi menangani image picker
  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setProfileImage({ uri: response.assets[0].uri });
        }
      }
    );
  };

  // Fungsi logout
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUserToken(null);
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      })
      .catch((error) => {
        console.error('Error during logout:', error.message);
      });
  };

  // Fungsi menyimpan data pengguna
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('telp', userData.telp);
      if (profileImage.uri) {
        formData.append('image', {
          uri: profileImage.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      await axios.put(
        `https://backend-malle.vercel.app/api/users/${userData.uid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Profile updated successfully');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken();
      await fetchUserData(currentUser, token); // Perbarui data pengguna setelah save
    } catch (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconHeader} onPress={() => navigation.pop()}>
          <Icon name="angle-left" size={25} color="#3E3E40" />
        </TouchableOpacity>
        <Text style={styles.headerText}>User Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Image source={profileImage} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIcon} onPress={handleImagePicker}>
            <Icon name="pencil" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.titleForm}>Personal Details</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={userData.email}
          editable={false}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
        />

        <Text style={styles.label}>Telp Number</Text>
        <TextInput
          style={styles.input}
          value={userData.telp}
          keyboardType="phone-pad"
          onChangeText={(text) => setUserData({ ...userData, telp: text })}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.outButton} onPress={handleLogout}>
        <Text style={styles.outText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 30,
    paddingRight: 30,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconHeader: {
    position: 'absolute',
    left: 1,
  },
  headerText: {
    fontFamily: fonts.primary.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
//    marginBottom: 20,
  },
  avatar: {
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    bottom: 15,
    right: -5,
    backgroundColor: '#4392f9',
    borderRadius: 16,
    padding: 8,
  },
  form: {
    marginVertical: 10,
  },
  titleForm: {
    fontFamily: fonts.primary.bold,
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    color: '#000',
    fontFamily: fonts.primary.regular,
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    color: '#000',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderColor: '#c8c8c8',
    marginBottom: 15,
  },
  changePasswordText: {
    fontFamily: fonts.primary.medium,
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: '#3CC7F5',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#3CC7F5',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 5,
  },
  saveText: {
    fontFamily: fonts.primary.bold,
    color: '#FFFFFF',
    fontSize: 16,
  },
    outButton: {
        backgroundColor: '#EE0000',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        marginVertical: 5,
      },
        outText: {
          fontFamily: fonts.primary.bold,
          color: '#FFFFFF',
          fontSize: 16,
        },
});
export default SettingUser;