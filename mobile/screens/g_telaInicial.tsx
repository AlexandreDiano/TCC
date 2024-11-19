import React from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation';
import {theme} from "../theme";
import CustomButton from "../components/Button";

type TelaInicialNavigationProp = StackNavigationProp<RootStackParamList, 'TelaInicial'>;

type Props = {
  navigation: TelaInicialNavigationProp;
};

export default function TelaInicial({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Bem-vindo!</Text>
      <View style={styles.buttonContainer}>
        <CustomButton title="Login" onPress={() => navigation.navigate('Login')}/>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton title="Registrar" onPress={() => navigation.navigate('Register', { userId: undefined, edit: false })}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 24,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    width: '80%',
  },
});