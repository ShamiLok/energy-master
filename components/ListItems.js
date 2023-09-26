import React, { useState } from 'react';
import { View, TextInput, ToastAndroid } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ItemSection from './ItemSection';
import SectionText from './SectionText';

import { i18n } from '../localizations/i18n'

const ListItems = ({ devices, plan, isDark, setDevices, editIndex, setEditIndex }) => {
  const [editedName, setEditedName] = useState('');
  const [editedWatts, setEditedWatts] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedHours, setEditedHours] = useState('');
  const [editedDayHours, setEditedDayHours] = useState('');
  const [editedNightHours, setEditedNightHours] = useState('');

  const removeDevice = async (index) => {
    editIndex === index && setEditIndex(-1)
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);
    await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));
    showToast(i18n.t('deviceDeleted'))
  };
  
  const editDevice = async (index) => {
    if (editIndex === index) {
      if (editedName && editedWatts && editedQuantity && (editedHours || (editedDayHours && editedNightHours))) {
        const updatedDevices = [...devices];
        updatedDevices[index].name = editedName;
        updatedDevices[index].watts = editedWatts;
        updatedDevices[index].quantity = editedQuantity;
        updatedDevices[index].hours = editedHours;
        updatedDevices[index].dayHours = editedDayHours;
        updatedDevices[index].nightHours = editedNightHours;
        setDevices(updatedDevices);
        await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));
        setEditIndex(-1)
      } else {
        showToast(i18n.t('fillFields'))
      }
      
    } else {
      setEditIndex(index);
      const device = devices[index];
      setEditedName(device.name);
      setEditedWatts(device.watts);
      setEditedQuantity(device.quantity);
      setEditedHours(device.hours);
      setEditedDayHours(device.dayHours);
      setEditedNightHours(device.nightHours)
    }
  };

  const updateQuantity = async (index, newQuantity) => {
    const updatedDevices = [...devices];
    updatedDevices[index].quantity = newQuantity;
    setDevices(updatedDevices);
    await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));
  };

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  }
  
  const hoursFormat = (hours) => {
    if(hours == 1) {
      return i18n.t('hour')
    } else {
      return i18n.t('hours')
    }
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
    <View>
      {devices.map((item, index) => (
        <ListItemsContainer key={index} isDark={isDark}>
          <ItemSection isDark={isDark} style={{position: 'relative', paddingBottom: 0}}>
            <View>
              <SectionText isDark={isDark} style={{fontSize: 18, textTransform: 'uppercase'}}>{item.name}</SectionText>
              {plan === 'fixed' ? (
                <>
                  <SectionText isDark={isDark}>
                    {item.watts} {i18n.t('watt')}
                  </SectionText>
                  <SectionText isDark={isDark}>
                    {item.hours} {hoursFormat(item.hours)}
                  </SectionText>
                </>
              ) : (
              <>
                <SectionText isDark={isDark}>
                  {item.watts} {i18n.t('watt')}
                </SectionText>
                <SectionText isDark={isDark}>
                  {item.dayHours} {hoursFormat(item.dayHours)} {i18n.t('day')}
                </SectionText>
                <SectionText isDark={isDark}>
                  {item.nightHours} {hoursFormat(item.nightHours)} {i18n.t('night')}
                </SectionText>
              </>
              )}
            </View>

            <ListItemQuantity plan={plan}>
              <TextInput
                style={{ color: isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor }}
                value={item.quantity.toString()}
                onChangeText={(newQuantity) => updateQuantity(index, validCheck(newQuantity))}
                keyboardType="numeric"
                maxLength={5}
              />
              <SectionText isDark={isDark} style={{fontSize: 14}}> {i18n.t('quantityUnit')}</SectionText>
            </ListItemQuantity>

            <ListItemEdit>
              {editIndex === index ? (
                <Feather
                  name="check"
                  size={24}
                  color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
                  onPress={() => editDevice(index)}
                />
              ) : (
                <Feather
                  name="edit-3"
                  size={19}
                  color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
                  onPress={() => editDevice(index)}
                />
              )}
              <MaterialCommunityIcons
                name="window-close"
                size={24}
                color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
                onPress={() => removeDevice(index)}
              />
            </ListItemEdit>
            
          </ItemSection>
          {editIndex === index && (
            <View>
              <SectionEdit>
                <SectionText isDark={isDark} style={{fontSize: 12}}>{i18n.t('deviceName')}</SectionText>
                <Input
                  placeholder={i18n.t('deviceName')}
                  placeholderTextColor="#808080"
                  value={editedName}
                  onChangeText={setEditedName}
                  isDark={isDark}
                  onSubmitEditing={() => { this.secondEditTextInput.focus(); }}
                  maxLength={19}
                />
              </SectionEdit>
              <SectionEdit>
                <SectionText isDark={isDark} style={{fontSize: 12}}>{i18n.t('watts')}</SectionText>
                <Input
                  placeholder={i18n.t('watts')}
                  placeholderTextColor="#808080"
                  value={editedWatts}
                  onChangeText={(text) => setEditedWatts(validCheck(text))}
                  isDark={isDark}
                  keyboardType="numeric"
                  ref={(input) => { this.secondEditTextInput = input; }}
                  onSubmitEditing={() => { this.thirdEditTextInput.focus(); }}
                  maxLength={5}
                />
              </SectionEdit>
              <SectionEdit>
                <SectionText isDark={isDark} style={{fontSize: 12}}>{i18n.t('quantity')}</SectionText>
                <Input
                  placeholder={i18n.t('quantity')}
                  placeholderTextColor="#808080"
                  value={editedQuantity}
                  onChangeText={(text) => setEditedQuantity(validCheck(text))}
                  isDark={isDark}
                  keyboardType="numeric"
                  ref={(input) => { this.thirdEditTextInput = input; }}
                  onSubmitEditing={() => { this.forthEditTextInput.focus(); }}
                  maxLength={5}
                />
              </SectionEdit>
              
              {plan === 'fixed' ? (
                <SectionEdit>
                  <SectionText isDark={isDark} style={{fontSize: 12}}>{i18n.t('workingHours')}</SectionText>
                  <Input
                    placeholder={i18n.t('workingHours')}
                    placeholderTextColor="#808080"
                    value={editedHours}
                    onChangeText={(text) => text <= 24 ? setEditedHours(validCheck(text)) : setEditedHours('24')}
                    isDark={isDark}
                    keyboardType="numeric"
                    ref={(input) => { this.forthEditTextInput = input; }}
                    maxLength={2}
                  />
                </SectionEdit>
                
              ) : (
                <>
                  <SectionEdit>
                    <SectionText isDark={isDark} style={{fontSize: 12}}>{i18n.t('peakHours')}</SectionText>
                    <Input
                      placeholder={i18n.t('peakHours')}
                      placeholderTextColor="#808080"
                      value={editedDayHours}
                      onChangeText={(text) => text <= 16 ? setEditedDayHours(validCheck(text)) : setEditedDayHours('16')}
                      isDark={isDark}
                      keyboardType="numeric"
                      ref={(input) => { this.forthEditTextInput = input; }}
                      onSubmitEditing={() => { this.fifthEditTextInput.focus(); }}
                      maxLength={2}
                    />
                  </SectionEdit>
                  <SectionEdit>
                    <SectionText isDark={isDark} style={{fontSize: 12}}>{i18n.t('offPeakHours')}</SectionText>
                    <Input
                      placeholder={i18n.t('offPeakHours')}
                      placeholderTextColor="#808080"
                      value={editedNightHours}
                      onChangeText={(text) => text <= 8 ? setEditedNightHours(validCheck(text)) : setEditedNightHours('8')}
                      isDark={isDark}
                      keyboardType="numeric"
                      ref={(input) => { this.fifthEditTextInput = input; }}
                      maxLength={2}
                    />
                  </SectionEdit>
                  
                  
                </>
              )}
              
            </View>
          )}
        
        </ListItemsContainer>
      ))}
    </View>
  );
};

const ListItemsContainer = styled.View`
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  background-color: ${(props) => (props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor)};
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ListItemQuantity = styled.View`
  flex-direction: row;
  position: absolute;
  right: 100px;
  top: ${(props) => (props.plan === 'fixed' ? '30px' : '42px')};
  align-items: center;
`;

const ListItemEdit = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 60px;
  align-items: center;
`;

const SectionEdit = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0 10px 10px 10px;
  justify-content: space-between;
`;

const Input = styled.TextInput`
  /* flex: 1; */
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
  padding: 10px 15px;
  margin-left: 10px;
  color: ${(props) => props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor};
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
  width: 180px;
`;


export default ListItems;
