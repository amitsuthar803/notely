import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';

const SettingsScreen = () => {
  const {theme, toggleTheme, colors: themeColors} = useTheme();

  const settings = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'dark' ? 'dark-mode' : 'light-mode',
          label: 'Theme',
          value: theme === 'dark' ? 'Dark' : 'Light',
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'info',
          label: 'Version',
          value: '1.0.0',
        },
        {
          icon: 'code',
          label: 'Source Code',
          value: 'GitHub',
          onPress: () => Linking.openURL('https://github.com/amitsuthar803'),
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: themeColors[theme].background},
      ]}>
      <View style={styles.profileSection}>
        <Image
          source={require('../../public/me.jpg')}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, {color: themeColors[theme].text}]}>
          Amit Suthar
        </Text>
        <TouchableOpacity
          style={styles.githubButton}
          onPress={() => Linking.openURL('https://github.com/amitsuthar803')}>
          <Icon name="code" size={20} color="#fff" style={styles.githubIcon} />
          <Text style={styles.githubText}>GitHub Profile</Text>
        </TouchableOpacity>
      </View>

      {settings.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {color: themeColors[theme].textSecondary},
            ]}>
            {section.title}
          </Text>
          <View
            style={[
              styles.card,
              {backgroundColor: themeColors[theme].surface},
            ]}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex < section.items.length - 1 && styles.borderBottom,
                ]}
                onPress={item.onPress}>
                <View style={styles.settingLeft}>
                  <Icon
                    name={item.icon}
                    size={24}
                    color={themeColors[theme].accent}
                    style={styles.icon}
                  />
                  <Text
                    style={[styles.label, {color: themeColors[theme].text}]}>
                    {item.label}
                  </Text>
                </View>
                <View style={styles.settingRight}>
                  <Text
                    style={[
                      styles.value,
                      {color: themeColors[theme].textSecondary},
                    ]}>
                    {item.value}
                  </Text>
                  {item.onPress && (
                    <Icon
                      name="chevron-right"
                      size={24}
                      color={themeColors[theme].textTertiary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text
          style={[styles.copyright, {color: themeColors[theme].textSecondary}]}>
          Designed & Developed by Amit Suthar
        </Text>
        <Text
          style={[styles.copyright, {color: themeColors[theme].textTertiary}]}>
          {new Date().getFullYear()} All rights reserved
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24292e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  githubIcon: {
    marginRight: 8,
  },
  githubText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    marginRight: 8,
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default SettingsScreen;
