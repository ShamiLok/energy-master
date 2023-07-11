import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, FlatList, StyleSheet } from 'react-native';
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

  useEffect(() => {
    const loadData = async () => {
      try {
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
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);


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
      console.log(await AsyncStorage.getItem('devices'))
    }
  };

  const removeDevice = async (index) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);

    await AsyncStorage.setItem('devices', JSON.stringify(devices));
  };

  const getTotalWatts = () => {
    return devices.reduce((total, device) => total + device.watts * device.quantity * device.hours, 0);
  };

  return (
    <View style={styles.container}>
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

      <FlatList
        data={devices}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
            <Text>
              {item.watts} ватт, {item.quantity} шт, {item.hours} {item.hours === 1 ? 'час' : 'часа'}
            </Text>
            <ButtonComponent title="Удалить" onPress={() => removeDevice(index)} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text style={styles.text}>Дневное потребление: {getTotalWatts() / 1000} Квт*ч</Text>
      <Text style={styles.text}>
        Цена электричества за день: {(getTotalWatts() / 1000) * price} {currency}
      </Text>
      <Text style={styles.text}>
        Цена электричества за месяц: {((getTotalWatts() / 1000) * price) * 30} {currency}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
  },
  btn: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default Home;