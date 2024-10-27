import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthLoading({navigation}: any) {
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem('authToken');
      navigation.navigate(token ? 'DrawerNavigator' : 'TelaInicial');
    };

    checkAuthentication();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
