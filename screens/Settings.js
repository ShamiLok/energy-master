import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';

import ButtonComponent from '../components/Button';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

export default function Settings() {
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {isDark, setIsDark} = useContext(ThemeContext)

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const savedCurrency = await AsyncStorage.getItem("currency");
      const savedPrice = await AsyncStorage.getItem("price");
      setCurrency(savedCurrency);
      setPrice(savedPrice);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

  }

  const handleCurrencyChange = async (value) => {
    setCurrency(value);
    await AsyncStorage.setItem("currency", value);
  };

  const handlePriceChange = async (text) => {
    setPrice(text);
    await AsyncStorage.setItem("price", text);
  };

  const handleDefault = () =>{
    Alert.alert('Сброс настроек', 'Вы уверены, что хотите сбросить настройки?', [
      {
        text: 'Да',
        onPress: () => handleResetConfirmation()
      },
      {
        text: 'Нет',
        style: 'cancel'
      },
    ]);
  }

  const handleResetConfirmation = async () => {
    await AsyncStorage.clear();
    loadData();
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }

  const handleChangeColorTheme = isTrue => {
    setIsDark(!isDark)
  };

  return (
    <Container isDark={isDark}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={[]}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListHeaderComponent={(
            <>
              <FormItem>
                <Label isDark={isDark}>Select currency:</Label>
                <PickerContainer isDark={isDark}>
                  <Picker
                    style={{color: isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor}}
                    selectedValue={currency}
                    onValueChange={handleCurrencyChange}>
                    <Picker.Item label="EUR" value="EUR" />
                    <Picker.Item label="USD" value="USD" />
                    <Picker.Item label="RUB" value="RUB" />
                  </Picker>
                </PickerContainer>
              </FormItem>
              <FormItem isDark={isDark}>
                <Label isDark={isDark}>Enter the price per kWh:</Label>
                <Input
                  isDark={isDark}
                  value={price}
                  onChangeText={handlePriceChange}
                  keyboardType="numeric"
                />
              </FormItem>
              <ButtonComponent title="Сбросить настройки" onPress={handleDefault}/>
              <Switch
                // thumbColor={colors.thumbColor}
                value={isDark}
                onValueChange={handleChangeColorTheme} 
              />
            </>
          )}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;
const FormItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;
const Label = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
  color: ${(props) => props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor};
`;
const PickerContainer = styled.View`
  flex: 1;
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
`;
const Input = styled.TextInput`
  flex: 1;
  border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
  border-radius: 10px;
  padding: 10px 15px;
  color: ${(props) => props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor};
`;
