import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, Modal, TextInput, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonComponent from '../components/Button';

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceWatts, setDeviceWatts] = useState('');
  const [deviceQuantity, setDeviceQuantity] = useState('');
  const [devices, setDevices] = useState([]);
  const [deviceHours, setDeviceHours] = useState('');

const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');

const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
    try {
      setLoading(true);

  const savedCurrency = await AsyncStorage.getItem('currency');
  const savedPrice = await AsyncStorage.getItem('price');
  const savedDevices = await AsyncStorage.getItem('devices');

  if (savedCurrency) {
    setCurrency(savedCurrency);
  }
  if (savedPrice) {
    setPrice(savedPrice);
  }
  if (savedDevices) {
    setDevices(JSON.parse(savedDevices));
  }

  setLoading(false);
} catch (error) {
  console.log(error);
  setLoading(false);
}

};

const addDevice = async () => {
  if (deviceName && deviceWatts && deviceQuantity && deviceHours) {
  const newDevice = {
    name: deviceName,
    watts: deviceWatts,
    quantity: deviceQuantity,
    hours: deviceHours,
  };

  setDevices([...devices, newDevice]);

  setModalVisible(false);
  setDeviceName('');
  setDeviceWatts('');
  setDeviceQuantity('');
  setDeviceHours('');

  await AsyncStorage.setItem('devices', JSON.stringify([...devices, newDevice]));
}

};

const removeDevice = async (index) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);

await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));

};

const getTotalWatts = () => {
    return devices.reduce((total, device) => total + device.watts * device.quantity * device.hours, 0);
  };

const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

return (
  <>
    {loading ? (
      <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
    ) : (
      <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <ButtonComponent title="Добавить электроустройство" onPress={() => setModalVisible(true)} />
        <Text style={styles.text}>Список устройств:</Text>
        <Modal visible={modalVisible}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Имя электроустройства"
              value={deviceName}
              onChangeText={(text) => setDeviceName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Ватты"
              value={deviceWatts}
              onChangeText={(text) => setDeviceWatts(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Количество"
              value={deviceQuantity}
              onChangeText={(text) => setDeviceQuantity(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Время работы в день (часы)"
              value={deviceHours}
              onChangeText={(text) => setDeviceHours(text)}
              keyboardType="numeric"
            />
            <ButtonComponent style={styles.btn} title="Добавить" onPress={addDevice} />
            <ButtonComponent style={styles.btn} title="Отмена" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>

        {devices.map((item, index) => (
          <View style={styles.listItem} key={index}>
            <Text>{item.name}</Text>
            <Text>
              {item.watts} ватт, {item.quantity} шт, {item.hours} {item.hours === 1 ? 'час' : 'часа'}
            </Text>
            <ButtonComponent title="Удалить" onPress={() => removeDevice(index)} />
          </View>
        ))}

        <View style={styles.result}>
          <Text style={styles.text}>Дневное потребление: {getTotalWatts() / 1000} Квт*ч</Text>
          <Text style={styles.text}>
            Цена электричества за день: {(getTotalWatts() / 1000) * price} {currency}
          </Text>
          <Text style={styles.text}>
            Цена электричества за месяц: {((getTotalWatts() / 1000) * price) * 30} {currency}
          </Text>
        </View>
      </ScrollView>
    )}
  </>
);
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  modalContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: 'grey',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  result: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  btn: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
});

export default Home