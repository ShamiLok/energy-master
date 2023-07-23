import React, { useState, useEffect, useContext, useRef } from 'react';
import { ActivityIndicator, RefreshControl, Alert, Switch, ScrollView, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import ItemSection from '../components/ItemSection'
import SectionText from '../components/SectionText';
import ButtonComponent from '../components/Button';
import { getLocales } from 'expo-localization';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

export default function Settings() {
  const [language, setLanguage] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const textInputRef = useRef(null);

  const { isDark, handleIsDark } = useContext(ThemeContext);
  const pickerLanguageRef = useRef(false);
  const pickerCurrencyRef = useRef(false);

  const [{ currencyCode, languageCode }] = getLocales();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const savedCurrency = await AsyncStorage.getItem('currency');
      const savedLangugae = await AsyncStorage.getItem('language');
      const savedPrice = await AsyncStorage.getItem('price');
      if (!savedCurrency) {
        setCurrency(currencyCode);
        await AsyncStorage.setItem('currency', currencyCode);
      } else {
        setCurrency(savedCurrency);
      }
      if (!savedLangugae) {
        setLanguage(languageCode);
        await AsyncStorage.setItem('langugage', languageCode);
      } else {
        setLanguage(savedLangugae);
      }
      setPrice(savedPrice);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrencyChange = async (value) => {
    setCurrency(value);
    await AsyncStorage.setItem('currency', value);
    showToast(`Выбрана валюта ${value}`)
  };

  const handleLanguageChange = async (value) => {
    setLanguage(value);
    await AsyncStorage.setItem('language', value);
    showToast(`Установлен ${value} язык`)
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
    showToast('Настройки были сброшены')
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleChangeColorTheme = () => {
    handleIsDark(!isDark);
  };

  const handleTextInputFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handlePickerLanguageFocus = () => {
    if (textInputRef.current) {
      pickerLanguageRef.current.focus();
    }
  }

  const handlePickerCurrencyFocus = () => {
    if (textInputRef.current) {
      pickerCurrencyRef.current.focus();
    }
  }

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
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
          <ItemSection 
            isDark={isDark} 
            onPress={handlePickerLanguageFocus}
            style={{height: 60}}
          >
            <SectionText isDark={isDark}>Language:</SectionText>
            <Picker
              style={{ color: isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor, paddingHorizontal: 80}}
              selectedValue={language}
              onValueChange={handleLanguageChange}
              dropdownIconColor={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
              ref={pickerLanguageRef}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Russian" value="ru" />
              <Picker.Item label="German" value="de" />
            </Picker>
          </ItemSection>
          <ItemSection 
            isDark={isDark} 
            onPress={handlePickerCurrencyFocus}
            style={{height: 60}}
          >
            <SectionText isDark={isDark}>Currency:</SectionText>
            <Picker
              style={{ color: isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor, paddingHorizontal: 60}}
              selectedValue={currency}
              onValueChange={handleCurrencyChange}
              dropdownIconColor={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}
              ref={pickerCurrencyRef}
            >
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="RUB" value="RUB" />
            </Picker>
          </ItemSection>
          <ItemSection 
            isDark={isDark}
            onPress={handleTextInputFocus}
            style={{height: 60}}
          >
            <SectionText isDark={isDark}>Enter the price per kWh:</SectionText>
            <Input
              isDark={isDark}
              value={price}
              onChangeText={handlePriceChange}
              keyboardType="numeric"
              ref={textInputRef}
            />
          </ItemSection>
          <ItemSection
            isDark={isDark}
            onPress={handleChangeColorTheme}
            style={{height: 60}}
          >
            <SectionText isDark={isDark}>Темная тема</SectionText>
            <Switch
              value={isDark}
              onValueChange={handleChangeColorTheme}
            />
          </ItemSection>
          
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
const Input = styled.TextInput`
  font-size: 16px;
  padding: 5px 10px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;
