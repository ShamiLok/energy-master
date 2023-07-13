import React, { useContext } from 'react';
import { Button } from 'react-native-elements';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

const ButtonComponent = ({ title, onPress }) => {
    const {isDark} = useContext(ThemeContext)

  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={{
        backgroundColor: isDark ? DARK_COLORS.buttonBackgroundColor : LIGHT_COLORS.buttonBackgroundColor, // светлый фон кнопки
        borderRadius: 10, // округление углов кнопки
        borderColor: '#D5D5D5'
      }}
      titleStyle={{
        color: isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor,
      }}
    />
  );
};

export default ButtonComponent;