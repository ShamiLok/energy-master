import React, { useState, useEffect } from "react";
import { ToastAndroid, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  SimpleLineIcons,
  Ionicons,
  Foundation 
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";

import About from "./screens/About";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Report from "./screens/Report";

import { LIGHT_COLORS, DARK_COLORS } from './constants/colors';
import { ThemeContext } from "./contexts/themes";

import { getLocales } from 'expo-localization';

import { i18n } from "./localizations/i18n";

const Drawer = createDrawerNavigator();

export default function App() {

  const [isDark, setIsDark] = useState(false)

  const [language, setLanguage] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState([]);
  const [plan, setPlan] = useState('');
  // const [dayPrice, setDayPrice] = useState('');
  // const [nightPrice, setNightPrice] = useState('');
  const [devices, setDevices] = useState([]);

  const [{ currencyCode, languageCode }] = getLocales();
  
  i18n.locale = language;
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedCurrency = await AsyncStorage.getItem('currency');
      const savedLangugae = await AsyncStorage.getItem('language');
      const savedPrice = await AsyncStorage.getItem('price');
      const savedPlan = await AsyncStorage.getItem('plan');
      const savedDevices = await AsyncStorage.getItem('devices');

      if (savedCurrency) {
        setCurrency(savedCurrency);
      } else {
        setCurrency(currencyCode);
        await AsyncStorage.setItem('currency', currencyCode);
      }

      if (savedLangugae) {
        setLanguage(savedLangugae);
      } else {
        setLanguage(languageCode);
        await AsyncStorage.setItem('langugage', languageCode);
      }

      if (savedPlan) {
        setPlan(savedPlan);
      } else {
        setPlan('fixed');
      }

      if (savedDevices) {
        setDevices(JSON.parse(savedDevices));
      } else {
        setDevices([]);
      }

      if (savedPrice !== null) {
        setPrice(JSON.parse(savedPrice));
      } else {
        setPrice(plan === 'fixed' ? ['0'] : ['0', '0']);
      }
      
      if(savedTheme !== null){
        setIsDark(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleIsDark = async (value) => {
    setIsDark(value);
    await AsyncStorage.setItem("theme", JSON.stringify(value));
    showToast(isDark ? i18n.t('lightThemeSet') : i18n.t('darkThemeSet'))
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
      devices, setDevices,
      loadData
    }}>
      <StatusBar backgroundColor="#f4511e" />
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
              drawerLabel: i18n.t('home'),
              title: i18n.t('home'),
              drawerIcon: () => (
                <SimpleLineIcons name="home" size={20} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} />
              )
            }}
            component={Home}
          />

          <Drawer.Screen
            name="Report"
            options={{
              drawerLabel: i18n.t('report'),
              title: i18n.t('report'),
              drawerIcon: () => (
                <Foundation name="results" size={22} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} />
              )
            }}
            component={Report}
          />

          <Drawer.Screen
            name="Settings"
            options={{
              drawerLabel: i18n.t('settings'),
              title: i18n.t('settings'),
              drawerIcon: () => (
                <SimpleLineIcons name="settings" size={20} color={isDark ? DARK_COLORS.screenIconColor : LIGHT_COLORS.screenIconColor} />
              )
            }}
            component={Settings}
          />

          <Drawer.Screen
            name="About"
            options={{
              drawerLabel: i18n.t('about'),
              title: i18n.t('about'),
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
