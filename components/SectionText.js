import React from 'react';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import styled from 'styled-components/native';

const SectionText = ({ isDark, children, style }) => {
  return (
    <Text isDark={isDark} style={style}>
      {children}
    </Text>
  );
};

const Text = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor)};
`;

export default SectionText;