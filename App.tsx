import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import EditNoteScreen from './src/screens/EditNoteScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RootStackParamList } from './src/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme, colors } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const NotesStack = () => {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.note ? 'Edit Note' : 'New Note',
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

const FavoritesScreen = () => {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <View style={[styles.comingSoon, { backgroundColor: themeColors.background }]}>
      <Icon name="favorite" size={48} color={themeColors.secondaryText} />
      <Text style={[styles.comingSoonText, { color: themeColors.secondaryText }]}>
        Coming Soon
      </Text>
    </View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <View style={styles.tabBarWrapper}>
      <View style={[styles.tabBarContainer, { backgroundColor: themeColors.tabBar }]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName = 'home';
          if (route.name === 'Notes') {
            iconName = 'description';
          } else if (route.name === 'Favorites') {
            iconName = 'favorite';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonActive
              ]}
            >
              <Icon
                name={iconName}
                size={24}
                color={isFocused ? themeColors.tabBarActive : themeColors.tabBarInactive}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const AppContent = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Notes" 
          component={NotesStack}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: width - 48,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabButton: {
    padding: 10,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 18,
    marginTop: 12,
  },
});

export default App;
