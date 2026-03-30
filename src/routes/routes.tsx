import React, { FC, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { UserData, UserDataContext } from '../context/userDataContext';
import { LocalStorage } from '../helpers/localStorage';
import { AuthStackNavigator, HomeStackNavigator } from '../navigation';
import  Colors from '../constant/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResponsiveStatusBar from '../components/ResponsiveStatusBar/ResponsiveStatusBar';
import OfflineBanner from '../components/OfflineBanner/OfflineBanner';

const Stack = createNativeStackNavigator();

const Route: FC = () => {
  const [userLogin, setUserLogin] = useState<boolean | null>(null);
  const { isLoggedIn } = useContext<UserData>(UserDataContext);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    getAsync();
  }, [isLoggedIn]);

  const getAsync = async () => {
    try {
      const val = await LocalStorage.read('@login');
      setUserLogin(!!val);
    } catch (error) {
      setUserLogin(false);
    } 
  };

  // Network check
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return unsubscribe;
  }, []);

  // Loading state (prevents UI jump)
  if (userLogin === null) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.PRIMARY[200] }}>
        <ResponsiveStatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent={true}
        />
        <SafeAreaView 
          style={{ flex: 1, backgroundColor: Colors.PRIMARY[200] }}
          edges={['left', 'right', 'bottom']}
        >
          {/* Your loading content here */}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#248797" }}>
      <ResponsiveStatusBar
        backgroundColor="transparent"
        barStyle="default"
        translucent={true}
      />
      <SafeAreaView 
        style={{ flex: 1 }}
        edges={['top', 'left', 'right']}
      >
        <OfflineBanner visible={isOffline} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userLogin ? (
              <Stack.Screen
                name="HomeStackNavigator"
                component={HomeStackNavigator}
              />
            ) : (
              <Stack.Screen
                name="AuthStackNavigator"
                component={AuthStackNavigator}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
};

export default Route;
