import React from 'react';
import { ActivityIndicator } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import styled from 'styled-components/native';

const SectionLoading = ({ isDark}) => {
  return (
    <Loading isDark={isDark}>
      <ActivityIndicator size="large" color="#0000ff" />
    </Loading>
  );
};

const Loading = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;

export default SectionLoading;