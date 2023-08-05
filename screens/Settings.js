import React, { useContext, useRef } from 'react';
import { Alert, Switch, ToastAndroid, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import ItemSection from '../components/ItemSection'
import SectionText from '../components/SectionText';
import ButtonComponent from '../components/Button';
import ContainerComponent from '../components/ContainerComponent';

import { i18n } from '../localizations/i18n';

function Settings() {
  const { 
    isDark, handleIsDark,
    language, setLanguage,
    currency, setCurrency,
    price, setPrice,
    plan, setPlan,
    dayPrice, setDayPrice,
    nightPrice, setNightPrice,
    setDevices,
    loadData,
  } = useContext(ThemeContext);

  const fixedTextInputRef = useRef(null);
  const pickerLanguageRef = useRef(false);
  const pickerCurrencyRef = useRef(false);
  const pickerPlanRef = useRef(false);
  const dayTextInputRef = useRef(null);
  const nightTextInputRef = useRef(null);

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
    setDevices([]);
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
    <ContainerComponent isDark={isDark} loadData={loadData}>
      <SettingSection isDark={isDark}>
        <SectionText isDark={isDark} style={{fontSize: 20, fontWeight: 'bold', paddingTop: 10, paddingLeft: 10}}>{i18n.t('main')}</SectionText>
        <ItemSection 
          isDark={isDark} 
          onPress={() => handleFocus(pickerLanguageRef)}
          style={{height: 60}}
        >
          <SectionText isDark={isDark}>{i18n.t('language')}</SectionText>
          <Picker
            style={{display: 'none'}}
            selectedValue={language}
            onValueChange={handleLanguageChange}
            ref={pickerLanguageRef}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Russian" value="ru" />
            <Picker.Item label="German" value="de" />
          </Picker> 
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SectionText isDark={isDark} style={{paddingRight: 20}}>{language === 'en' ? 'English' : (language === 'ru' ? 'Russian' : 'German')}</SectionText>
            <AntDesign name="caretdown" size={9} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} />
          </View>
        </ItemSection>
        <ItemSection 
          isDark={isDark} 
          onPress={() => handleFocus(pickerCurrencyRef)}
          style={{height: 60}}
        >
          <SectionText isDark={isDark}>{i18n.t('currency')}</SectionText>
          <Picker
            style={{display: 'none'}}
            selectedValue={currency}
            onValueChange={handleCurrencyChange}
            ref={pickerCurrencyRef}
          >
            <Picker.Item label="EUR" value="EUR" />
            <Picker.Item label="USD" value="USD" />
            <Picker.Item label="RUB" value="RUB" />
          </Picker> 
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SectionText isDark={isDark} style={{paddingRight: 20}}>{currency}</SectionText>
            <AntDesign name="caretdown" size={9} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} />
          </View>
        </ItemSection>
        <ItemSection
          isDark={isDark}
          onPress={handleChangeColorTheme}
          style={{height: 60}}
        >
          <SectionText isDark={isDark}>{i18n.t('darkTheme')}</SectionText>
          <Switch
            value={isDark}
            onValueChange={handleChangeColorTheme}
          />
        </ItemSection>
      </SettingSection>
      <SettingSection isDark={isDark}>
        <SectionText isDark={isDark} style={{fontSize: 20, fontWeight: 'bold', paddingTop: 10, paddingLeft: 10}}>{i18n.t('ratePlan')}</SectionText>
        <ItemSection 
          isDark={isDark} 
          onPress={() => handleFocus(pickerPlanRef)}
          style={{height: 60}}
        >
          <SectionText isDark={isDark}>{i18n.t('choosePlan')}</SectionText>
          <Picker
            style={{display: 'none'}}
            selectedValue={plan}
            onValueChange={handlePlanChange}
            ref={pickerPlanRef}
          >
            <Picker.Item label={i18n.t('planFixed')} value="fixed" />
            <Picker.Item label={i18n.t('planPeakOffpeak')} value="dual" />
          </Picker>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SectionText isDark={isDark} style={{paddingRight: 20}}>{plan === 'fixed' ? i18n.t('planFixed') : i18n.t('planPeakOffpeak')}</SectionText>
            <AntDesign name="caretdown" size={9} color={isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor} />
          </View>
        </ItemSection>
        {plan === "fixed" ? (
          <ItemSection 
            isDark={isDark}
            onPress={() => handleFocus(fixedTextInputRef)}
            style={{height: 60}}
          >
            <SectionText isDark={isDark}>{i18n.t('pricePerkWh')}</SectionText>
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
            <ItemSection
              isDark={isDark}
              onPress={() => handleFocus(dayTextInputRef)}
              style={{height: 60}}
            >
              <SectionText isDark={isDark}>{i18n.t('planPeak')}</SectionText>
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
              <SectionText isDark={isDark}>{i18n.t('planOffPeak')}</SectionText>
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
      </SettingSection>
      <ButtonComponent title={i18n.t('resetSettings')} onPress={handleDefault} />
      
    </ContainerComponent>
  );
}

const SettingSection = styled.View`
  background-color: ${(props) => (props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor)};
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  font-size: 16px;
  padding: 5px 10px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;

export default Settings;