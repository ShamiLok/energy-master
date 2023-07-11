import React from 'react';
import { Button } from 'react-native-elements';

const ButtonComponent = ({ title, onPress }) => {
  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={{
        backgroundColor: 'lightgrey', // светлый фон кнопки
        borderRadius: 10, // округление углов кнопки
      }}
      titleStyle={{
        color: 'black', // темный цвет надписи
      }}
    />
  );
};

export default ButtonComponent;