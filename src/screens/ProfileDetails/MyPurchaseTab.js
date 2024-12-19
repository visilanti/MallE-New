import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyPurchaseTab = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          setError('User token not found');
          return;
        }

        // Fetch transactions
        const response = await axios.get('https://backend-malle.vercel.app/api/transactions/my-purchases', {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        const transactions = response.data.purchase || [];

              if (transactions.length === 0) {
                setData([]);
                setLoading(false);
                return;
              }

        // Fetch product details for each transaction
        const updatedTransactions = await Promise.all(
          transactions.map(async (transaction) => {
            try {
              const productResponse = await axios.get(`https://backend-malle.vercel.app/api/products/${transaction.id_product}`, {
                headers: { Authorization: `Bearer ${userToken}` },
              });

              // Combine transaction data with product data
              return {
                ...transaction,
                product_name: productResponse.data.title,
                product_image: productResponse.data.image, // Adjust according to your API response
              };
            } catch (error) {
              console.error(`Error fetching product for ID ${transaction.id_product}:`, error);
              return transaction; // Return transaction without product details
            }
          })
        );

        setData(updatedTransactions);
      } catch (error) {
        console.log('You have not made any purchases yet.');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStatusColor = (status) => {
    if (status === 'on_process') return styles.statusOnProgress;
    if (status === 'saled') return styles.statusSelesai;
    if (status === 'cancel') return styles.statusBatal;
    return styles.statusDefault;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Purchases</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.errorText}>You have not made any purchases yet.</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Image
                source={{ uri: item.product_image?.[0] || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.textContainer}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <Text style={styles.transactionText}>Id transaction: {item._id}</Text>
                <Text style={styles.transactionText}>
                  Order on {new Date(item.createdAt).toLocaleString()}
                </Text>
                <Text style={[styles.statusText, renderStatusColor(item.status)]}>
                  {item.payment_method} | {item.status}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
    orderTitle: {
      fontSize: 16,
      color: '#000000',
    },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 0,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  productName: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transactionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusOnProgress: {
    color: '#ffa500', // Orange
  },
  statusSelesai: {
    color: '#008000', // Green
  },
  statusBatal: {
    color: '#ff0000', // Red
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f00',
    textAlign: 'center',
  },
});

export default MyPurchaseTab;
