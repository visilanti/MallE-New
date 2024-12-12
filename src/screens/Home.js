import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Icons from 'react-native-vector-icons/FontAwesome6';

const generateRatingStars = stars => {
  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 !== 0; // Check if there is a half star
  let starDisplay = '★'.repeat(fullStars);
  if (halfStar) {
    starDisplay += '☆'; // You can change this to a half-star emoji if available or another symbol
  }
  return starDisplay.padEnd(5, '☆'); // Ensures there are always 5 stars (full or empty)
};

const Home = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Resume');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.43.251:4000/api/products/'); // Replace with your API URL
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Use effect for polling
  useEffect(() => {
    // Fetch initial data
    fetchData();

    // Set up interval for polling
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Poll every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Render loading indicator
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render individual product card
  const renderItem = ({ item }) => {
    return (
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
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('OrderDetail')}>
          <Image
            source={require('../assets/images/list.png')}
            style={styles.timeIcon}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/Malle.png')}
          style={styles.logoImage}
        />
        <TouchableOpacity
          style={styles.profileIconContainer}
          onPress={() => navigation.navigate('ProfileDetails')}>
          <Image
            source={require('../assets/images/user.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={{ paddingHorizontal: 10 }}>
          <Icons name="magnifying-glass" size={20} color="#BBBBBB" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search any Product..."
          placeholderTextColor="#BBBBBB"
        />
        <TouchableOpacity style={{ paddingHorizontal: 10 }}>
          <Icons name="sliders" size={20} color="#BBBBBB" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('Resume')}>
          <Text
            style={
              activeTab === 'Resume' ? styles.activeTab : styles.inactiveTab
            }>
            Resume
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Books')}>
          <Text
            style={
              activeTab === 'Books' ? styles.activeTab : styles.inactiveTab
            }>
            Books
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      {activeTab === 'Resume' && (
        <FlatList
          data={data.filter(item => item.types === 'resume')}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          numColumns={2}
          contentContainerStyle={styles.content}
        />
      )}
      {activeTab === 'Books' && (
        <FlatList
          data={data.filter(item => item.types === 'book')}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          numColumns={2}
          contentContainerStyle={styles.content}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="home" size={20} color="#3CC7F5" />
          <Text style={[styles.footerButtonText, styles.active]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('AddCollection')}>
          <Image
            source={require('../assets/images/shop.png')}
            style={styles.icon}
          />
          <Text style={[styles.footerButtonText]}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('ProfileDetails')}>
          <Image
            source={require('../assets/images/settings.png')}
            style={styles.icon}
          />
          <Text style={styles.footerButtonText}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  timeIcon: {
    width: 30,
    height: 30,
  },
  logoImage: {
    width: 100,
    height: 30,
  },
  profileIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#ff8a80',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchBar: {
    flex: 1,
    padding: 10,
    paddingLeft: 10,
    height: 40,
    color: '#000000',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activeTab: {
    color: '#000',
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  inactiveTab: {
    color: '#888',
    marginHorizontal: 16,
  },
  active: {
    color: '#3CC7F5',
  },
  content: {
    paddingHorizontal: 16,
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
    width: 150,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default Home;