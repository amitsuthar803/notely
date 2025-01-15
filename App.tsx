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
          borderRadius: 15,
          height: 65,
          paddingBottom: 10,
          ...styles.shadow
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: themeColors.accent,
        tabBarInactiveTintColor: themeColors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
        },
      }}
    >
      <Tab.Screen
        name="NotesStack"
        component={NotesStack}
        options={{
          tabBarLabel: 'Notes',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="description"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="check-circle"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={EditNoteScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.addButton, { backgroundColor: themeColors.accent }]}>
              <Icon name="add" size={24} color="#FFFFFF" />
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
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="settings"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="person"
              size={24}
              color={color}
            />
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
});

export default App;
