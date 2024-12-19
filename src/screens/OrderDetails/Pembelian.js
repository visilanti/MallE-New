import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

const Pembelian = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        setError("User token not found");
        setLoading(false);
        return;
      }

      // Fetch transactions
      const response = await axios.get(
        "https://backend-malle.vercel.app/api/transactions/my-purchases",
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      const transactions = response.data.purchase || [];

      if (transactions.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Fetch product details for each transaction
      const updatedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          try {
            const productResponse = await axios.get(
              `https://backend-malle.vercel.app/api/products/${transaction.id_product}`,
              {
                headers: { Authorization: `Bearer ${userToken}` },
              }
            );

            // Combine transaction data with product data
            return {
              ...transaction,
              title: productResponse.data.title,
              image: productResponse.data.image,
              rating: transaction.rating || 0, // Ensure rating is set to 0 if undefined
            };
          } catch (error) {
            console.error(
              `Error fetching product for ID ${transaction.id_product}:`,
              error
            );
            return transaction; // Return transaction without product details
          }
        })
      );

      setOrders(updatedTransactions);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleComplete = async (id) => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (!userToken) {
      console.error("User token is missing");
      return;
    }

    try {
      const response = await axios.put(
        "https://backend-malle.vercel.app/api/transactions/update-order-status",
        { orderId: id, status: "selesai" },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data) {
        const updatedOrder = response.data.data;
        const updatedOrders = orders.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, status: updatedOrder.status, rating: updatedOrder.rating || order.rating }
            : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleCancel = async (id) => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (!userToken) {
      console.error("User token is missing");
      return;
    }

    try {
      const response = await axios.put(
        "https://backend-malle.vercel.app/api/transactions/update-order-status",
        { orderId: id, status: "dibatalkan" },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data) {
        const updatedOrder = response.data.data;
        const updatedOrders = orders.map((order) =>
          order.id === updatedOrder._id ? updatedOrder : order
        );
        setOrders(updatedOrders); // Update state
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleRatingChange = async (id, value) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        console.error("User token is missing");
        return;
      }

      // Update the local state first for immediate feedback
      const updatedOrders = orders.map((order) => {
        if (order._id === id) {
          return { ...order, rating: value };
        }
        return order;
      });
      setOrders(updatedOrders);

      // Send the updated rating to the backend using axios
      const response = await axios.put(
        "https://backend-malle.vercel.app/api/products/update-rating",
        { _id: id, stars: value },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message); // Berhasil update rating
      } else {
        console.error(response.data.message); // Tampilkan error jika gagal
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image?.[0] || "https://via.placeholder.com/150" }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>ID Transaksi: {item._id}</Text>
        <Text style={styles.price}>Rp. {item.total?.toLocaleString() || "N/A"}</Text>
        <Text style={styles.detail}>Metode Pembayaran: {item.payment_method}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>

        {item.status === "on_process" ? (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleComplete(item._id)}
            >
              <Text style={styles.buttonText}>Selesai</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item._id)}
            >
              <Text style={styles.buttonText}>Batalkan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {item.status === "dibatalkan" && (
              <Text style={styles.cancelText}>Pesanan dibatalkan</Text>
            )}
            {item.status === "selesai" && (
              <>
                <Text style={styles.successText}>Pesanan selesai!</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => handleRatingChange(item._id, star)}
                      >
                        <Icon
                          name={star <= (item.rating || 0) ? "star" : "star-o"}
                          size={30}
                          color={star <= (item.rating || 0) ? "#FFD700" : "#ccc"}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3E3E40" />
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Anda belum melakukan transaksi apapun</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 80, height: 100, borderRadius: 8, marginRight: 16 },
  cardContent: { flex: 1 },
  title: { color: "#333", fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  detail: { fontSize: 14, color: "#666", marginBottom: 2 },
  price: { fontSize: 14, color: "#666", marginBottom: 4 },
  status: { fontSize: 14, color: "#888" },
  actions: { flexDirection: "row", marginTop: 12 },
  completeButton: { backgroundColor: "#3E3E40", padding: 8, borderRadius: 4, marginRight: 8 },
  cancelButton: { backgroundColor: "#FF6B6B", padding: 8, borderRadius: 4 },
  buttonText: { color: "#fff", fontSize: 14 },
  cancelText: { color: "#FF6B6B", fontSize: 14 },
  successText: { color: "#4CAF50", fontSize: 14, marginTop: 8 },
  ratingContainer: { marginTop: 12 },
  stars: { flexDirection: "row" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#333" },
});

export default Pembelian;
