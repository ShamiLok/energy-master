import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceWatts, setDeviceWatts] = useState('');
  const [deviceQuantity, setDeviceQuantity] = useState('');
  const [devices, setDevices] = useState([]);

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

  const addDevice = () => {
    if (deviceName && deviceWatts && deviceQuantity) {
      const newDevice = {
        name: deviceName,
        watts: deviceWatts,
        quantity: deviceQuantity,
      };

      setDevices([...devices, newDevice]);
      setModalVisible(false);
      setDeviceName('');
      setDeviceWatts('');
      setDeviceQuantity('');
    }
  };

  const getTotalWatts = () => {
    return devices.reduce((total, device) => total + (device.watts * device.quantity), 0);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Добавить электроустройство" onPress={() => setModalVisible(true)} />
      <Text>Список устройств:</Text>
      <Modal visible={modalVisible}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            placeholder="Имя электроустройства"
            value={deviceName}
            onChangeText={text => setDeviceName(text)}
          />
          <TextInput
            placeholder="Ватты"
            value={deviceWatts}
            onChangeText={text => setDeviceWatts(text)}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Количество"
            value={deviceQuantity}
            onChangeText={text => setDeviceQuantity(text)}
            keyboardType="numeric"
          />

          <Button title="Добавить" onPress={addDevice} />
          <Button title="Отмена" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <FlatList
        data={devices}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            <Text>{item.name}, {item.watts}ватт, {item.quantity}шт</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text>Общее количество ватт: {getTotalWatts()}</Text>
      <Text>Общее количество Кватт: {getTotalWatts() / 1000}</Text>
      <Text>Цена электричества за день: {getTotalWatts() / 1000 * 24 * price} </Text>
      <Text>Цена электричества за месяц: {(getTotalWatts() / 1000 * 24 * price) * 30}</Text>
    </View>
  );
};

export default Home;