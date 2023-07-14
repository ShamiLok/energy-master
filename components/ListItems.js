import React from 'react';
import { View, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItems = ({ devices, isDark, setDevices }) => {
  const removeDevice = async (index) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);
    await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));
  };

  const updateQuantity = async (index, newQuantity) => {
    const updatedDevices = [...devices];
    updatedDevices[index].quantity = newQuantity;
    setDevices(updatedDevices);
    await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));
  };

  return (
    <View>
      {devices.length === 0 ? (
        <ListItem>
          <SectionText isDark={isDark}>Устройства еще не были добавлены</SectionText>
        </ListItem>
      ) : (
        <>
          {devices.map((item, index) => (
            <ListItem isDark={isDark} key={index}>
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
            </ListItem>
          ))}
        </>
      )}
    </View>
  );
};

const ListItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  background-color: ${(props) => (props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor)};
  padding: 10px 15px;
  margin-top: 10px;
  border-radius: 10px;
`;

const ListItemQuantity = styled.View`
  flex-direction: column;
`;

const SectionText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;

export default ListItems;
