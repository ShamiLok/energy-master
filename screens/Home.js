import React, { useState, useContext } from 'react';
import { ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import ContainerComponent from '../components/ContainerComponent';
import ButtonComponent from '../components/Button';
import SectionText from '../components/SectionText';
import ListItems from '../components/ListItems';

import { i18n } from '../localizations/i18n';

import { FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'; 

const Home = () => {
  const { 
    isDark,
    currency,
    price,
    plan,
    devices, setDevices,
    loadData
  } = useContext(ThemeContext);

  const [editIndex, setEditIndex] = useState(-1);
  
  const [deviceName, setDeviceName] = useState('');
  const [deviceWatts, setDeviceWatts] = useState('');
  const [deviceQuantity, setDeviceQuantity] = useState('');
  const [deviceHours, setDeviceHours] = useState('');
  const [dayDeviceHours, setDayDeviceHours] = useState('');
  const [nightDeviceHours, setNightDeviceHours] = useState('');

  const [addDeviceVisible, setAddDeviceVisible] = useState(false);
  const [isResultHide, setIsResultHide] = useState(false);

  const [ addDeviceHeight, setAddDeviceHeight ] = useState(0)
  const [ resultHeight, setResultHeight ] = useState(0)

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
    const animatedHeight = isResultHide ? withTiming(resultHeight) : withTiming(120)
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
      setDayDeviceHours('');
      setNightDeviceHours('')

      await AsyncStorage.setItem('devices', JSON.stringify([...devices, newDevice]));
      showToast(i18n.t('deviceAdded'))
    } else {
      showToast(i18n.t('fillFields'))
    }
  };

  const getDaykWh = () => {
    if(plan === 'fixed'){
      return devices.reduce((total, device) => total + device.watts * device.quantity * device.hours, 0) / 1000;
    } else {
      return devices.reduce((total, device) => total + device.quantity * (device.watts * device.dayHours / 1000 + device.watts * device.nightHours / 1000), 0);
    }
  };

  const getDayPrice = () => {
    if(plan === 'fixed'){
      return devices.reduce((total, device) => total + device.quantity * (device.watts * device.hours / 1000 * price), 0);
    } else {
      return devices.reduce((total, device) => total + device.quantity * (device.watts * device.dayHours / 1000 * price[0] + device.watts * device.nightHours / 1000 * price[1]), 0);
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

  const handleRefresh = () => {
    setAddDeviceVisible(false)
    setIsResultHide(false)
    loadData()
    setEditIndex(-1)
  }
 
  const validCheck = (text) => {
    let s = text
    if(s.length > 1){
      while(s.charAt(0) === '0'){
        s = s.substring(1);
      }
    }
    return s
  }

  return (
    <ContainerComponent isDark={isDark} loadData={handleRefresh}>
      <SectionText isDark={isDark} style={{fontSize: 20}}>{i18n.t('consumption')}</SectionText>
        <Result isDark={isDark}>
          <Animated.View style={[resultAnimatedsStyle]}>
            <AnimatedContainer onLayout={(event) => onLayout(event, resultHeight, setResultHeight)}>
              <ResultContainer>
                <ResultItem style={{borderBottomColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor, borderBottomWidth: 1}}>
                  <ResultHeader isDark={isDark}>
                    <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>{i18n.t('perDay')}</SectionText>
                  </ResultHeader>
                  <ResultInfo isDark={isDark}>
                    <ResultInfoItem>
                      <IconContainer>
                        <MaterialCommunityIcons name="lightning-bolt" size={15} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor}/>
                      </IconContainer>
                      <SectionText isDark={isDark} style={{fontSize: 14}}>
                        {roundNumber(getDaykWh())} kW⋅h
                      </SectionText>
                    </ResultInfoItem>
                    <ResultInfoItem>
                      <IconContainer>
                        <FontAwesome5 name="coins" size={11} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} style={{paddingHorizontal: 2}}/> 
                      </IconContainer>
                      <SectionText isDark={isDark} style={{fontSize: 14}}>
                        {roundNumber(getDayPrice())} {currency}
                      </SectionText>
                    </ResultInfoItem>
                  </ResultInfo>
                </ResultItem>
                <ResultItem style={{borderBottomColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor, borderBottomWidth: 1}}>
                  <ResultHeader isDark={isDark}>
                    <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>{i18n.t('perMonth')}</SectionText>
                  </ResultHeader>
                  <ResultInfo isDark={isDark}>
                    <ResultInfoItem>
                      <IconContainer>
                        <MaterialCommunityIcons name="lightning-bolt" size={15} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor}/>
                      </IconContainer>
                      <SectionText isDark={isDark} style={{fontSize: 14}}>
                        {roundNumber(getDaykWh() * 30)} kW⋅h
                      </SectionText>
                    </ResultInfoItem>
                    <ResultInfoItem>
                      <IconContainer>
                        <FontAwesome5 name="coins" size={11} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} style={{paddingHorizontal: 2}}/> 
                      </IconContainer>
                      <SectionText isDark={isDark} style={{fontSize: 14}}>
                        {roundNumber(getDayPrice() * 30)} {currency}
                      </SectionText>
                    </ResultInfoItem>
                  </ResultInfo>
                </ResultItem>
                <ResultItem>
                  <ResultHeader isDark={isDark}>
                    <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>{i18n.t('perYear')}</SectionText>
                  </ResultHeader>
                  <ResultInfo isDark={isDark}>
                    <ResultInfoItem>
                      <IconContainer>
                        <MaterialCommunityIcons name="lightning-bolt" size={15} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor}/>
                      </IconContainer>
                      <SectionText isDark={isDark} style={{fontSize: 14}}>
                        {roundNumber(getDaykWh() * 365)} kW⋅h
                      </SectionText>
                    </ResultInfoItem>
                    <ResultInfoItem>
                      <IconContainer>
                        <FontAwesome5 name="coins" size={11} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} style={{paddingHorizontal: 2}}/> 
                      </IconContainer>
                      <SectionText isDark={isDark} style={{fontSize: 14}}>
                        {roundNumber(getDayPrice() * 365)} {currency}
                      </SectionText>
                    </ResultInfoItem>
                  </ResultInfo>
                </ResultItem>
              </ResultContainer>
            </AnimatedContainer>
          </Animated.View>
          <ResultHide onPress={() => setIsResultHide(!isResultHide)}>
            {!isResultHide ? 
              <Entypo name="chevron-thin-down" size={24} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} />
              :
              <Entypo name="chevron-thin-up" size={24} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} />
            }
          </ResultHide>
        </Result>
      <SectionText isDark={isDark} style={{ marginBottom: 10, fontSize: 20}}>{i18n.t('deviceList')}</SectionText>

      <AddDevice isDark={isDark}>
        <ButtonComponent title={i18n.t('addDevice')} onPress={() => setAddDeviceVisible(!addDeviceVisible)} style={{borderWidth: 0}}/>

        <Animated.View style={[addDeviceAnimatedsStyle]}>
          <AnimatedContainer onLayout={(event) => onLayout(event, addDeviceHeight, setAddDeviceHeight)}>
            <ModalContainer>
              <Input
                isDark={isDark}
                placeholder={i18n.t('deviceName')}
                placeholderTextColor="#808080"
                value={deviceName}
                onChangeText={(text) => setDeviceName(text)}
                maxLength={19}
                onSubmitEditing={() => { this.secondAddDeviceTextInput.focus(); }}
              />
              <Input
                isDark={isDark}
                placeholder={i18n.t('watts')}
                placeholderTextColor="#808080"
                value={deviceWatts}
                onChangeText={(text) => setDeviceWatts(validCheck(text))}
                keyboardType="numeric"
                maxLength={5}
                ref={(input) => { this.secondAddDeviceTextInput = input; }}
                onSubmitEditing={() => { this.thirdAddDeviceTextInput.focus(); }}
              />
              <Input
                isDark={isDark}
                placeholder={i18n.t('quantity')}
                placeholderTextColor="#808080"
                value={deviceQuantity}
                onChangeText={(text) => setDeviceQuantity(validCheck(text))}
                keyboardType="numeric"
                maxLength={5}
                ref={(input) => { this.thirdAddDeviceTextInput = input; }}
                onSubmitEditing={() => { this.forthAddDeviceTextInput.focus(); }}
              />
              {plan === "fixed" ? (
                <Input
                  isDark={isDark}
                  placeholder={i18n.t('workingHours')}
                  placeholderTextColor="#808080"
                  value={deviceHours}
                  onChangeText={(text) => text <= 24 ? setDeviceHours(validCheck(text)) : setDeviceHours('24')}
                  keyboardType="numeric"
                  maxLength={2}
                  ref={(input) => { this.forthAddDeviceTextInput = input; }}
                />
              ) : (
                <>
                  <Input
                    isDark={isDark}
                    placeholder={i18n.t('peakHours')}
                    placeholderTextColor="#808080"
                    value={dayDeviceHours}
                    onChangeText={(text) => text <= 16 ? setDayDeviceHours(validCheck(text)) : setDayDeviceHours('16')}
                    keyboardType="numeric"
                    maxLength={2}
                    ref={(input) => { this.forthAddDeviceTextInput = input; }}
                    onSubmitEditing={() => { this.fifthAddDeviceTextInput.focus(); }}
                  />
                  <Input
                    isDark={isDark}
                    placeholder={i18n.t('offPeakHours')}
                    placeholderTextColor="#808080"
                    value={nightDeviceHours}
                    onChangeText={(text) => text <= 8 ? setNightDeviceHours(validCheck(text)) : setNightDeviceHours('8')}
                    keyboardType="numeric"
                    maxLength={2}
                    ref={(input) => { this.fifthAddDeviceTextInput = input; }}
                  />
                </>
              )}
              
              <ButtonComponent title={i18n.t('add')} onPress={addDevice} style={{borderWidth: 0, backgroundColor: '#f4511e', marginHorizontal: 10, marginBottom: 10}} textColor="#fff" />
            </ModalContainer>
          </AnimatedContainer>
        </Animated.View>
      </AddDevice>
      
      {devices.length === 0 ? (
        <DeviceListEmpty>
          <MaterialCommunityIcons name="text-search" size={34} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} style={{paddingBottom: 8}}/> 
          <SectionText isDark={isDark}>{i18n.t('deviceListEmpty')}</SectionText>
        </DeviceListEmpty>
      ) : (
        <ListItems
          devices={devices}
          plan={plan}
          isDark={isDark}
          setDevices={setDevices}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
        />
      )}

    </ContainerComponent>
  );
};

const DeviceListEmpty = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const AnimatedContainer = styled.View`
position: absolute;
width: 100%;
`;

const ModalContainer = styled.View`
  padding-top: 20px;
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
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.buttonBorderColor : LIGHT_COLORS.buttonBorderColor};
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Result = styled.View`
  position: relative;
  padding: 0 10px;
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
  justify-content: space-between;
`;

const ResultInfoItem = styled.View`
  flex-direction: row;
`;

const IconContainer = styled.View`
  margin-right: 4px;
  justify-content: center;
  align-items: center;
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