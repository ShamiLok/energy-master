import React, { useContext } from 'react';
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
    
  };

  const handleCheckUpdates = () => {
    
  };

  return (
    <Container
      isDark={isDark}
      contentContainerStyle={{ padding: 20 }}
      overScrollMode="never"
    >
      <SectionText isDark={isDark} style={{ fontSize: 24 }}>{i18n.t('energyMaster')}</SectionText>
      <SectionText style={{ marginBottom: 10 }} isDark={isDark}>{i18n.t('version')}: v0.4.0 alpha</SectionText>
      <ItemSection isDark={isDark}>
        <SectionText isDark={isDark}>{i18n.t('rateApp')}</SectionText>
        <ButtonComponent title={i18n.t('rate')} onPress={handleRateApp} />
      </ItemSection>
      <ItemSection isDark={isDark}>
        <SectionText isDark={isDark}>{i18n.t('contactDeveloper')}</SectionText>
        <ButtonComponent title={i18n.t('contact')} onPress={handleContactDeveloper} />
      </ItemSection>
      <ItemSection isDark={isDark}>
        <SectionText isDark={isDark}>{i18n.t('checkUpdates')}</SectionText>
        <ButtonComponent title={i18n.t('check')} onPress={handleCheckUpdates} />
      </ItemSection>
      <Copyright>
        <SectionText isDark={isDark}>{i18n.t('copyright')}</SectionText>
      </Copyright>
      
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  flex-direction: column;
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;

const Copyright = styled.View`
    align-items: center;
    margin-top: auto;
`;

export default About;
