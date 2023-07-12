import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, Modal, TextInput, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonComponent from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

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

  setCurrency(savedCurrency);
  setPrice(savedPrice);

  if (savedDevices) {
    setDevices(JSON.parse(savedDevices));
  } else {
    setDevices([]);
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
      <View style={styles.container} >

        <ScrollView 
          // style={styles.container} 
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          // stickyHeaderIndices={[7]}
        >
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

          <View>
            {devices.map((item, index) => (
              <View style={styles.listItem} key={index}>
                <View>
                  <Text>{item.name}</Text>
                  <Text>
                    {item.watts} ватт, {item.quantity} шт, {item.hours} {item.hours === 1 ? 'час' : 'часа'}
                  </Text>
                </View>
                
                <MaterialCommunityIcons name="window-close" size={24} color="black" onPress={() => removeDevice(index)}/>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.result}>
            <Text style={styles.text}>
              Дневное потребление: {getTotalWatts() / 1000} Квт*ч
            </Text>
            <Text style={styles.text}>
              Цена электричества за день: {(getTotalWatts() / 1000) * price} {currency}
            </Text>
            <Text style={styles.text}>
              Потребление за месяц: {(getTotalWatts() / 1000) * 30} Квт*ч
            </Text>
            <Text style={styles.text}>
              Цена электричества за месяц: {((getTotalWatts() / 1000) * price) * 30} {currency}
            </Text>
          </View>
      </View>
    )}
  </>
);
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF' // #1E1E1E
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F5F5F5', //#2F2F2F
    // borderColor: '#D5D5D5',
    // borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  result: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    // height: 100,
    // alignSelf: 'flex-end'
  },
  btn: {
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    color: '#000000'
  },
  loading: {
    marginTop: 20,
  },
});

export default Home