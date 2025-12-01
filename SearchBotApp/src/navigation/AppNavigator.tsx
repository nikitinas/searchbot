import { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/types';
import { MainTabs } from './MainTabs';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { SearchInputScreen } from '@/screens/SearchInputScreen';
import { ProcessingScreen } from '@/screens/ProcessingScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hydrateHistory } from '@/store/searchSlice';
import { hydrateUserProfile } from '@/store/userSlice';

const Stack = createNativeStackNavigator<AppStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0C0C12',
  },
};

export const AppNavigator = () => {
  const onboardingComplete = useAppSelector(state => state.user.profile.onboardingComplete);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateUserProfile());
    dispatch(hydrateHistory());
  }, [dispatch]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0C0C12' },
          headerTintColor: '#fff',
        }}
      >
        {!onboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="SearchInput"
              component={SearchInputScreen}
              options={{ title: 'Describe your problem' }}
            />
            <Stack.Screen name="Processing" component={ProcessingScreen} options={{ title: 'Researching' }} />
            <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'AI solution' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
