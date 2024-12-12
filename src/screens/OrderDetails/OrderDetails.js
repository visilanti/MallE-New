import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Pembelian from "./Pembelian";
import Penjualan from "./Penjualan";

const OrderDetails = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("pembelian");

  const renderContent = () => {
    if (activeTab === "pembelian") return <Pembelian />;
    if (activeTab === "penjualan") return <Penjualan />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconHeader}
          onPress={() => navigation.pop()}
        >
          <Icon name="arrow-back-ios" size={25} color="#3E3E40" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Detail</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["pembelian", "penjualan"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View style={styles.activeDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { paddingVertical: 10, flexDirection: "row", justifyContent: "center" },
  iconHeader: { position: "absolute", left: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  tab: { flex: 1, alignItems: "center" },
  tabText: { fontSize: 16, color: "#888" },
  activeTabText: { color: "#000", fontWeight: "bold" },
  activeDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: "#00AEEF", marginTop: 5 },
});

export default OrderDetails;


//import React, { useState, useEffect } from "react";
//import {
//  View,
//  Text,
//  TouchableOpacity,
//  FlatList,
//  Image,
//  StyleSheet,
//  ActivityIndicator
//} from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
//import AsyncStorage from "@react-native-async-storage/async-storage";
//import axios from "axios";
//
//const OrderDetails = ({ navigation }) => {
//  const [activeTab, setActiveTab] = useState("pembelian");
//  const [orders, setOrders] = useState([]);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);
//
//  const fetchData = async () => {
//    try {
//      const userToken = await AsyncStorage.getItem("userToken");
//      if (!userToken) {
//        setError("User token not found");
//        setLoading(false);
//        return;
//      }
//
//      // Fetch transactions
//      const response = await axios.get(
//        "http://192.168.43.251:4000/api/transactions/my-purchases",
//        {
//          headers: { Authorization: `Bearer ${userToken}` },
//        }
//      );
//
//      const transactions = response.data.purchase || [];
//
//      if (transactions.length === 0) {
//        setOrders([]);
//        setLoading(false);
//        return;
//      }
//
//      // Fetch product details for each transaction
//      const updatedTransactions = await Promise.all(
//        transactions.map(async (transaction) => {
//          try {
//            const productResponse = await axios.get(
//              `http://192.168.43.251:4000/api/products/${transaction.id_product}`,
//              {
//                headers: { Authorization: `Bearer ${userToken}` },
//              }
//            );
//
//            // Combine transaction data with product data
//            return {
//              ...transaction,
//              title: productResponse.data.title,
//              image: productResponse.data.image, // Adjust according to your API response
//            };
//          } catch (error) {
//            console.error(
//              `Error fetching product for ID ${transaction.id_product}:`,
//              error
//            );
//            return transaction; // Return transaction without product details
//          }
//        })
//      );
//
//      setOrders(updatedTransactions);
//    } catch (error) {
//      setError("Failed to fetch data");
//      console.error(error);
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  useEffect(() => {
//    fetchData();
//  }, []);
//
//  const handleComplete = async (id) => {
//  const userToken = await AsyncStorage.getItem("userToken");
//  if (!userToken) {
//    console.error("User token is missing");
//    return;
//  }
//
//  try {
//    const response = await axios.put(
//      "http://192.168.43.251:4000/api/transactions/update-order-status",
//      { orderId: id, status: "selesai" },
//      {
//        headers: { Authorization: `Bearer ${userToken}` },
//      }
//    );
//
//    if (response.data) {
//      const updatedOrder = response.data.data;
//
//      // Update the order with the new status and potentially rating
//      const updatedOrders = orders.map((order) =>
//        order._id === updatedOrder._id
//          ? { ...order, status: updatedOrder.status, rating: updatedOrder.rating || order.rating }
//          : order
//      );
//
//      // Update state to trigger re-render
//      setOrders(updatedOrders);
//    }
//  } catch (error) {
//    console.error("Failed to update order status:", error);
//  }
//};
//
//  const handleCancel = async (id) => {
//    const userToken = await AsyncStorage.getItem("userToken");
//    if (!userToken) {
//      console.error("User token is missing");
//      return;
//    }
//
//    try {
//      const response = await axios.put(
//        "http://192.168.43.251:4000/api/transactions/update-order-status",
//        { orderId: id, status: "dibatalkan" },
//        {
//          headers: {
//            Authorization: `Bearer ${userToken}`,
//          },
//        }
//      );
//
//      if (response.data) {
//        const updatedOrder = response.data.data;
//
//        const updatedOrders = orders.map((order) =>
//          order.id === updatedOrder._id ? updatedOrder : order
//        );
//        setOrders(updatedOrders); // Update state
//      }
//    } catch (error) {
//      console.error("Failed to cancel order:", error);
//    }
//  };
//
//  const handleRatingChange = async (id, value) => {
//  try {
//    // Update the local state first for immediate feedback
//    const updatedOrders = orders.map((order) => {
//      if (order._id === id) {
//        return { ...order, rating: value };
//      }
//      return order;
//    });
//    setOrders(updatedOrders);
//
//    // Send the updated rating to the backend using axios
//    const response = await axios.put(
//      '/update-products-rating',
//      { _id: id, stars: value },
//      {
//        headers: {
//          'Content-Type': 'application/json',
//          'Authorization': `Bearer ${authToken}`,  // Sesuaikan dengan cara autentikasi Anda
//        },
//      }
//    );
//
//    // Handle the response from the server
//    if (response.status === 200) {
//      console.log(response.data.message); // Berhasil update rating
//    } else {
//      console.error(response.data.message); // Tampilkan error jika gagal
//    }
//  } catch (error) {
//    console.error('Error updating rating:', error);
//  }
//};
//
//  const renderOrder = ({ item }) => (
//    <View style={styles.card}>
//      <Image
//        source={{ uri: item.image?.[0] || "https://via.placeholder.com/150" }}
//        style={styles.image}
//        resizeMode="cover"
//      />
//      <View style={styles.cardContent}>
//        <Text style={styles.title}>{item.title}</Text>
//        <Text style={styles.detail}>ID Transaksi: {item._id}</Text>
//        <Text style={styles.price}>Rp. {item.total?.toLocaleString() || "N/A"}</Text>
//        <Text style={styles.detail}>Metode Pembayaran: {item.payment_method}</Text>
//        <Text style={styles.status}>Status: {item.status}</Text>
//
//        {item.status === "on_process" ? (
//          <View style={styles.actions}>
//            <TouchableOpacity
//              style={styles.completeButton}
//              onPress={() => {
//                console.log("Completing order", item._id); // Log for debugging
//                handleComplete(item._id);
//              }}
//            >
//              <Text style={styles.buttonText}>Selesai</Text>
//            </TouchableOpacity>
//            <TouchableOpacity
//              style={styles.cancelButton}
//              onPress={() => {
//                console.log("Canceling order", item._id); // Log for debugging
//                handleCancel(item._id);
//              }}
//            >
//              <Text style={styles.buttonText}>Batalkan</Text>
//            </TouchableOpacity>
//          </View>
//        ) : (
//          <>
//            {item.status === "dibatalkan" && (
//              <Text style={styles.cancelText}>Pesanan dibatalkan</Text>
//            )}
//            {item.status === "selesai" && (
//              <>
//                <Text style={styles.successText}>Pesanan selesai!</Text>
//                {item.rating === undefined || item.rating === null ? (
//                  <View style={styles.ratingContainer}>
//                    <View style={styles.stars}>
//                      {[1, 2, 3, 4, 5].map((star) => (
//                        <TouchableOpacity
//                          key={star}
//                          onPress={() => handleRatingChange(item._id, star)} // Update rating saat diklik
//                        >
//                          <Icon
//                            name={star <= (item.rating || 0) ? "star" : "star-outline"}
//                            size={30}
//                            color={star <= (item.rating || 0) ? "#FFD700" : "#ccc"}
//                          />
//                        </TouchableOpacity>
//                      ))}
//                    </View>
//                  </View>
//                ) : (
//                  <View style={styles.ratingContainer}>
//                    <View style={styles.stars}>
//                      {[1, 2, 3, 4, 5].map((star) => (
//                        <Icon
//                          key={star}
//                          name={star <= item.rating ? "star" : "star-outline"}
//                          size={30}
//                          color={star <= item.rating ? "#FFD700" : "#ccc"}
//                        />
//                      ))}
//                    </View>
//                  </View>
//                )}
//              </>
//            )}
//          </>
//        )}
//      </View>
//    </View>
//  );
//
//  return (
//    <View style={styles.container}>
//      {/* Header */}
//      <View style={styles.header}>
//        <TouchableOpacity
//          style={styles.iconHeader}
//          onPress={() => navigation.pop()}
//        >
//          <Icon name="arrow-back-ios" size={25} color="#3E3E40" />
//        </TouchableOpacity>
//        <Text style={styles.headerText}>Order Detail</Text>
//      </View>
//
//      {/* Tabs */}
//      <View style={styles.tabs}>
//        {["pembelian", "penjualan"].map((tab) => (
//          <TouchableOpacity
//            key={tab}
//            style={styles.tab}
//            onPress={() => setActiveTab(tab)}
//          >
//            <Text
//              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
//            >
//              {tab.charAt(0).toUpperCase() + tab.slice(1)}
//            </Text>
//            {activeTab === tab && <View style={styles.activeDot} />}
//          </TouchableOpacity>
//        ))}
//      </View>
//
//      {/* Content */}
//      {activeTab === "pembelian" ? (
//        loading ? (
//          <ActivityIndicator size="large" color="#3E3E40" />
//        ) : orders.length === 0 ? (
//          <View style={styles.emptyState}>
//            <Text style={styles.emptyText}>Anda belum melakukan transaksi apapun</Text>
//          </View>
//        ) : (
//          <FlatList
//            data={orders}
//            renderItem={renderOrder}
//            keyExtractor={(item) => item._id}
//          />
//        )
//      ) : (
//        <View style={styles.emptyState}>
//          <Text style={styles.emptyText}>Tidak ada data penjualan</Text>
//        </View>
//      )}
//
//    </View>
//  );
//};
//
//const styles = StyleSheet.create({
//  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
//  header: {
//    paddingVertical: 10,
//    flexDirection: "row",
//    alignItems: "center",
//    justifyContent: "center",
//  },
//  iconHeader: {
//    position: "absolute",
//    left: 10,
//    top: 15,
//  },
//  headerText: {
//    fontSize: 20,
//    fontWeight: "bold",
//    textAlign: "center",
//    color: '#333',
//  },
//  tabs: {
//    flexDirection: "row",
//    justifyContent: "space-around",
//    marginBottom: 16,
//    paddingVertical: 8,
//  },
//  tab: { flex: 1, alignItems: "center" },
//  tabText: { fontSize: 16, color: "#888" },
//  activeTabText: { color: "#000", fontWeight: "bold" },
//  activeDot: {
//    width: 6,
//    height: 6,
//    borderRadius: 4,
//    backgroundColor: "#00AEEF",
//    marginTop: 5,
//  },
//  card: {
//    flexDirection: "row",
//    backgroundColor: "#fff",
//    padding: 16,
//    marginVertical: 8,
//    borderRadius: 8,
//    shadowColor: "#000",
//    shadowOpacity: 0.1,
//    shadowRadius: 4,
//    elevation: 2,
//  },
//  image: { width: 80, height: 100, borderRadius: 8, marginRight: 16 },
//  cardContent: { flex: 1 },
//  title: { color: "#333", fontSize: 16, fontWeight: "bold", marginBottom: 4 },
//  detail: { fontSize: 14, color: "#666", marginBottom: 2 },
//  price: { fontSize: 14, color: "#666", marginBottom: 4 },
//  status: { fontSize: 14, color: "#888" },
//  actions: { flexDirection: "row", marginTop: 10 },
//  completeButton: {
//    flex: 1,
//    backgroundColor: "#007BFF",
//    padding: 10,
//    borderRadius: 8,
//    marginRight: 5,
//  },
//  cancelButton: {
//    flex: 1,
//    backgroundColor: "#FF3B3B",
//    padding: 10,
//    borderRadius: 8,
//  },
//  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
//  successText: { marginTop: 10, color: "#28a745", fontWeight: "bold" },
//  cancelText: { marginTop: 10, color: "#FF3B3B", fontWeight: "bold" }, // Style label pembatalan
//  ratingContainer: {
//    marginTop: 10,
//    flexDirection: "row",
//    alignItems: "center",
//  },
//  ratingLabel: { fontSize: 14, color: "#333", marginRight: 8 },
//  stars: {
//    flexDirection: "row",
//    marginTop: 5,
//  },
//  ratingDisplay: {
//    marginTop: 10,
//    fontSize: 14,
//    color: "#FFD700",
//  },
//  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
//  emptyText: { fontSize: 16, color: "#888" },
//});
//
//export default OrderDetails;
//
//
