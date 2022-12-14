import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Muistiinpanot from './Muistiinpanot';
import Nauhoitin from './Nauhoitin';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Header } from'react-native-elements';


export default function App() {

  const Tab = createBottomTabNavigator();

  function Koti(){
    <View style={styles.container}>
      <Text>Placeholder</Text>
    </View>
  }

  return (
    <NavigationContainer>
      <Header   centerComponent={{ text: 'MemowrApp', style: { color: '#26070c', fontSize: 20, fontWeight: 'bold', padding: 5 } }}/>
      <Tab.Navigator 
      screenOptions={({route }) => ({       
            tabBarIcon: ({ focused, color, size }) => {                        
              let iconName;            
              if (route.name === 'Nauhoitin') {
                  iconName = 'md-disc';            
                } else if (route.name === 'Muistiinpanot') {
                  iconName = 'md-library';            
                }            
                return <Ionicons name={iconName} size={size} color={color} />;        
              },        
              })}>
        <Tab.Screen name="Nauhoitin" component={Nauhoitin} />
        <Tab.Screen name="Muistiinpanot" component={Muistiinpanot} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0b384',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
