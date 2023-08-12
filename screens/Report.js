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
    devices,
    loadData
  } = useContext(ThemeContext);

  const getPieChartData = () => {
    if(devices.length === 0) {
      return [{ y: 1 }]
    }
    return devices.map((device, index) => {
      const usage = plan === 'fixed' ? (device.watts * device.quantity * device.hours) / 1000 : (device.quantity * (device.watts * device.dayHours / 1000 + device.watts * device.nightHours / 1000));
      return {
        x: device.name,
        y: usage
      };
    })
    .sort((a, b) => b.y - a.y);
  };

  const colorScale = devices.length !== 0 ? [
    '#f4511e',
    '#ffea00',
    '#00bcd4',
    '#8e24aa',
    '#c2185b',
    '#3f51b5',
    '#7b1fa2',
    '#0288d1',
    '#009688',
    '#558b2f',
    '#ffeb3b',
    '#ff5722',
    '#795548',
    '#9e9e9e',
    '#607d8b',
    '#ec407a',
    '#42a5f5',
    '#43a047',
    '#ef6c00',
    '#d4e157',
    '#ffa726',
    '#78909c',
    '#26a69a',
    '#8d6e63',
    '#ff7043',
  ] : ['grey'];

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
      return devices.reduce((total, device) => total + device.quantity * (device.watts * device.dayHours / 1000 * price[0] + device.watts * device.nightHours / 1000 * price[1]), 0);
    }
  };

  function roundNumber(number) {
    var parts = number.toString().split('.');
    return !parts[1] || parts[1].length <= 2 ? number : number.toFixed(2);
  }

  const handleRefresh = () => {
    loadData()
  }

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
              <SectionText isDark={isDark} style={{fontWeight: 'bold'}}>{i18n.t('perWeek')}</SectionText>
            </ResultHeader>
            <ResultInfo isDark={isDark}>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDaykWh() * 7)} kWh
              </SectionText>
              <SectionText isDark={isDark} style={{fontSize: 14}}>
                {roundNumber(getDayPrice() * 7)} {currency}
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
            },
            data: {
              fillOpacity: 0.9, stroke: isDark ? DARK_COLORS.borderColor : LIGHT_COLORS.borderColor, strokeWidth: 1
            }
          }}
          labels={() => null}
          height={300}
          
        />
      </PieChart>
      <DeviceList>
      {devices.length === 0 ? (
        <DeviceItem style={{backgroundColor: isDark ? DARK_COLORS.blockColor : LIGHT_COLORS.blockColor}}>
          <SectionText isDark={isDark}>
            {i18n.t('deviceListEmpty')}
          </SectionText>
        </DeviceItem>
      ) : (
        <>
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
        </>)}
        
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