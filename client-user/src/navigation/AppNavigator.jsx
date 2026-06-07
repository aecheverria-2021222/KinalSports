// c:\gitIN6AM\KinalSports\client-user\src\navigation\AppNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack.jsx';
import { MainTabs } from './MainTabs.jsx';
import { useAuthStore } from '../shared/store/authStore.js';
import { LoadingSpinner } from '../shared/components/common/Common.jsx';
import { COLORS } from '../shared/constants/theme.js';

export const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  if (!_hasHydrated) {
    return <LoadingSpinner style={{ backgroundColor: COLORS.background }} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};
