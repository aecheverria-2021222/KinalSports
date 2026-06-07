// c:\gitIN6AM\KinalSports\client-user\src\navigation\MainTabs.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../shared/constants/theme.js';

// Screens
import { FieldsScreen } from '../features/fields/screens/FieldsScreen.jsx';
import { FieldDetailScreen } from '../features/fields/screens/FieldDetailScreen.jsx';
import { TeamsScreen } from '../features/teams/screens/TeamsScreen.jsx';
import { TeamDetailScreen } from '../features/teams/screens/TeamDetailScreen.jsx';
import { MyTeamsScreen } from '../features/teams/screens/MyTeamsScreen.jsx';
import { CreateTeamScreen } from '../features/teams/screens/CreateTeamScreen.jsx';
import { TournamentsScreen } from '../features/tournaments/screens/TournamentsScreen.jsx';
import { TournamentDetailScreen } from '../features/tournaments/screens/TournamentDetailScreen.jsx';
import { MyTournamentsScreen } from '../features/tournaments/screens/MyTournamentsScreen.jsx';
import { ReservationsScreen } from '../features/reservations/screens/ReservationsScreen.jsx';
import { CreateReservationScreen } from '../features/reservations/screens/CreateReservationScreen.jsx';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen.jsx';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const commonStackOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: COLORS.surface,
  headerBackTitleVisible: false,
};

// Fields Stack
const FieldsStack = () => (
  <Stack.Navigator screenOptions={commonStackOptions}>
    <Stack.Screen name="FieldsList" component={FieldsScreen} options={{ title: 'Canchas' }} />
    <Stack.Screen name="FieldDetail" component={FieldDetailScreen} options={{ title: 'Detalle de Cancha' }} />
  </Stack.Navigator>
);

// Teams Stack
const TeamsStack = () => (
  <Stack.Navigator screenOptions={commonStackOptions}>
    <Stack.Screen name="TeamsList" component={TeamsScreen} options={{ title: 'Equipos' }} />
    <Stack.Screen name="TeamDetail" component={TeamDetailScreen} options={{ title: 'Detalle de Equipo' }} />
    <Stack.Screen name="MyTeams" component={MyTeamsScreen} options={{ title: 'Mis Equipos' }} />
    <Stack.Screen name="CreateTeam" component={CreateTeamScreen} options={{ title: 'Crear Equipo' }} />
  </Stack.Navigator>
);

// Tournaments Stack
const TournamentsStack = () => (
  <Stack.Navigator screenOptions={commonStackOptions}>
    <Stack.Screen name="TournamentsList" component={TournamentsScreen} options={{ title: 'Torneos' }} />
    <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} options={{ title: 'Detalle de Torneo' }} />
    <Stack.Screen name="MyTournaments" component={MyTournamentsScreen} options={{ title: 'Mis Torneos' }} />
  </Stack.Navigator>
);

// Reservations Stack
const ReservationsStack = () => (
  <Stack.Navigator screenOptions={commonStackOptions}>
    <Stack.Screen name="ReservationsList" component={ReservationsScreen} options={{ title: 'Mis Reservas' }} />
    <Stack.Screen name="CreateReservation" component={CreateReservationScreen} options={{ title: 'Nueva Reserva' }} />
  </Stack.Navigator>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Fields') iconName = 'sports-soccer';
          else if (route.name === 'Teams') iconName = 'groups';
          else if (route.name === 'Tournaments') iconName = 'emoji-events';
          else if (route.name === 'Reservations') iconName = 'event';
          else if (route.name === 'Profile') iconName = 'person';
          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          height: 60,
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          paddingTop: 8,
        },
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
          headerTintColor: COLORS.surface
        }} 
      />
    </Tab.Navigator>
  );
};
