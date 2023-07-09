import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");

useEffect(() => {
  const loadData = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem("currency");
      const savedPrice = await AsyncStorage.getItem("price");

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    if (savedPrice) {
      setPrice(savedPrice);
    }
  } catch (error) {
    console.log(error);
  }
}

loadData();

}, []);

const handleCurrencyChange = (value) => {
    setCurrency(value);
    AsyncStorage.setItem("currency", value);
  };

const handlePriceChange = (text) => {
    setPrice(text);
    AsyncStorage.setItem("price", text);
  };

return (
    <View style={styles.container}>
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
      <View style={styles.result}>
        <Text style={styles.text}>Currency: {currency}</Text>
        <Text style={styles.text}>Price per kWh: {price}</Text>
      </View>
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
    // paddingVertical: 5,
    // paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  result: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
  },
});