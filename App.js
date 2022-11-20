import { SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import BottomTab from './navigation/BottomTab';
import 'react-native-gesture-handler';
import RootStack from './navigation/RootStack';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      < RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight
  },
});
