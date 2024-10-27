import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";
import {theme} from "../theme";
import CustomButton from "../components/Button";
import Toast from "react-native-toast-message";

type TelaLoginNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaLoginNavigationProp;
};

export default function Login({navigation}: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Por favor, preencha todos os campos.',
        visibilityTime: 5000
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/login', {
        user: {
          username,
          password,
        },
      });

      const token = response.headers['authorization'];

      if (!token) {
        throw new Error('Token não encontrado nos headers da resposta da API.');
      }

      const userData = response.data
      const user = {
        id: userData.id,
        cpf: userData.cpf,
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        fullname: userData.name + ' ' + userData.surname,
        roletype: userData.roletype,
        username: userData.username,
        active: userData.active,
        domain: userData.domain,
      }

      const jwt = token.replace('Bearer ', '');
      await AsyncStorage.setItem('authToken', jwt);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('role', user.roletype);

      navigation.navigate('DrawerNavigator');

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Toast.show({
        type: 'erorr',
        text1: 'Erro!',
        text2: 'Nome de usuário ou senha incorretos ou problema ao conectar com o servidor.',
        visibilityTime: 5000
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        placeholderTextColor={theme.colors.primary}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={theme.colors.primary}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <CustomButton title={loading ? 'Carregando...' : 'Entrar'} onPress={handleLogin} disabled={loading}/>
      </View>

      <Text style={styles.promptText}>
        Não possui uma conta?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.loginText}>Cadastre-se</Text>
        </TouchableOpacity>
      </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 5,
    backgroundColor: theme.colors.cards,
    color: theme.colors.primary,
  },
  buttonContainer: {
    marginTop: 16,
    width: '80%',
  },
  promptText: {
    marginTop: 16,
    color: theme.colors.primary,
  },
  loginText: {
    marginTop: 20,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
