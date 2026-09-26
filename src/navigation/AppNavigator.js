import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import LoginScreen from '../screens/LoginScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import ReservationScreen from '../screens/ReservationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ManagerDashboardScreen from '../screens/ManagerDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// CUSTOMER BOTTOM TABS NAVIGATOR
function CustomerTabs() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { totalItemCount } = useCart();

  const isManager = user?.role === 'manager';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 2,
          shadowOpacity: 0.05,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 17,
        },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      {/* 1. MENU TAB */}
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'fast-food' : 'fast-food-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 2. CART TAB WITH LIVE ITEM COUNT BADGE (Task 5 requirement) */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Culinary Tray',
          tabBarLabel: 'Tray',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ width: size, height: size, margin: 2 }}>
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'}
                size={size}
                color={color}
              />
              {totalItemCount > 0 && (
                <View style={[styles.badgePill, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgePillText}>{totalItemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* 3. RESERVATIONS TAB */}
      <Tab.Screen
        name="Reservations"
        component={ReservationScreen}
        options={{
          title: 'Table Booking',
          tabBarLabel: 'Reserve',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 4. PROFILE TAB */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Guest Account',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 5. MANAGER DASHBOARD TAB (Task 4 requirement: Role-restricted to manager only) */}
      {isManager && (
        <Tab.Screen
          name="ManagerOperations"
          component={ManagerDashboardScreen}
          options={{
            title: 'Operations',
            tabBarLabel: 'Manager',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'}
                size={size}
                color={focused ? colors.primaryDark : color}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.surfaceBorder,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CustomerApp" component={CustomerTabs} />

        {/* NESTED STACK SCREENS */}
        <Stack.Screen
          name="OrderSummary"
          component={OrderSummaryScreen}
          options={{
            headerShown: true,
            title: 'Confirm Order',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{
            headerShown: true,
            title: 'Live Kitchen Tracking',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen
          name="ManagerDashboard"
          component={ManagerDashboardScreen}
          options={{
            headerShown: true,
            title: 'Manager Operations Console',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  badgePill: {
    position: 'absolute',
    right: -8,
    top: -4,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
