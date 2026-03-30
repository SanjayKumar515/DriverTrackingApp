import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeScreen } from '../screens';


const HomeStackNavigator: FC = () => {
  const HomeStack = createNativeStackNavigator();
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>

        <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
