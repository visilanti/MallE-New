import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icons from 'react-native-vector-icons/FontAwesome';
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
        <Icons name="angle-left" size={30} color="#3E3E40" />
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
