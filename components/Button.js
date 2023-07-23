import React, { useContext } from 'react';
import { Button } from 'react-native-elements';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

const ButtonComponent = ({ title, onPress, style }) => {
    const {isDark} = useContext(ThemeContext)

  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={{
        backgroundColor: isDark ? DARK_COLORS.buttonBackgroundColor : LIGHT_COLORS.buttonBackgroundColor,
        borderRadius: 10,
        borderColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor,
        borderWidth: 1,
        ...style,
      }}
      titleStyle={{
        color: isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor,
      }}
    />
  );
};

export default ButtonComponent;