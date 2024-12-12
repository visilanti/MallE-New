import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fonts } from '../assets/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ route, navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const { item } = route.params; // item harus sudah memuat id_product dan userToken (id_seller)

  // UID dari user yang sedang aktif
  const userUID = 'activeUserUID'; // Replace with real UID from Firebase/Auth

  // Fungsi untuk POST transaksi
  const handleBuyNow = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken'); // Ambil token user dari storage
      const id_buyer = await AsyncStorage.getItem('uid'); // Ambil UID user aktif
      const apiURL = 'http://192.168.43.251:4000/api/transactions/';

      const transactionData = {
        id_product: item._id, // id produk dari item yang dipilih
        id_seller: item.userToken, // userToken seller dari produk
        id_buyer: id_buyer, // UID user aktif
        total: item.price, // Total harga
        payment_method: selectedPayment, // Metode pembayaran yang dipilih
        status: 'on_process', // Status awal transaksi
      };

      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`, // Kirim token untuk autentikasi
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your transaction has been created successfully!');
        navigation.replace('OrderDetail');
      } else {
        console.error(result);
        Alert.alert('Error', 'Failed to create transaction. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconHeader}
          onPress={() => navigation.pop()}>
          <Icon name="angle-left" size={25} color="#3E3E40" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Checkout</Text>
      </View>

      {/* Product Section */}
      <View style={styles.productContainer}>
        <Image source={{ uri: item.image[0] }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productPrice}>Rp.{item.price}</Text>
        </View>
      </View>

      {/* Payment Method Section */}
      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Metode Pembayaran *</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              selectedPayment === 'gopay' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('gopay')}>
            <Image
              source={require('../assets/images/gopay_icon.png')}
              style={styles.paymentIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              selectedPayment === 'COD' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('COD')}>
            <Text style={styles.paymentText}>COD</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Ringkasan Pembayaran</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub-total</Text>
          <Text style={styles.summaryValue}>Rp.{item.price}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Metode Pembayaran</Text>
          <Text style={styles.summaryValue}>{selectedPayment}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp.{item.price}</Text>
        </View>
      </View>

      {/* Buy Now Button */}
      <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 20,
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
    color: '#000000',
    fontFamily: fonts.primary.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productDetails: {
    color: '#000000',
    marginLeft: 16,
  },
  productTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#000000',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  paymentContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 100,
  },
  paymentOptions: {
    color: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paymentButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 125,
    height: 70,
  },
  selectedPayment: {
    borderColor: '#5BC0EB',
  },
  paymentIcon: {
    width: 39,
    height: 38,
    marginBottom: 4,
  },
  paymentText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 16,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 100,
  },
  summaryTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#000000',
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    color: '#000000',
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalLabel: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#3CC7F5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
