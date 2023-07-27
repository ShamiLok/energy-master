import React, { useState, useEffect } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  SimpleLineIcons,
  Ionicons ,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";

import About from "./screens/About";
import Home from "./screens/Home";
import Settings from "./screens/Settings";

import { LIGHT_COLORS, DARK_COLORS } from './constants/colors';
import { ThemeContext } from "./contexts/themes";

import { getLocales } from 'expo-localization';

const Drawer = createDrawerNavigator();

export default function App() {

  const [isDark, setIsDark] = useState(false)

  const [language, setLanguage] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');
  const [plan, setPlan] = useState('');
  const [dayPrice, setDayPrice] = useState('');
  const [nightPrice, setNightPrice] = useState('');

  const [{ currencyCode, languageCode }] = getLocales();

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedCurrency = await AsyncStorage.getItem('currency');
      const savedLangugae = await AsyncStorage.getItem('language');
      const savedPrice = await AsyncStorage.getItem('price');
      const savedPlan = await AsyncStorage.getItem('plan');
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
      if (!savedPlan) {
        setPlan('fixed');
        await AsyncStorage.setItem('plan', languageCode);
      } else {
        setPlan(savedPlan);
      }
      setPrice(savedPrice);

      if(handleIsDark){
        setIsDark(JSON.parse(savedTheme));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleIsDark = async (value) => {
    setIsDark(value);
    await AsyncStorage.setItem("theme", JSON.stringify(value));
    showToast(`Установлена ${isDark ? 'светлая' : 'темная'} тема`)
  };

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  }

  return (
    <ThemeContext.Provider value={{
      isDark, handleIsDark,
      language, setLanguage,
      currency, setCurrency,
      price, setPrice,
      plan, setPlan,
      dayPrice, setDayPrice,
      nightPrice, setNightPrice,
      loadData,
      loading
    }}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={
            (props) => {
              return (
                <SafeAreaView>
                  <DrawerItemList {...props} />
                </SafeAreaView>
              )
            }
          }
          screenOptions={{
            drawerStyle: {
              backgroundColor: isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor,
              width: 250
            },
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold"
            },
            drawerLabelStyle: {
              color: isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor
            },
            drawerActiveBackgroundColor: isDark ? DARK_COLORS.activeBackgroundColor : LIGHT_COLORS.activeBackgroundColor
          }}
        >
          <Drawer.Screen
            name="Home"
            options={{
              drawerLabel: "Home",
              title: "Home",
              drawerIcon: () => (
                <SimpleLineIcons name="home" size={20} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} />
              )
            }}
            component={Home}
          />

          <Drawer.Screen
            name="Settings"
            options={{
              drawerLabel: "Settings",
              title: "Settings",
              drawerIcon: () => (
                <SimpleLineIcons name="settings" size={20} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} />
              )
            }}
            component={Settings}
          />

          <Drawer.Screen
            name="About"
            options={{
              drawerLabel: "About",
              title: "About",
              drawerIcon: () => (
                <Ionicons name="information-circle-outline" size={24} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} />
              )
            }}
            component={About}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
