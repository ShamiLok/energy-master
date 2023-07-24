import React, { useState, useEffect, useContext, useRef } from 'react';
import { Alert, Switch, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import SwitchSelector from "react-native-switch-selector";
import { getLocales } from 'expo-localization';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import ItemSection from '../components/ItemSection'
import SectionText from '../components/SectionText';
import ButtonComponent from '../components/Button';
import ContainerComponent from '../components/ContainerComponent';
import SectionLoading from '../components/LoadingComponent'

function Settings() {
  const { isDark, handleIsDark } = useContext(ThemeContext);

  const [language, setLanguage] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const [plan, setPlan] = useState('');
  const [dayPrice, setDayPrice] = useState('');
  const [nightPrice, setNightPrice] = useState('');

  const fixedTextInputRef = useRef(null);
  const pickerLanguageRef = useRef(false);
  const pickerCurrencyRef = useRef(false);
  const dayTextInputRef = useRef(null);
  const nightTextInputRef = useRef(null);

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

  const handlePlanChange = async (plan) => {
    setPlan(plan)
    await AsyncStorage.setItem('plan', plan);
    await AsyncStorage.removeItem('devices');
  }

  const handlePriceChange = async (text, type) => {
    if(type === 'fixed'){
      setPrice(text);
      await AsyncStorage.setItem('price', text);
    } else if(type === 'dual-day'){
      setDayPrice(text)
      await AsyncStorage.setItem('dayPrice', text);
    } else {
      setNightPrice(text)
      await AsyncStorage.setItem('nightPrice', text);
    }
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

  const handleChangeColorTheme = () => {
    handleIsDark(!isDark);
  };

  const handleFocus = (refHook) => {
    refHook.current.focus();
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
          <ItemSection 
            isDark={isDark} 
            onPress={() => handleFocus(pickerLanguageRef)}
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
            onPress={() => handleFocus(pickerCurrencyRef)}
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
          <SectionText isDark={isDark}>Выберете тарифный план:</SectionText>
          <SwitchSelector
            initial={plan == 'dual' ? 1 : 0}
            style={{marginBottom: 10}}
            onPress={handlePlanChange}
            textColor={isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor}
            buttonColor={"#f4511e"}
            backgroundColor={isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor}
            borderColor={isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor}
            fontSize={12}
            hasPadding
            options={[
              { label: "Однотарифный", value: "fixed"},
              { label: "Двухтарифный", value: "dual"},
              // { label: "Трехтарифный", value: "triple"}
            ]}
          />
          {plan === "fixed" ? (
            <ItemSection 
              isDark={isDark}
              onPress={() => handleFocus(fixedTextInputRef)}
              style={{height: 60}}
            >
              <SectionText isDark={isDark}>Цена за Кв*ч:</SectionText>
              <Input
                isDark={isDark}
                value={price}
                onChangeText={(text) => handlePriceChange(text, 'fixed')}
                ref={fixedTextInputRef}
                keyboardType="numeric"
                maxLength={15}
              />
            </ItemSection>
          ) : (
            <>
              <SectionText isDark={isDark}>Цена за Кв*ч:</SectionText>
              <ItemSection
                isDark={isDark}
                onPress={() => handleFocus(dayTextInputRef)}
                style={{height: 60}}
              >
                <SectionText isDark={isDark}>День(7:00-23:00):</SectionText>
                <Input
                  isDark={isDark}
                  value={dayPrice}
                  onChangeText={(text) => handlePriceChange(text, 'dual-day')}
                  ref={dayTextInputRef}
                  keyboardType="numeric"
                  maxLength={15}
                />
              </ItemSection>
              <ItemSection
                isDark={isDark}
                onPress={() => handleFocus(nightTextInputRef)}
                style={{height: 60}}
              >
                <SectionText isDark={isDark}>Ночь(23:00-7:00):</SectionText>
                <Input
                  isDark={isDark}
                  value={nightPrice}
                  onChangeText={(text) => handlePriceChange(text, 'dual-night')}
                  ref={nightTextInputRef}
                  keyboardType="numeric"
                  maxLength={15}
                />
              </ItemSection>
            </>
          )}
          
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
          
        </ContainerComponent>
      )}
    </>
  );
}

const Input = styled.TextInput`
  font-size: 16px;
  padding: 5px 10px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;

export default Settings;