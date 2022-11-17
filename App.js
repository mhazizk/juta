import { SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import BottomTab from './navigation/BottomTab';
import 'react-native-gesture-handler';

export default function App() {
  return (
      <BottomTab />
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
