import React from 'react';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import styled from 'styled-components/native';

const ItemSection = ({ isDark, children, style, onPress }) => {
  return (
    <Item isDark={isDark} style={style} onPress={onPress}>
      {children}
    </Item>
  );
};

const Item = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => (props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor)};
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 10px;
`;

export default ItemSection;