import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProjectDetailsScreen } from '../screens/ProjectDetailsScreen';
import TeamManagementScreen from '../screens/TeamManagementScreen';
import { GroupsDashboardScreen } from '../screens/GroupsDashboardScreen';
import GroupMembersScreen from '../screens/GroupMembersScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#D97706', // Ocre chaud
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          // Utilisateur connecté
          <>
            <Stack.Screen 
              name="Projects" 
              component={ProjectsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ProjectDetails" 
              component={ProjectDetailsScreen}
              options={{ headerShown: false }}
            />
        <Stack.Screen 
          name="TeamManagement" 
          component={TeamManagementScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="GroupsDashboard" 
          component={GroupsDashboardScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="GroupMembers" 
          component={GroupMembersScreen} 
          options={{ headerShown: false }} 
        />
          </>
        ) : (
          // Utilisateur non connecté
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
