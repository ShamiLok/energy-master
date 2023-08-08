import React, { useState, useContext } from 'react';
import { Entypo } from '@expo/vector-icons'; 
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

  const colorScale = ['#008080', '#FF6347', '#6A5ACD', '#32CD32'];

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
    });
  };
 
  console.log(getPieChartData())
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
          labelRadius={({ innerRadius }) => innerRadius + 15}
          data={getPieChartData()}
          colorScale={colorScale}
          innerRadius={30}
          style={{
            labels: {
              fill: isDark ? DARK_COLORS.textColor : LIGHT_COLORS.textColor,
            },
          }}
        />
      </PieChart>
      <DeviceList>
        {devices.map((device, index) => (
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
  padding: 10px;
  border-radius: 10px;
`;

export default Report;