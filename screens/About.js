import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import ButtonComponent from '../components/Button';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

const About = () => {
const { isDark} = useContext(ThemeContext);

  const appVersion = 'in develop';

  const handleRateApp = () => {
    
  };

  const handleContactDeveloper = () => {
    
  };

  const handleCheckUpdates = () => {
    
  };

  return (
    <Container isDark={isDark}>
      <SectionText isDark={isDark} style={{fontSize: 24}}>Energy Master</SectionText>
        <SectionText style={{marginBottom: 10}} isDark={isDark}>Version: {appVersion}</SectionText>
        <ListItem isDark={isDark}>
            <SectionText isDark={isDark}>Оценить приложение</SectionText>
            <ButtonComponent title="Rate" onPress={handleRateApp} style={{width: 100}}/>
        </ListItem>
        <ListItem isDark={isDark}>
            <SectionText isDark={isDark}>Связь с разабочтиком</SectionText>
            <ButtonComponent title="Contact" onPress={handleContactDeveloper}  style={{width: 100}}/>
        </ListItem>
        <ListItem isDark={isDark}>
            <SectionText isDark={isDark}>Проверить обновления</SectionText>
            <ButtonComponent title="Check" onPress={handleCheckUpdates}  style={{width: 100}}/>
        </ListItem>
        <Copyright>
            <SectionText isDark={isDark}>&copy; 2023 Energy Master</SectionText>
        </Copyright>
      
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => (props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor)};
`;

const ListItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => (props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor)};
  padding: 10px 15px;
  margin-top: 10px;
  border-radius: 10px;
`;

const SectionText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor};
`;

const Copyright = styled.View`
    align-items: center;
    margin-top: auto;
`;

export default About;
