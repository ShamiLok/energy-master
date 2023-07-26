import React, { useState, useEffect, useContext } from 'react';
import { ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons'; 
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import SectionLoading from '../components/LoadingComponent'
import ContainerComponent from '../components/ContainerComponent';
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
  const [isResultHide, setIsResultHide] = useState(false);

  const { isDark } = useContext(ThemeContext);

  const [ addDeviceHeight, setAddDeviceHeight ] = useState(0)
  const [ resultHeight, setResultHeight ] = useState(0)

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

  const onLayout = (LayoutChangeEvent, value, setvalue) => {
    const layoutHeight = LayoutChangeEvent.nativeEvent.layout.height

    if(layoutHeight > 0 && layoutHeight !== value) {
      setvalue(layoutHeight)
    }
  }

  const addDeviceAnimatedsStyle = useAnimatedStyle(() => {
    const animatedHeight = addDeviceVisible ? withTiming(addDeviceHeight) : withTiming(0)
    return {
      height: animatedHeight,
      overflow: 'hidden'
    }
  })
  
  const resultAnimatedsStyle = useAnimatedStyle(() => {
    const animatedHeight = !isResultHide ? withTiming(resultHeight) : withTiming(120)
    return {
      height: animatedHeight
    }
  })

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
        <SectionLoading isDark={isDark} />
      ) : (
        <ContainerComponent isDark={isDark} loadData={loadData}>
          <SectionText isDark={isDark} style={{fontSize: 20}}>Потребление электричества:</SectionText>
            <Result isDark={isDark}>
              {!price || !currency ? (
                <ResultHeader isDark={isDark}>
                  <SectionText isDark={isDark}>Выберете цену за квт в настройках</SectionText>
                </ResultHeader>
              ) : (
                <>
                  <Animated.View style={[resultAnimatedsStyle]}>
                    <AnimatedContainer onLayout={(event) => onLayout(event, resultHeight, setResultHeight)}>
                      <ResultContainer>
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
                    </AnimatedContainer>
                  </Animated.View>
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
          <SectionText isDark={isDark} style={{ marginBottom: 10, fontSize: 20}}>Список устройств:</SectionText>

          <AddDevice isDark={isDark}>
            <ButtonComponent title="Добавить электроустройство" onPress={() => setAddDeviceVisible(!addDeviceVisible)} style={{borderWidth: 0}}/>

            <Animated.View style={[addDeviceAnimatedsStyle]}>
              <AnimatedContainer onLayout={(event) => onLayout(event, addDeviceHeight, setAddDeviceHeight)}>
                <ModalContainer>
                  <Input
                    isDark={isDark}
                    placeholder="Имя электроустройства"
                    placeholderTextColor="#808080"
                    value={deviceName}
                    onChangeText={(text) => setDeviceName(text)}
                    maxLength={19}
                  />
                  <Input
                    isDark={isDark}
                    placeholder="Ватты"
                    placeholderTextColor="#808080"
                    value={deviceWatts}
                    onChangeText={(text) => setDeviceWatts(text)}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <Input
                    isDark={isDark}
                    placeholder="Количество"
                    placeholderTextColor="#808080"
                    value={deviceQuantity}
                    onChangeText={(text) => setDeviceQuantity(text)}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  {plan === "fixed" ? (
                    <Input
                      isDark={isDark}
                      placeholder="Время работы в день (часы)"
                      placeholderTextColor="#808080"
                      value={deviceHours}
                      onChangeText={(text) => text <= 24 ? setDeviceHours(text) : setDeviceHours('24')}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  ) : (
                    <>
                      <Input
                        isDark={isDark}
                        placeholder="Время работы днем (16 часов макс.)"
                        placeholderTextColor="#808080"
                        value={dayDeviceHours}
                        onChangeText={(text) => text <= 16 ? setDayDeviceHours(text) : setDayDeviceHours('16')}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                      <Input
                        isDark={isDark}
                        placeholder="Время работы ночью (8 часов макс)"
                        placeholderTextColor="#808080"
                        value={nightDeviceHours}
                        onChangeText={(text) => text <= 8 ? setNightDeviceHours(text) : setNightDeviceHours('8')}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </>
                  )}
                  
                  <ButtonComponent title="Добавить" onPress={addDevice} style={{borderWidth: 0, backgroundColor: '#f4511e', marginHorizontal: 10, marginBottom: 10}}/>
                </ModalContainer>
              </AnimatedContainer>
            </Animated.View>
          </AddDevice>

          <ListItems
            devices={devices}
            plan={plan}
            isDark={isDark}
            setDevices={setDevices}
          />

        </ContainerComponent>
      )}
    </>
  );
};

const AnimatedContainer = styled.View`
position: absolute;
width: 100%;
`;

const ModalContainer = styled.View`
  padding-top: 20px;
  /* position: absolute; */
  width: 100%;
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
  margin-bottom: 10px;
`;

const Result = styled.View`
  position: relative;
  padding: 0 10px;
  /* padding-bottom: 25px; */
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
  margin: 10px 0;
`;

const ResultContainer = styled.View`
  margin-bottom: 25px;
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

export default Home;