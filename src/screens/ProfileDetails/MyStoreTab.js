import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../../assets/fonts';

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

const MyStoreTab = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await axios.get('https://backend-malle.vercel.app/api/products/my-store/', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setData(response.data.products || []);
    } catch (error) {
      console.log('You have not products yet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.orderContainer}>
      {/* Header untuk Navigasi */}
      <TouchableOpacity
        style={styles.orderHeader}
        onPress={() => navigation.navigate('MyStore')}>
        <Text style={styles.orderTitle}>See All</Text>
      </TouchableOpacity>

      {/* Order Items */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : data.length === 0 ? (
         <Text style={styles.errorText}>You have not made any stores yet.</Text>
      ) :(
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Detail', { item })}>
              {/* Gambar dengan penanganan default */}
              <Image
                source={{ uri: item.image?.[0] || 'https://via.placeholder.com/150' }}
                style={styles.image}
              />
              {/* Teks */}
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.courseName}>{item.courseName}</Text>
              <Text style={styles.price}>Rp. {item.price}</Text>
              {/* Rating */}
              <Text style={styles.rating}>
                Rating: {generateRatingStars(item.stars)} ({item.stars || 0})
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          horizontal
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderHeader: {
    alignSelf: 'flex-end',
  },
  orderTitle: {
    fontFamily: fonts.primary.regular,
    fontSize: 16,
    color: '#000000',
  },
  listContainer: {
    paddingVertical: 20,
  },
   card: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 8,
      margin: 8,
      paddingBottom: 8,
      alignItems: 'flex-start',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    image: {
      width: 165,
      height: 150,
      borderRadius: 8,
      marginBottom: 8,
      resizeMode: 'cover',
    },
    title: {
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'left',
      padding: 8,
      fontSize: 14,
    },
    courseName: {
      fontSize: 12,
      color: '#555',
      paddingLeft: 8,
    },
    price: {
      color: '#000',
      fontWeight: 'bold',
      paddingLeft: 8,
    },
    rating: {
      color: '#555',
      marginTop: 4,
      paddingLeft: 8,
      fontSize: 10,
    },
    review: {
      paddingLeft: 8,
    },
  loadingText: {
    textAlign: 'center',
    fontFamily: fonts.primary.regular,
    fontSize: 16,
    color: '#8e8e8e',
  },
    errorText: {
      fontSize: 16,
      color: '#f00',
      textAlign: 'center',
    }
});

export default MyStoreTab;
