import React, { useState } from 'react';
import { View, TextInput, ToastAndroid } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ItemSection from './ItemSection';

const ListItems = ({ devices, plan, isDark, setDevices }) => {
  const [editIndex, setEditIndex] = useState(-1);
  
  const [editedName, setEditedName] = useState('');
  const [editedWatts, setEditedWatts] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedHours, setEditedHours] = useState('');
  const [editedDayHours, setEditedDayHours] = useState('');
  const [editedNightHours, setEditedNightHours] = useState('');

  const removeDevice = async (index) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);
    await AsyncStorage.setItem('devices', JSON.stringify(updatedDevices));
    showToast('устроqство было удалено')
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
        showToast('Заполните все поля')
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
      return 'час'
    } else if (hours < 5) {
      return 'часа'
    } else {
      return 'часов'
    }
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
            <ListItemsContainer key={index} isDark={isDark}>
              <ItemSection isDark={isDark} style={{position: 'relative', paddingBottom: 0}}>
                <View>
                  <SectionText isDark={isDark}>{item.name}</SectionText>
                  {plan === 'fixed' ? (
                    <SectionText isDark={isDark}>
                      {item.watts} ватт, {item.hours} {hoursFormat(item.hours)}
                    </SectionText>
                  ) : (
                  <>
                    <SectionText isDark={isDark}>
                      {item.watts} ватт
                    </SectionText>
                    <SectionText isDark={isDark}>
                      {item.dayHours} {hoursFormat(item.dayHours)} днем
                    </SectionText>
                    <SectionText isDark={isDark}>
                      {item.nightHours} {hoursFormat(item.nightHours)} ночью
                    </SectionText>
                  </>
                  )}
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

                <ListItemEdit>
                {editIndex === index ? (
                    <Feather
                      name="check"
                      size={20}
                      color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
                      onPress={() => editDevice(index)}
                    />
                  ) : (
                    <Feather
                      name="edit-3"
                      size={20}
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
                  <Input
                    placeholder='Имя электроустройства'
                    placeholderTextColor="#808080"
                    value={editedName}
                    onChangeText={setEditedName}
                    isDark={isDark}
                  />
                  <Input
                    placeholder="Ватты"
                    placeholderTextColor="#808080"
                    value={editedWatts}
                    onChangeText={setEditedWatts}
                    isDark={isDark}
                    keyboardType="numeric"
                  />
                  <Input
                    placeholder="Количество"
                    placeholderTextColor="#808080"
                    value={editedQuantity}
                    onChangeText={setEditedQuantity}
                    isDark={isDark}
                    keyboardType="numeric"
                  />
                  {plan === 'fixed' ? (
                    <Input
                      placeholder="Время работы в день (часы)"
                      placeholderTextColor="#808080"
                      value={editedHours}
                      onChangeText={(text) => text <= 24 ? setEditedHours(text) : setEditedHours('24')}
                      isDark={isDark}
                    />
                  ) : (
                    <>
                      <Input
                        placeholder="Время работы днем (16 часов макс.)"
                        placeholderTextColor="#808080"
                        value={editedDayHours}
                        onChangeText={(text) => text <= 16 ? setEditedDayHours(text) : setEditedDayHours('16')}
                        isDark={isDark}
                        keyboardType="numeric"
                      />
                      <Input
                        placeholder="Время работы ночью (8 часов макс)"
                        placeholderTextColor="#808080"
                        value={editedNightHours}
                        onChangeText={(text) => text <= 8 ? setEditedNightHours(text) : setEditedNightHours('8')}
                        isDark={isDark}
                        keyboardType="numeric"
                      />
                    </>
                  )}
                  
                </View>
              )}
            
            </ListItemsContainer>
          ))}
        </>
      )}
    </View>
  );
};

const ListItemsContainer = styled.View`
  background-color: ${(props) => (props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor)};
  border-radius: 10px;
  margin-bottom: 10px;
  padding-bottom: 5px;
`;

const ListItemQuantity = styled.View`
  flex-direction: column;
  position: absolute;
  right: 100px;
`;

const ListItemEdit = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 60px;
`;

const SectionText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;

const Input = styled.TextInput`
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
  padding: 10px 15px;
  margin: 5px 10px;
  color: ${(props) => props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor};
  background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
`;

export default ListItems;
