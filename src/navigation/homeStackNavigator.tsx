import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DriverDetailsScreen, DriverListScreen } from '../screens';


const HomeStackNavigator: FC = () => {
  const HomeStack = createNativeStackNavigator();
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="DriverListScreen" component={DriverListScreen} />
      <HomeStack.Screen name="DriverDetailsScreen" component={DriverDetailsScreen} />
    </HomeStack.Navigator>
  );
};


export default HomeStackNavigator;
