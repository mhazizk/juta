import { SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import BottomNavbar from './navigation/BottomNavbar';
import 'react-native-gesture-handler';

export default function App() {
  return (
      <BottomNavbar />
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
