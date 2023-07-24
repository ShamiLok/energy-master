import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, RefreshControl, ToastAndroid, Animated} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons'; 
// import * as Animatable from 'react-native-animatable'; // Import the Animatable library

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import styled from 'styled-components/native';

import ButtonComponent from '../components/Button';
import SectionText from '../components/SectionText';
import ListItems from '../components/ListItems';

const Home = () => {
  const [addDeviceVisible, setAddDeviceVisible] = useState(false);
  const [devices, setDevices] = useState([]);

  const [deviceName, setDeviceName] = useState('');
  const [deviceWatts, setDeviceWatts] = useState('');
  const [deviceQuantity, setDeviceQuantity] = useState('');
  const [deviceHours, setDeviceHours] = useState('');
  const [dayDeviceHours, setDayDeviceHours] = useState('');
  const [nightDeviceHours, setNightDeviceHours] = useState('');

  const [currency, setCurrency] = useState('');
  const [plan, setPlan] = useState('');
  // const [dayPrice, setDayPrice] = useState('');
  // const [nightPrice, setNightPrice] = useState('');
  const [price, setPrice] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isResultHide, setIsResultHide] = useState(false);

  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const savedCurrency = await AsyncStorage.getItem('currency');
      const savedPlan = await AsyncStorage.getItem('plan');
      const savedDayPrice = await AsyncStorage.getItem('dayPrice');
      const savedNightPrice = await AsyncStorage.getItem('nightPrice');
      const savedPrice = await AsyncStorage.getItem('price');
      const savedDevices = await AsyncStorage.getItem('devices');

      setPlan(savedPlan);
      if(savedPlan === 'fixed') {
        setPrice(savedPrice);
      } else {
        setPrice((Number(savedDayPrice) + Number(savedNightPrice))/2 );
      }
      // setDayPrice(savedDayPrice)
      // setNightPrice(savedNightPrice)
      setCurrency(savedCurrency);
      // setPrice(savedPrice);

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
    if (deviceName && deviceWatts && deviceQuantity && (deviceHours || (dayDeviceHours && nightDeviceHours))) {
      const newDevice = {
        name: deviceName,
        watts: deviceWatts,
        quantity: deviceQuantity,
        hours: deviceHours,
        dayHours: dayDeviceHours,
        nightHours: nightDeviceHours
      };

      setDevices([...devices, newDevice]);

      setDeviceName('');
      setDeviceWatts('');
      setDeviceQuantity('');
      setDeviceHours('');

      await AsyncStorage.setItem('devices', JSON.stringify([...devices, newDevice]));
      showToast('устройство было добавлено')
    } else {
      showToast('заполните все поля')
    }
  };

  const getTotalWatts = () => {
    if(plan === 'fixed'){
      return devices.reduce((total, device) => total + device.watts * device.quantity * device.hours, 0);
    } else {
      return devices.reduce((total, device) => total + device.watts * device.quantity * ((device.dayHours/device.nightHours)*10), 0);
    }
    
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  function roundNumber(number) {
    var parts = number.toString().split('.');
    return !parts[1] || parts[1].length <= 2 ? number : number.toFixed(2);
  }

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  }

  return (
    <>
      {loading ? (
        <Loading>
          <ActivityIndicator size="large" color="#0000ff" />
        </Loading>
      ) : (
        <>
          <Container
            isDark={isDark}
            contentContainerStyle={{ flexGrow: 1, padding: 20 }}
            overScrollMode="never"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor]}
                progressBackgroundColor={isDark ? DARK_COLORS.refreshColor : LIGHT_COLORS.refreshColor}
              />
            }
          >
            <SectionText isDark={isDark} style={{fontSize: 20}}>Потребление электричества:</SectionText>
            {/* <Animatable.View // Wrap the Result block with Animatable.View
              animation="slideInDown"
              duration={500}
            > */}
              <Result isDark={isDark}>
                {!price || !currency ? (
                  <ResultHeader isDark={isDark}>
                    <SectionText isDark={isDark}>Выберете цену за квт в настройках</SectionText>
                  </ResultHeader>
                ) : (
                  <>
                    <ResultContainer isResultHide={isResultHide}>
                      <ResultItem style={{borderBottomColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor, borderBottomWidth: 1}}>
                        <ResultHeader isDark={isDark}>
                          <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>В день</SectionText>
                        </ResultHeader>
                        <ResultInfo isDark={isDark}>
                          <SectionText isDark={isDark} style={{fontSize: 14}}>
                            {roundNumber(getTotalWatts() / 1000)} Квт*ч
                          </SectionText>
                          <SectionText isDark={isDark} style={{fontSize: 14}}>
                            {roundNumber((getTotalWatts() / 1000) * price)} {currency}
                          </SectionText>
                        </ResultInfo>
                      </ResultItem>
                      <ResultItem style={{borderBottomColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor, borderBottomWidth: 1}}>
                        <ResultHeader isDark={isDark}>
                          <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>В месяц</SectionText>
                        </ResultHeader>
                        <ResultInfo isDark={isDark}>
                          <SectionText isDark={isDark} style={{fontSize: 14}}>
                            {roundNumber((getTotalWatts() / 1000) * 30)} Квт*ч
                          </SectionText>
                          <SectionText isDark={isDark} style={{fontSize: 14}}>
                            {roundNumber(((getTotalWatts() / 1000) * price) * 30)} {currency}
                          </SectionText>
                        </ResultInfo>
                      </ResultItem>
                      <ResultItem>
                        <ResultHeader isDark={isDark}>
                          <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>В год</SectionText>
                        </ResultHeader>
                        <ResultInfo isDark={isDark}>
                          <SectionText isDark={isDark} style={{fontSize: 14}}>
                            {roundNumber((getTotalWatts() / 1000) * 365)} Квт*ч
                          </SectionText>
                          <SectionText isDark={isDark} style={{fontSize: 14}}>
                            {roundNumber(((getTotalWatts() / 1000) * price) * 365)} {currency}
                          </SectionText>
                        </ResultInfo>
                      </ResultItem>
                    </ResultContainer>
                    <ResultHide onPress={() => setIsResultHide(!isResultHide)}>
                      {isResultHide ? 
                        <Entypo name="chevron-thin-down" size={24} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} />
                        :
                        <Entypo name="chevron-thin-up" size={24} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} />
                      }
                    </ResultHide>
                  </>
                )}
              </Result>
            {/* </Animatable.View> */}
            <AddDevice isDark={isDark}>
              <ButtonComponent title="Добавить электроустройство" onPress={() => setAddDeviceVisible(!addDeviceVisible)} style={{borderWidth: 0}}/>
              {addDeviceVisible &&(
                <ModalContainer>
                  <Input
                    isDark={isDark}
                    placeholder="Имя электроустройства"
                    placeholderTextColor="#808080"
                    value={deviceName}
                    onChangeText={(text) => setDeviceName(text)}
                  />
                  <Input
                    isDark={isDark}
                    placeholder="Ватты"
                    placeholderTextColor="#808080"
                    value={deviceWatts}
                    onChangeText={(text) => setDeviceWatts(text)}
                    keyboardType="numeric"
                  />
                  <Input
                    isDark={isDark}
                    placeholder="Количество"
                    placeholderTextColor="#808080"
                    value={deviceQuantity}
                    onChangeText={(text) => setDeviceQuantity(text)}
                    keyboardType="numeric"
                  />
                  {plan === "fixed" ? (
                    <Input
                      isDark={isDark}
                      placeholder="Время работы в день (часы)"
                      placeholderTextColor="#808080"
                      value={deviceHours}
                      onChangeText={(text) => setDeviceHours(text)}
                      keyboardType="numeric"
                    />
                  ) : (
                    <>
                      <Input
                        isDark={isDark}
                        placeholder="Время работы днем (часы)"
                        placeholderTextColor="#808080"
                        value={dayDeviceHours}
                        onChangeText={(text) => setDayDeviceHours(text)}
                        keyboardType="numeric"
                      />
                      <Input
                        isDark={isDark}
                        placeholder="Время работы ночью (часы)"
                        placeholderTextColor="#808080"
                        value={nightDeviceHours}
                        onChangeText={(text) => setNightDeviceHours(text)}
                        keyboardType="numeric"
                      />
                    </>
                  )}
                  
                  <ButtonComponent title="Добавить" onPress={addDevice} style={{borderWidth: 0, backgroundColor: '#f4511e', marginHorizontal: 10, marginBottom: 10}}/>
                </ModalContainer>
              )}
            </AddDevice>
            
            <SectionText isDark={isDark} style={{marginTop: 20, marginBottom: 10, fontSize: 20}}>Список устройств:</SectionText>

            <ListItems
              devices={devices}
              plan={plan}
              isDark={isDark}
              setDevices={setDevices}
            />

          </Container>
        </>
      )}
    </>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  flex-direction: column;
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;

const ModalContainer = styled.View`
  padding-top: 20px;
`;

const Input = styled.TextInput`
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
  padding: 10px 15px;
  margin: 0 10px;
  margin-bottom: 10px;
  color: ${(props) => props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor};
  background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
`;

const AddDevice = styled.View`
  background-color: ${(props) => props.isDark ? DARK_COLORS.buttonBackgroundColor : LIGHT_COLORS.buttonBackgroundColor};
  border-radius: 10px;
`;

const Result = styled.View`
  position: relative;
  padding: 0 10px;
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
  margin: 15px 0;
`;

const ResultContainer = styled.View`
  ${(props) => props.isResultHide && 'height: 130px;'};
  overflow: hidden;
`;

const ResultItem = styled.View`

`;

const ResultHeader = styled.View`
  padding: 5px 0;
  align-items: center;
  background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
`;

const ResultInfo = styled.View`
  padding: 7px 0;
  flex-direction: row;
  justify-content: space-around;
`;

const ResultHide = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  align-items: center;
  width: 106%;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.2);
`;

const Loading = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default Home;