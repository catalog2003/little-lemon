import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useMemo, useReducer } from 'react';
import { Alert, LogBox } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';
import Home from './screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

// Ignore specific log warnings
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const Stack = createNativeStackNavigator();

const initialState = {
  isLoading: true,
  isOnboardingCompleted: false,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_PROFILE':
      return {
        ...prevState,
        isLoading: false,
        isOnboardingCompleted: action.isOnboardingCompleted,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...prevState,
        isOnboardingCompleted: true,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        isOnboardingCompleted: false,
      };
    default:
      return prevState;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const profile = await AsyncStorage.getItem('profile');
        dispatch({
          type: 'RESTORE_PROFILE',
          isOnboardingCompleted: profile !== null,
        });
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      onboard: async (data) => {
        try {
          await AsyncStorage.setItem('profile', JSON.stringify(data));
          dispatch({ type: 'COMPLETE_ONBOARDING' });
        } catch (e) {
          console.error('Failed to save profile', e);
        }
      },
      updateProfile: async (data) => {
        try {
          await AsyncStorage.setItem('profile', JSON.stringify(data));
          Alert.alert('Success', 'Profile updated successfully!');
        } catch (e) {
          console.error('Failed to update profile', e);
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.removeItem('profile');
          dispatch({ type: 'LOGOUT' });
        } catch (e) {
          console.error('Failed to log out', e);
        }
      },
    }),
    []
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
