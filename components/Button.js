import React from 'react';
import { Button } from 'react-native-elements';

const ButtonComponent = ({ title, onPress }) => {
  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={{
        backgroundColor: '#E5E5E5', // светлый фон кнопки
        borderRadius: 10, // округление углов кнопки
        borderColor: '#D5D5D5'
      }}
      titleStyle={{
        color: 'black', // темный цвет надписи
      }}
    />
  );
};

export default ButtonComponent;