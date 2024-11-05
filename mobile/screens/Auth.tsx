import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useAuth} from "../contexts/AuthContext";

export default function AuthLoading({navigation}: any) {
  const {token} = useAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
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
