import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, Modal, ActivityIndicator, RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonComponent from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import styled from 'styled-components/native';
import { InputAccessoryView } from 'react-native';

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

  const {isDark} = useContext(ThemeContext)

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

  function truncateNumber(number) {
    var parts = number.toString().split(".");
    return !parts[1] || parts[1].length <= 2 ? number : parseFloat(parts[0] + "." + parts[1].slice(0, 2));
  }

  return (
    <>
      {loading ? (
        <Loading>
          <ActivityIndicator size="large" color="#0000ff" />
        </Loading>
        
      ) : (
        <Container isDark={isDark}>

          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh} 
              colors={[isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor]}
              progressBackgroundColor={isDark ? DARK_COLORS.refreshColor : LIGHT_COLORS.refreshColor}
            />}
          > 
            <ButtonComponent title="Добавить электроустройство" onPress={() => setModalVisible(true)} />
            <SectionText isDark={isDark}>Список устройств:</SectionText>
            <Modal visible={modalVisible}>
              <ModalContainer>
                <Input
                  placeholder="Имя электроустройства"
                  value={deviceName}
                  onChangeText={(text) => setDeviceName(text)}
                />
                <Input
                  placeholder="Ватты"
                  value={deviceWatts}
                  onChangeText={(text) => setDeviceWatts(text)}
                  keyboardType="numeric"
                />
                <Input
                  placeholder="Количество"
                  value={deviceQuantity}
                  onChangeText={(text) => setDeviceQuantity(text)}
                  keyboardType="numeric"
                />
                <Input
                  placeholder="Время работы в день (часы)"
                  value={deviceHours}
                  onChangeText={(text) => setDeviceHours(text)}
                  keyboardType="numeric"
                />
                <ButtonComponent title="Добавить" onPress={addDevice} />
                <ButtonComponent title="Отмена" onPress={() => setModalVisible(false)} />
              </ModalContainer>
            </Modal>

            <View>
              {devices.map((item, index) => (
                <ListItem isDark={isDark} key={index}>
                  <View>
                    <SectionText isDark={isDark}>
                      {item.name}
                    </SectionText>
                    <SectionText isDark={isDark}>
                      {item.watts} ватт, {item.quantity} шт, {item.hours} {item.hours === 1 ? 'час' : 'часа'}
                    </SectionText>
                  </View>
                  
                  <MaterialCommunityIcons name="window-close" size={24} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} onPress={() => removeDevice(index)}/>
                </ListItem>
              ))}
            </View>
          </ScrollView>

          <Result isDark={isDark}>
              <SectionText isDark={isDark}>
                Дневное потребление: {truncateNumber(getTotalWatts() / 1000)} Квт*ч
              </SectionText>
              <SectionText isDark={isDark}>
                Цена электричества за день: {truncateNumber((getTotalWatts() / 1000) * price)} {currency}
              </SectionText>
              <SectionText isDark={isDark}>
                Потребление за месяц: {truncateNumber((getTotalWatts() / 1000) * 30)} Квт*ч
              </SectionText>
              <SectionText isDark={isDark}>
                Цена электричества за месяц: {truncateNumber(((getTotalWatts() / 1000) * price) * 30)} {currency}
              </SectionText>

              <SectionText isDark={isDark}>
                {isDark ? 'Dark' : 'Light'} Mode
              </SectionText>
            </Result>
        </Container>
      )}
    </>
  );
};



const Container = styled.View`
  padding: 20px;
  flex: 1;
  flex-direction: column;
  background-color: ${(props) =>
    props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;

const ModalContainer = styled.View`
  padding: 20px;
`;

const Input = styled.TextInput`
  border: 1px solid ${(props) =>
    props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
  padding: 10px 15px;
  margin-bottom: 10px;
`;

const ListItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
    flex: 1;
    background-color: ${(props) =>
      props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 10px;
`;

const Result = styled.View`
  border-radius: 10px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
`;

const SectionText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor};
`;

const Loading = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export default Home;