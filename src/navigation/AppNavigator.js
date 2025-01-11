import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import OrganizationList from '../screens/OrganizationList';
import NewPage from '../screens/NewPage';
import Assignments from '../screens/Assignments';

// Создаем два навигатора: Stack для Организаций, Tab для нижнего меню
const OrgStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Стек: OrganizationList + NewPage
function OrganizationStackScreen() {
  return (
    <OrgStack.Navigator>
      <OrgStack.Screen
        name="OrganizationList"
        component={OrganizationList}
        options={{ title: 'Организации' }}
      />
      <OrgStack.Screen
        name="NewPage"
        component={NewPage}
        options={{ title: 'Назначение техники и водителей' }}
      />
    </OrgStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
      >
        {/* Первая вкладка - стек организаций */}
        <Tab.Screen
          name="OrganizationsTab"
          component={OrganizationStackScreen}
          options={{ title: 'Организации' }}
        />

        {/* Вторая вкладка - таблица (Assignments) */}
        <Tab.Screen
          name="AssignmentsTab"
          component={Assignments}
          options={{ title: 'Таблица' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}