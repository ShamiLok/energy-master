import React, { useState, useEffect, useContext, useRef } from 'react';
import { ActivityIndicator, RefreshControl, Alert, Switch, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';

import ButtonComponent from '../components/Button';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

export default function Settings() {
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const textInputRef = useRef(null);

  const { isDark, handleIsDark } = useContext(ThemeContext);
  const pickerRef = useRef(false);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const savedCurrency = await AsyncStorage.getItem('currency');
      const savedPrice = await AsyncStorage.getItem('price');
      setCurrency(savedCurrency);
      setPrice(savedPrice);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrencyChange = async (value) => {
    setCurrency(value);
    await AsyncStorage.setItem('currency', value);
  };

  const handlePriceChange = async (text) => {
    setPrice(text);
    await AsyncStorage.setItem('price', text);
  };

  const handleDefault = () => {
    Alert.alert('Сброс настроек', 'Вы уверены, что хотите сбросить настройки?', [
      {
        text: 'Да',
        onPress: () => handleResetConfirmation(),
      },
      {
        text: 'Нет',
        style: 'cancel',
      },
    ]);
  };

  const handleResetConfirmation = async () => {
    await AsyncStorage.clear();
    loadData();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleChangeColorTheme = (isTrue) => {
    handleIsDark(!isDark);
  };

  const handleTextInputFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handlePickerFocus = () => {
    if (textInputRef.current) {
      pickerRef.current.focus();
    }
    
  }

  return (
    <Container isDark={isDark}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <FormItem 
            isDark={isDark} 
            onPress={handlePickerFocus}
          >
            <Label isDark={isDark}>Select currency:</Label>
            <PickerContainer isDark={isDark}>
              <Picker
                style={{ color: isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor, paddingHorizontal: 60}}
                selectedValue={currency}
                onValueChange={handleCurrencyChange}
                dropdownIconColor={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
                ref={pickerRef}
              >
                <Picker.Item label="EUR" value="EUR" />
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="RUB" value="RUB" />
              </Picker>
            </PickerContainer>
          </FormItem>
          <FormItem 
            isDark={isDark}
            onPress={handleTextInputFocus}
          >
            <Label isDark={isDark}>Enter the price per kWh:</Label>
            <Input
              isDark={isDark}
              value={price}
              onChangeText={handlePriceChange}
              keyboardType="numeric"
              ref={textInputRef}
            />
          </FormItem>
          <FormItem
            isDark={isDark}
            onPress={handleChangeColorTheme}
          >
            <Label isDark={isDark}>Темная тема</Label>
            <Switch
              value={isDark}
              onValueChange={handleChangeColorTheme}
            />
          </FormItem>
          
          <ButtonComponent title="Сбросить настройки" onPress={handleDefault} />
          
        </ScrollView>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => (props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor)};
`;
const FormItem = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
  padding: 10px 15px;
  border-radius: 10px;
`;
const Label = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;
const PickerContainer = styled.View`
  /* border: 1px solid ${(props) => (props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor)}; */
  /* border-radius: 10px; */
`;
const Input = styled.TextInput`
  font-size: 16px;
  padding: 5px 10px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;
