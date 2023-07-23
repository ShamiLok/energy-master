import React from 'react';
import { View, TextInput, ToastAndroid } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ItemSection from './ItemSection';

const ListItems = ({ devices, isDark, setDevices }) => {
  const removeDevice = async (index) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);
    await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));
    showToast('устроqство было удалено')
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

  return (
    <View>
      {devices.length === 0 ? (
        <ItemSection isDark={isDark}>
          <SectionText isDark={isDark}>Устройства еще не были добавлены</SectionText>
        </ItemSection>
      ) : (
        <>
          {devices.map((item, index) => (
            <ItemSection isDark={isDark} key={index} style={{position: 'relative'}}>
              <View>
                <SectionText isDark={isDark}>{item.name}</SectionText>
                <SectionText isDark={isDark}>
                  {item.watts} ватт, {item.hours} {item.hours === 1 ? 'час' : 'часа'}
                </SectionText>
              </View>
              <ListItemQuantity>
                <TextInput
                  style={{ color: isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor }}
                  value={item.quantity.toString()}
                  onChangeText={(newQuantity) => updateQuantity(index, newQuantity)}
                  keyboardType="numeric"
                />
                <SectionText isDark={isDark}>шт</SectionText>
              </ListItemQuantity>

              <MaterialCommunityIcons
                name="window-close"
                size={24}
                color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
                onPress={() => removeDevice(index)}
              />
            </ItemSection>
          ))}
        </>
      )}
    </View>
  );
};

const ListItemQuantity = styled.View`
  flex-direction: column;
  position: absolute;
  right: 80px;
`;

const SectionText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;

export default ListItems;
