import React, { useContext } from 'react';
import { Linking } from 'react-native';
import styled from 'styled-components/native';

import ButtonComponent from '../components/Button';
import SectionText from '../components/SectionText';
import ItemSection from '../components/ItemSection';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';

import { i18n } from '../localizations/i18n';

const About = () => {
  const { isDark} = useContext(ThemeContext);

  const handleRateApp = () => {
    
  };

  const handleContactDeveloper = () => {
    Linking.openURL('mailto:shmldevelop@gmail.com')
  };

  const handleCheckUpdates = () => {
    
  };

  return (
    <>
      <Container
        isDark={isDark}
        contentContainerStyle={{ padding: 20 }}
        overScrollMode="never"
      >
        <SectionText isDark={isDark} style={{ fontSize: 24 }}>Energy Master</SectionText>
        <SectionText style={{ marginBottom: 10 }} isDark={isDark}>{i18n.t('version')}: v1.0.1</SectionText>
        {/* <ItemSection isDark={isDark}>
          <SectionText isDark={isDark} style={{fontSize: 14}}>{i18n.t('rateApp')}</SectionText>
          <ButtonComponent title={i18n.t('rate')} onPress={handleRateApp} style={{width: 110}}/>
        </ItemSection> */}
        <ItemSection isDark={isDark}>
          <SectionText isDark={isDark} style={{fontSize: 14}}>{i18n.t('contactDeveloper')}</SectionText>
          <ButtonComponent title={i18n.t('contact')} onPress={handleContactDeveloper} style={{width: 110}}/>
        </ItemSection>
        {/* <ItemSection isDark={isDark}>
          <SectionText isDark={isDark} style={{fontSize: 14}}>{i18n.t('checkUpdates')}</SectionText>
          <ButtonComponent title={i18n.t('check')} onPress={handleCheckUpdates} style={{width: 110}}/>
        </ItemSection> */}
      </Container>
      <Copyright isDark={isDark}>
        <SectionText isDark={isDark}>© 2023 Energy Master</SectionText>
      </Copyright>
    </>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  flex-direction: column;
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;

const Copyright = styled.View`
  align-items: center;
  padding: 5px;
  background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};

`;

export default About;
