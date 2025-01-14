import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme, colors } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const themeColors = colors[theme];

  const renderSettingItem = (
    icon: string,
    title: string,
    value?: boolean,
    onPress?: () => void,
    showSwitch?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: themeColors.card }]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={themeColors.text} />
        <Text style={[styles.settingText, { color: themeColors.text }]}>
          {title}
        </Text>
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#767577', true: themeColors.accent }}
          thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Appearance
      </Text>
      {renderSettingItem(
        'dark-mode',
        'Dark Mode',
        theme === 'dark',
        toggleTheme,
        true
      )}

      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Notes
      </Text>
      {renderSettingItem('sort', 'Sort Notes')}
      {renderSettingItem('folder', 'Categories')}
      {renderSettingItem('backup', 'Backup Notes')}

      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        About
      </Text>
      {renderSettingItem('info', 'Version 1.0.0')}
      {renderSettingItem('policy', 'Privacy Policy')}
      {renderSettingItem('description', 'Terms of Service')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default SettingsScreen;
