// c:/gitIN6AM/KinalSports/client-user/src/navigation/MainTabs.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../shared/constants/theme.js';

import FieldsList from '../features/fields/screens/FieldsList.jsx';
import FieldDetail from '../features/fields/screens/FieldDetail.jsx';
import CreateReservation from '../features/reservations/screens/CreateReservation.jsx';

import TeamsList from '../features/teams/screens/TeamsList.jsx';
import TeamDetail from '../features/teams/screens/TeamDetail.jsx';
import MyTeams from '../features/teams/screens/MyTeams.jsx';
import CreateTeam from '../features/teams/screens/CreateTeam.jsx';

import TournamentsList from '../features/tournaments/screens/TournamentsList.jsx';
import TournamentDetail from '../features/tournaments/screens/TournamentDetail.jsx';
import MyTournaments from '../features/tournaments/screens/MyTournaments.jsx';

import ReservationsList from '../features/reservations/screens/ReservationsList.jsx';
import ProfileScreen from '../features/profile/screens/ProfileScreen.jsx';

// Stacks
const Stack = createStackNavigator();

const FieldsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FieldsList" component={FieldsList} />
    <Stack.Screen name="FieldDetail" component={FieldDetail} />
    <Stack.Screen name="CreateReservation" component={CreateReservation} />
  </Stack.Navigator>
);

const TeamsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TeamsList" component={TeamsList} />
    <Stack.Screen name="TeamDetail" component={TeamDetail} />
    <Stack.Screen name="MyTeams" component={MyTeams} />
    <Stack.Screen name="CreateTeam" component={CreateTeam} />
  </Stack.Navigator>
);

const TournamentsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TournamentsList" component={TournamentsList} />
    <Stack.Screen name="TournamentDetail" component={TournamentDetail} />
    <Stack.Screen name="MyTournaments" component={MyTournaments} />
  </Stack.Navigator>
);

const ReservationsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ReservationsList" component={ReservationsList} />
  </Stack.Navigator>
);

// Main Tabs
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Fields') {
            iconName = 'sports-soccer';
          } else if (route.name === 'Teams') {
            iconName = 'groups';
          } else if (route.name === 'Tournaments') {
            iconName = 'emoji-events';
          } else if (route.name === 'Reservations') {
            iconName = 'event';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Fields" component={FieldsStack} options={{ title: 'Canchas' }} />
      <Tab.Screen name="Teams" component={TeamsStack} options={{ title: 'Equipos' }} />
      <Tab.Screen name="Tournaments" component={TournamentsStack} options={{ title: 'Torneos' }} />
      <Tab.Screen name="Reservations" component={ReservationsStack} options={{ title: 'Reservas' }} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Perfil',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.surface,
          headerTitleAlign: 'center',
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
