import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { MenuProvider } from './src/context/MenuContext';
import { CartProvider } from './src/context/CartContext';
import { OrdersProvider } from './src/context/OrdersContext';
import AppNavigator from './src/navigation/AppNavigator';

function MainApp() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MenuProvider>
            <CartProvider>
              <OrdersProvider>
                <MainApp />
              </OrdersProvider>
            </CartProvider>
          </MenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
