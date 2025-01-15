import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
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
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const NotesStack = () => {
  const { theme } = useTheme();
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
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const { theme } = useTheme();
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
          borderRadius: 30,
          height: 70,
          borderTopWidth: 0,
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
              <Animated.View style={[
                styles.tabIndicator,
                {
                  backgroundColor: themeColors.accent,
                  opacity: focused ? 1 : 0,
                  transform: [{ scaleX: focused ? 1 : 0 }]
                }
              ]} />
              <Icon
                name="home"
                size={22}
                color={focused ? themeColors.accent : themeColors.textTertiary}
                style={styles.tabIcon}
              />
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
              <Animated.View style={[
                styles.tabIndicator,
                {
                  backgroundColor: themeColors.accent,
                  opacity: focused ? 1 : 0,
                  transform: [{ scaleX: focused ? 1 : 0 }]
                }
              ]} />
              <Icon
                name="check-circle"
                size={22}
                color={focused ? themeColors.accent : themeColors.textTertiary}
                style={styles.tabIcon}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={NotesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.addButtonWrapper}>
              <View style={[styles.addButton, { backgroundColor: themeColors.accent }]}>
                <Icon name="add" size={24} color="#FFFFFF" />
              </View>
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
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Animated.View style={[
                styles.tabIndicator,
                {
                  backgroundColor: themeColors.accent,
                  opacity: focused ? 1 : 0,
                  transform: [{ scaleX: focused ? 1 : 0 }]
                }
              ]} />
              <Icon
                name="person"
                size={22}
                color={focused ? themeColors.accent : themeColors.textTertiary}
                style={styles.tabIcon}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Animated.View style={[
                styles.tabIndicator,
                {
                  backgroundColor: themeColors.accent,
                  opacity: focused ? 1 : 0,
                  transform: [{ scaleX: focused ? 1 : 0 }]
                }
              ]} />
              <Icon
                name="settings"
                size={22}
                color={focused ? themeColors.accent : themeColors.textTertiary}
                style={styles.tabIcon}
              />
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
    shadowRadius: 12,
    elevation: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    position: 'relative',
  },
  tabIcon: {
    marginTop: 15,
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    borderRadius: 3,
  },
  addButtonWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 5,
    left: '50%',
    transform: [{ translateX: -25 }],
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default App;
