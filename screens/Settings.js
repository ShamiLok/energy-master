import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonComponent from '../components/Button';

export default function Settings() {
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const savedCurrency = await AsyncStorage.getItem("currency");
      const savedPrice = await AsyncStorage.getItem("price");
      setCurrency(savedCurrency);
      setPrice(savedPrice);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

  }

  const handleCurrencyChange = async (value) => {
    setCurrency(value);
    await AsyncStorage.setItem("currency", value);
  };

  const handlePriceChange = async (text) => {
    setPrice(text);
    await AsyncStorage.setItem("price", text);
  };

  const handleDefault = async () =>{
    setShowModal(true);
  }

  const handleResetConfirmation = async () => {
    await AsyncStorage.clear();
    setShowModal(false);
    loadData();
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={[]}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListHeaderComponent={(
            <>
              <View style={styles.formItem}>
                <Text style={styles.label}>Select currency:</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={currency}
                    onValueChange={handleCurrencyChange}>
                    <Picker.Item label="EUR" value="EUR" />
                    <Picker.Item label="USD" value="USD" />
                    <Picker.Item label="RUB" value="RUB" />
                  </Picker>
                </View>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>Enter the price per kWh:</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={handlePriceChange}
                  keyboardType="numeric"
                />
              </View>
              <ButtonComponent title="Сбросить настройки" onPress={handleDefault}/>
              <Modal visible={showModal} >
                <View>
                  <Text>Вы уверены, что хотите сбросить настройки?</Text>
                  <ButtonComponent title="Да" onPress={handleResetConfirmation}/>
                  <ButtonComponent title="Нет" onPress={() => setShowModal(false)}/>
                </View>
              </Modal>
            </>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});