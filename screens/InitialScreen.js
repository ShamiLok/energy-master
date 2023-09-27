import React, { useState, useContext, useRef, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import ContainerComponent from '../components/ContainerComponent';
import ItemSection from '../components/ItemSection';
import ButtonComponent from '../components/Button';
import SectionText from '../components/SectionText';

import { i18n } from '../localizations/i18n';

const InitialScreen = ({setShowInitialScreen}) => {
  const { 
    isDark,
    currency, setCurrency,
    price, setPrice,
    plan, setPlan,
    loadData
  } = useContext(ThemeContext);

  const fixedTextInputRef = useRef(null);
  const pickerCurrencyRef = useRef(false);
  const pickerPlanRef = useRef(false);
  const dayTextInputRef = useRef(null);
  const nightTextInputRef = useRef(null);

  const handleCurrencyChange = async (value) => {
    setCurrency(value);
    await AsyncStorage.setItem('currency', value);
  };

  const handlePlanChange = async (plan) => {
    setPlan(plan)
    if(plan === 'fixed'){
    setPrice(['0'])
    } else {
    setPrice(['0', '0'])
    }
    await AsyncStorage.setItem('plan', plan);
    await AsyncStorage.removeItem('devices');
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

  const validCheck = (text) => {
    let s = text
    if(s.length > 1){
      while(s.charAt(0) === '0'){
        s = s.substring(1);
      }
    }
    return s
  }
  
  const saveDataHandler = () => {
    setShowInitialScreen(false)
  }

  return (
    <>
      <Container>
      <SectionText style={{fontSize: 22, fontWeight: 700}}>
        {i18n.t('welcome')}
      </SectionText>
      <SectionText style={{paddingBottom: 20}}>
        {i18n.t('selectCurrencyAndRatePlan')}
      </SectionText>
      <ItemSection 
        isDark={isDark} 
        onPress={() => handleFocus(pickerCurrencyRef)}
        style={{height: 60, borderWidth: 1, borderColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor}}
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
        onPress={() => handleFocus(pickerPlanRef)}
        style={{height: 60, borderWidth: 1, borderColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor}}
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
          style={{height: 60, borderWidth: 1, borderColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor}}
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
          style={{height: 60, borderWidth: 1, borderColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor}}
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
          style={{height: 60, borderWidth: 1, borderColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor}}
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
      </Container>
      <ButtonContainer>
        <ButtonComponent title={i18n.t('continue')} onPress={() => setShowInitialScreen(false)} />
      </ButtonContainer>
      
    </>
  );
};

const Container = styled.ScrollView`
  padding: 20px;
  flex: 1;
  flex-direction: column;
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;

const ButtonContainer = styled.View`
  padding: 20px;

`;

const Input = styled.TextInput`
  font-size: 16px;
  padding: 5px 10px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;

export default InitialScreen;