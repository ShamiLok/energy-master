import React, { useContext } from 'react';
import styled from 'styled-components/native';

import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';
import { ThemeContext } from '../contexts/themes';
import { VictoryPie } from 'victory-native';

import ContainerComponent from '../components/ContainerComponent';
import SectionText from '../components/SectionText';

import { i18n } from '../localizations/i18n';

const Report = () => {
  const { 
    isDark,
    currency,
    price,
    plan,
    dayPrice,
    nightPrice,
    devices,
    loadData
  } = useContext(ThemeContext);

  // const colorScale = ['#008080', '#FF6347', '#6A5ACD', '#32CD32'];
  const colorScale = [
    '#f4511e', // Оранжевый
    '#ffea00', // Золотистый
    '#00bcd4', // Голубой
    '#8e24aa', // Пурпурный
    '#c2185b', // Розовый
    '#3f51b5', // Синий
    '#7b1fa2', // Темно-пурпурный
    '#0288d1', // Темно-голубой
    '#009688', // Темно-зеленый
    '#558b2f', // Зеленый
    '#ffeb3b', // Желтый
    '#ff5722', // Темно-оранжевый
    '#795548', // Темно-коричневый
    '#9e9e9e', // Серый
    '#607d8b', // Темно-серый
    '#ec407a', // Ярко-розовый
    '#42a5f5', // Ярко-синий
    '#43a047', // Ярко-зеленый
    '#ef6c00', // Ярко-оранжевый
    '#d4e157', // Ярко-желтый
    '#ffa726', // Ярко-коричневый
    '#78909c', // Ярко-серый
    '#26a69a', // Морской волны
    '#8d6e63', // Коричневый
    '#ff7043', // Ярко-оранжевый
  ];

  const getDaykWh = () => {
    if(plan === 'fixed'){
      return devices.reduce((total, device) => total + device.watts * device.quantity * device.hours, 0) / 1000;
    } else {
      return devices.reduce((total, device) => total + device.quantity * (device.watts * device.dayHours / 1000 + device.watts * device.nightHours / 1000), 0);
    }
  };

  const getDayPrice = () => {
    if(plan === 'fixed'){
      return devices.reduce((total, device) => total + device.watts * device.quantity * device.hours, 0) / 1000 * price;
    } else {
      return devices.reduce((total, device) => total + device.quantity * (device.watts * device.dayHours / 1000 * dayPrice + device.watts * device.nightHours / 1000 * nightPrice), 0);
    }
  };

  function roundNumber(number) {
    var parts = number.toString().split('.');
    return !parts[1] || parts[1].length <= 2 ? number : number.toFixed(2);
  }

  const handleRefresh = () => {
    loadData()
  }

  const getPieChartData = () => {
    return devices.map((device, index) => {
      const usage = plan === 'fixed' ? (device.watts * device.quantity * device.hours) / 1000 : (device.quantity * (device.watts * device.dayHours / 1000 + device.watts * device.nightHours / 1000));
      return {
        x: device.name,
        y: usage
      };
    })
    .sort((a, b) => b.y - a.y);
  };

  return (
    <ContainerComponent isDark={isDark} loadData={handleRefresh}>
      <Result isDark={isDark}>
        {!price || !currency ? (
        <ResultHeader isDark={isDark}>
            <SectionText isDark={isDark}>{i18n.t('choosePrice')}</SectionText>
        </ResultHeader>
        ) : (
        <ResultContainer>
          <ResultItem style={{borderBottomColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor, borderBottomWidth: 1}}>
            <ResultHeader isDark={isDark}>
              <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>{i18n.t('perDay')}</SectionText>
            </ResultHeader>
            <ResultInfo isDark={isDark}>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDaykWh())} kWh
              </SectionText>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDayPrice())} {currency}
              </SectionText>
            </ResultInfo>
          </ResultItem>
          <ResultItem style={{borderBottomColor: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor, borderBottomWidth: 1}}>
            <ResultHeader isDark={isDark}>
              <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>{i18n.t('perMonth')}</SectionText>
            </ResultHeader>
            <ResultInfo isDark={isDark}>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDaykWh() * 30)} kWh
              </SectionText>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDayPrice() * 30)} {currency}
              </SectionText>
            </ResultInfo>
          </ResultItem>
          <ResultItem>
            <ResultHeader isDark={isDark}>
              <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>{i18n.t('perYear')}</SectionText>
            </ResultHeader>
            <ResultInfo isDark={isDark}>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDaykWh() * 365)} kWh
              </SectionText>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDayPrice() * 365)} {currency}
              </SectionText>
            </ResultInfo>
          </ResultItem>
        </ResultContainer>
        )}
      </Result>
      <PieChart>
        <VictoryPie
          data={getPieChartData()}
          colorScale={colorScale}
          innerRadius={70}
          style={{
            labels: {
              fill: isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor,
            }
          }}
          labels={() => null}
          height={300}
        />
      </PieChart>
      <DeviceList>
        {devices
          .sort((a, b) => {
            const usageA = plan === 'fixed' ? (a.watts * a.quantity * a.hours) / 1000 : (a.quantity * (a.watts * a.dayHours / 1000 + a.watts * a.nightHours / 1000));
            const usageB = plan === 'fixed' ? (b.watts * b.quantity * b.hours) / 1000 : (b.quantity * (b.watts * b.dayHours / 1000 + b.watts * b.nightHours / 1000));
            return usageB - usageA;
          })
          .map((device, index) => (
            <DeviceItem key={index} bgColor={colorScale[index % colorScale.length]}>
              <SectionText isDark={isDark}>
                {device.name}: {roundNumber(plan === 'fixed' ? (device.watts * device.quantity * device.hours) / 1000 : (device.quantity * (device.watts * device.dayHours / 1000 + device.watts * device.nightHours / 1000)))} kWh
              </SectionText>
            </DeviceItem>
          ))}
      </DeviceList>
    </ContainerComponent>
  );
};

const Result = styled.View`
    position: relative;
    padding: 0 10px;
    border: 1px solid ${(props) => props.isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor};
    border-radius: 10px;
    overflow: hidden;
    background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
    margin: 10px 0;
`;

const ResultContainer = styled.View`
`;

const ResultItem = styled.View`
`;

const ResultHeader = styled.View`
    padding-top: 5px;
    align-items: center;
    background-color: ${(props) => props.isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor};
`;

const ResultInfo = styled.View`
    padding: 10px;
    flex-direction: column;
    justify-content: space-around;
`;

const PieChart = styled.View`
  align-items: center;
`;

const DeviceList = styled.View`
  margin-top: 20px;
`;

const DeviceItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  background-color: ${(props) => props.bgColor};
  padding: 5px 10px;
  border-radius: 10px;
`;

export default Report;