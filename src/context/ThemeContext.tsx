import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const colors = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    secondaryText: '#666666',
    card: '#F8F8F8',
    accent: '#007AFF',
    tabBar: '#1A1A1A',
    tabBarInactive: 'rgba(255,255,255,0.5)',
    tabBarActive: '#FFFFFF',
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    secondaryText: '#AAAAAA',
    card: '#1E1E1E',
    accent: '#007AFF',
    tabBar: '#1A1A1A',
    tabBarInactive: 'rgba(255,255,255,0.5)',
    tabBarActive: '#FFFFFF',
  },
};
