import React, { useContext, useRef, useEffect } from 'react';
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
    setDevices,
    loadData,
    languages
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
  };

  const handleLanguageChange = async (value) => {
    setLanguage(value);
    await AsyncStorage.setItem('language', value);
  };

  const handlePlanChange = (plan) => {
    Alert.alert(i18n.t('changePlan'), i18n.t('confirmDeviceDeletion'), [
      {
        text: i18n.t('yes'),
        onPress: async () => {
          setPlan(plan)
          if(plan === 'fixed'){
            setPrice(['0'])
          } else {
            setPrice(['0', '0'])
          }
          await AsyncStorage.setItem('plan', plan);
          setDevices([]);
          await AsyncStorage.removeItem('devices');
        },
      },
      {
        text: i18n.t('no'),
        style: 'cancel',
      },
    ]);
  }

  const handlePriceChange = async (text, index) => {
    if (plan === 'fixed') {
      setPrice([text]);
    } else {
      setPrice(prevPrice => {
        const newPrice = [...prevPrice];
        newPrice[index] = text;
        return newPrice;
      });
    }
  };

  useEffect(() => {
    AsyncStorage.setItem('price', JSON.stringify(price));
  }, [price]);

  const handleDefault = () => {
    Alert.alert(i18n.t('resetSettings'), i18n.t('confirmReset'), [
      {
        text: i18n.t('yes'),
        onPress: () => handleResetConfirmation(),
      },
      {
        text: i18n.t('no'),
        style: 'cancel',
      },
    ]);
  };

  const handleResetConfirmation = async () => {
    await AsyncStorage.clear();
    loadData();
    showToast(i18n.t('settingsReset'))
  };

  const handleChangeColorTheme = () => {
    handleIsDark(!isDark);
  };

  const handleFocus = (refHook) => {
    refHook.current.focus();
  }

  const handleFocusInput = (index) => {
    if(price[index] == 0){
      handlePriceChange('', index)
    }
  }

  const handleBlurInput = (index) => {
    if(price[index] == ''){
      handlePriceChange(0, index)
    }
  }

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
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
            {Object.keys(languages).map((langKey) => (
              <Picker.Item
                key={languages[langKey].value}
                label={languages[langKey].label}
                value={languages[langKey].value}
              />
            ))}
          </Picker> 
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SectionText isDark={isDark} style={{paddingRight: 20}}>{languages[language].label}</SectionText>
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
            <Picker.Item label="[元] CNY" value="CNY" />
            <Picker.Item label="[€] EUR" value="EUR" />
            <Picker.Item label="[£] GBP" value="GBP" />
            <Picker.Item label="[₹] INR" value="INR" />
            <Picker.Item label="[円] JPY" value="JPY" />
            <Picker.Item label="[₩] KRW" value="KRW" />
            <Picker.Item label="[$] USD" value="USD" />
            <Picker.Item label="[₴] UAH" value="UAH" />
            <Picker.Item label="[₽] RUB" value="RUB" />
            <Picker.Item label="[₺] TRY" value="TRY" />
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
              value={String(price[0])}
              onChangeText={(text) => handlePriceChange(validCheck(text))}
              onFocus={() => handleFocusInput(0)}
              onBlur={() => handleBlurInput(0)}
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
              <View>
                <SectionText isDark={isDark}>{i18n.t('planPeak')}</SectionText>
                <SectionText isDark={isDark} style={{fontSize: 14}}>7:00-23:00</SectionText>
              </View>
              <Input
                isDark={isDark}
                value={String(price[0])}
                onChangeText={(text) => handlePriceChange(validCheck(text), '0')}
                onFocus={() => handleFocusInput(0)}
                onBlur={() => handleBlurInput(0)}
                ref={dayTextInputRef}
                keyboardType="numeric"
                maxLength={15}
                onSubmitEditing={() => handleFocus(nightTextInputRef)}
              />
            </ItemSection>
            <ItemSection
              isDark={isDark}
              onPress={() => handleFocus(nightTextInputRef)}
              style={{height: 60}}
            >
              <View>
                <SectionText isDark={isDark}>{i18n.t('planOffPeak')}</SectionText>
                <SectionText isDark={isDark} style={{fontSize: 14}}>23:00-7:00</SectionText>
              </View>
              <Input
                isDark={isDark}
                value={String(price[1])}
                onChangeText={(text) => handlePriceChange(validCheck(text), '1')}
                onFocus={() => handleFocusInput(1)}
                onBlur={() => handleBlurInput(1)}
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
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
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