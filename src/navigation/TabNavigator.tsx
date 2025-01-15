import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TodoScreen from '../screens/TodoScreen';

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');

const TabIcon = ({name, size, color, focused, theme}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1.2,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: -5,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <View style={styles.iconContainer}>
      {focused && (
        <View
          style={[styles.indicator, {backgroundColor: theme.colors.primary}]}
        />
      )}
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{scale: scaleValue}, {translateY}],
          },
        ]}>
        <Icon name={name} size={size} color={color} />
      </Animated.View>
    </View>
  );
};

const TabNavigator = () => {
  const theme = {
    colors: {
      primary: '#007AFF',
      text: '#8E8E93',
    },
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: [
          styles.tabBar,
          Platform.select({
            ios: styles.shadowIOS,
            android: styles.shadowAndroid,
          }),
        ],
        tabBarShowLabel: false,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              name="home"
              size={22}
              color={focused ? theme.colors.primary : theme.colors.text}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              name="check-square"
              size={22}
              color={focused ? theme.colors.primary : theme.colors.text}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={HomeScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              name="user"
              size={22}
              color={focused ? theme.colors.primary : theme.colors.text}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  iconContainer: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 12,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default TabNavigator;
