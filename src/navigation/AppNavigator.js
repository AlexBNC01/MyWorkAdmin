//AppNavigator
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import OrganizationList from '../screens/OrganizationList';
import NewPage from '../screens/NewPage';
import Assignments from '../screens/Assignments';

// Cтек для «Организации» (OrganizationList + NewPage)
const OrgStack = createStackNavigator();
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
        options={{ title: 'Заявки' }}
      />
    </OrgStack.Navigator>
  );
}

// Таб Navigator (две вкладки)
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="OrganizationsTab"
          component={OrganizationStackScreen}
          options={{ title: 'Организации' }}
        />
        <Tab.Screen
          name="AssignmentsTab"
          component={Assignments}
          options={{ title: 'Таблица' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}