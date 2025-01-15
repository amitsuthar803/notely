import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import EditNoteScreen from './src/screens/EditNoteScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TodoScreen from './src/screens/TodoScreen';
import { RootStackParamList } from './src/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const NotesStack = () => {
  const { theme, colors } = useTheme();
  const themeColors = colors[theme];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="EditNote" 
        component={EditNoteScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const { theme, colors } = useTheme();
  const themeColors = colors[theme];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: theme === 'dark' ? themeColors.surface : '#FFFFFF',
          borderRadius: 20,
          height: 70,
          ...styles.shadow
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: themeColors.accent,
        tabBarInactiveTintColor: themeColors.textTertiary,
      }}
    >
      <Tab.Screen
        name="NotesStack"
        component={NotesStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Icon
                name="home"
                size={24}
                color={color}
                style={styles.tabIcon}
              />
              {focused && <View style={[styles.tabIndicator, { backgroundColor: themeColors.accent }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Icon
                name="check-circle"
                size={24}
                color={color}
                style={styles.tabIcon}
              />
              {focused && <View style={[styles.tabIndicator, { backgroundColor: themeColors.accent }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={EditNoteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.addButtonWrapper}>
              <View style={[styles.addButtonContainer]}>
                <View style={[styles.addButton, { backgroundColor: themeColors.accent }]}>
                  <Icon name="add" size={24} color="#FFFFFF" />
                </View>
              </View>
              <View style={[styles.addButtonBackground, { 
                backgroundColor: theme === 'dark' ? themeColors.surface : '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 5,
              }]} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('NotesStack', {
              screen: 'EditNote',
              params: { note: null }
            });
          },
        })}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Icon
                name="settings"
                size={24}
                color={color}
                style={styles.tabIcon}
              />
              {focused && <View style={[styles.tabIndicator, { backgroundColor: themeColors.accent }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Icon
                name="person"
                size={24}
                color={color}
                style={styles.tabIcon}
              />
              {focused && <View style={[styles.tabIndicator, { backgroundColor: themeColors.accent }]} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </UserProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 5,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 50,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  addButtonWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    bottom: -10,
  },
  addButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  addButtonBackground: {
    position: 'absolute',
    bottom: 0,
    width: 60,
    height: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 2,
  },
});

export default App;
