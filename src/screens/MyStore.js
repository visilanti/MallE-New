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
import { fonts } from '../assets/fonts';

const generateRatingStars = (stars) => {
  if (stars === undefined || stars === null) return '☆☆☆☆☆'; // Default value if stars are undefined or null
  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 !== 0;
  let starDisplay = '★'.repeat(fullStars);
  if (halfStar) {
    starDisplay += '☆';
  }
  return starDisplay.padEnd(5, '☆');
};

const MyStore = ({ navigation }) => {
  const [data, setData] = useState([]); // State for storing order data
  const [loading, setLoading] = useState(true); // State for loading

  const fetchData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (!userToken) throw new Error('User token not found');
      console.log("Token:", userToken); // Debug

      const response = await axios.get('https://backend-malle.vercel.app/api/products/my-store/', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log(response.data); // Debugging response data

      // Update this line to use the correct key from the response
      if (Array.isArray(response.data.products)) {
        setData(response.data.products); // Use 'products' instead of 'orders'
      } else {
        setData([]); // If data is not in the expected format, reset the data
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setData([]); // Set data to an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />

      {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.pop()} style={styles.backButton}>
        <Icon name="angle-left" size={20} color="#3E3E40" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Collections</Text>
    </View>

      {/* List of Products */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { item })}>
            <Image source={{ uri: item.image[0] }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.courseName}>{item.courseName}</Text>
            <Text style={styles.price}>Rp. {item.price}</Text>
            <Text style={styles.rating}>
              Rating: {generateRatingStars(item.stars)} ({item.stars})
            </Text>
            <Text style={styles.review}>{item.numberOfReview} reviews</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.loadingText}>No products available</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 10,
 },

 backButton: {
   padding: 10,
 },

 headerTitle: {
   fontFamily: fonts.primary.bold,
   fontSize: 17,
   color: '#3E3E40',
   marginLeft: 10,
 },
  listContainer: {
    paddingBottom: 20,
//    padding: 20,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  courseName: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  rating: {
    fontSize: 12,
    color: '#555',
    marginVertical: 4,
  },
  review: {
    fontSize: 12,
    color: '#777',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default MyStore;
