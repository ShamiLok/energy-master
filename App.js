import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
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

const Drawer = createDrawerNavigator();

export default function App() {

  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if(handleIsDark){
        setIsDark(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleIsDark = async (value) => {
    setIsDark(value);
    await AsyncStorage.setItem("theme", JSON.stringify(value));
  };

  return (
    <ThemeContext.Provider value={{isDark, handleIsDark}}>
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
            }
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
