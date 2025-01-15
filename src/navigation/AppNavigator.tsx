import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { useTheme } from '../context/ThemeContext';

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
