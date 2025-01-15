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
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const themeColors = colors[theme];

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string | null,
    rightElement: React.ReactNode,
  ) => (
    <View style={[styles.settingItem, { borderBottomColor: themeColors.textTertiary + '20' }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: themeColors.textTertiary + '20' }]}>
          <Icon name={icon} size={24} color={themeColors.textSecondary} />
        </View>
        <View style={styles.settingTexts}>
          <Text style={[styles.settingTitle, { color: themeColors.text }]}>{title}</Text>
          {description && (
            <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>Appearance</Text>
        {renderSettingItem(
          'dark-mode',
          'Dark Mode',
          'Switch between light and dark theme',
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: themeColors.accent + '80' }}
            thumbColor={theme === 'dark' ? themeColors.accent : '#f4f3f4'}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>About</Text>
        {renderSettingItem(
          'info',
          'Version',
          'Current version of the app',
          <Text style={[styles.versionText, { color: themeColors.textTertiary }]}>1.0.0</Text>
        )}
        {renderSettingItem(
          'code',
          'Source Code',
          'View the source code on GitHub',
          <Icon name="chevron-right" size={24} color={themeColors.textTertiary} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>Support</Text>
        {renderSettingItem(
          'star',
          'Rate App',
          'Rate us on the App Store',
          <Icon name="chevron-right" size={24} color={themeColors.textTertiary} />
        )}
        {renderSettingItem(
          'email',
          'Contact Us',
          'Get in touch with our support team',
          <Icon name="chevron-right" size={24} color={themeColors.textTertiary} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Add padding for bottom tab bar
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen;
