import React, { useState } from 'react';
import { RefreshControl } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import styled from 'styled-components/native';

const ContainerComponent = ({ isDark, children, loadData }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <Container
      isDark={isDark}
      contentContainerStyle={{ padding: 18, flexGrow: 1 }}
      overScrollMode="never"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[isDark ? DARK_COLORS.boolColor : LIGHT_COLORS.boolColor]}
          progressBackgroundColor={isDark ? DARK_COLORS.refreshColor : LIGHT_COLORS.refreshColor}
        />
      }
    >
      {children}
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  flex-direction: column;
  background-color: ${(props) => props.isDark ? DARK_COLORS.backgroundColor : LIGHT_COLORS.backgroundColor};
`;

export default ContainerComponent;