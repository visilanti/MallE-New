import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fonts } from '../../assets/fonts';
import MyStoreTab from './MyStoreTab';
import MyPurchaseTab from './MyPurchaseTab';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

console.log('MyStoreTab:', MyStoreTab);
console.log('MyPurchaseTab:', MyPurchaseTab);

const ProfileDetails = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('MyStore'); // State for active tab
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userToken, setUserToken] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'MyStore':
        return <MyStoreTab navigation={navigation} />;
      case 'MyPurchase':
        return <MyPurchaseTab navigation={navigation} />;
      default:
        return null;
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

          // Menyimpan gambar, nama, dan email dari API
          setProfileImage(userData.image && userData.image.length > 0
            ? { uri: userData.image[0] }  // Menggunakan URL gambar dari Cloudinary
            : require('../../assets/images/avatar.png') // Gambar default jika tidak ada
          );
          setName(userData.name);
          setEmail(userData.email);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      } else {
        setUserToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />

      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={() => navigation.pop()}>
        <Icon name="angle-left" size={30} color="#3E3E40" />
      </TouchableOpacity>

      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.profileName}>{name || 'No Name'}</Text>
        <Text style={styles.profileEmail}>{email || 'No Email'}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OrderDetail')}>
          <Icon name="clipboard" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SettingUser')}>
          <Icon name="gear" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.plus}
          onPress={() => navigation.navigate('AddCollection')}>
          <Icon name="plus" size={30} color="#3E3E40" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabsItem, activeTab === 'MyStore' && styles.activeTab]}
          onPress={() => setActiveTab('MyStore')}>
          <Text style={[styles.tabsText, activeTab === 'MyStore' && styles.activeTabs]}>
            My Store
          </Text>
          {activeTab === 'MyStore' && <View style={styles.activeDot} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabsItem, activeTab === 'MyPurchase' && styles.activeTab]}
          onPress={() => setActiveTab('MyPurchase')}>
          <Text style={[styles.tabsText, activeTab === 'MyPurchase' && styles.activeTabs]}>
            My Purchase
          </Text>
          {activeTab === 'MyPurchase' && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
      flex: 1,
    },
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  profileName: {
    fontFamily: fonts.primary.extrabold,
    fontSize: 18,
    color: '#000000',
  },
  profileEmail: {
    fontFamily: fonts.primary.regular,
    fontSize: 16,
    color: '#6E6E70',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3cc7f5',
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 12,
  },
  plus: {
    backgroundColor: '#E7E7E8',
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 12,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tabsItem: {
    alignItems: 'center',
  },
  tabsText: {
    marginHorizontal: 10,
    fontFamily: fonts.primary.bold,
    fontSize: 16,
    color: '#868687',
  },
  activeTabs: {
    fontFamily: fonts.primary.bold,
    fontSize: 16,
    color: '#000000',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3CC7F5',
    marginTop: 2,
  },
  orderContainer: {
    marginTop: 10,
  },
  orderHeader: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  orderTitle: {
    fontFamily: fonts.primary.regular,
    fontSize: 16,
    color: '#000000',
  },
  listContainer: {
    paddingVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontFamily: fonts.primary.regular,
    fontSize: 16,
    color: '#8e8e8e',
  },
});

export default ProfileDetails;