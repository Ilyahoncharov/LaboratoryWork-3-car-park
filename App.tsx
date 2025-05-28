import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CarListPage from './components/CarListPage';
import CarCreationForm from './components/CarCreationForm';
import CarDetailPage from './components/CarDetailPage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CarList">
          <Stack.Screen
            name="CarList"
            component={CarListPage}
            options={{ title: 'Список Авто', headerShown: false}}
          />
          <Stack.Screen
            name="CarCreation"
            component={CarCreationForm}
            options={{ title: 'Додати авто', headerShown: true }}
          />
          <Stack.Screen
            name="CarDetail"
            component={CarDetailPage}
            options={{ title: 'Деталі авто', headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
); }