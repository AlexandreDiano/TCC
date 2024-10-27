import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import {NavigationProp, ParamListBase, useRoute} from '@react-navigation/native';
import {theme} from "../theme";
import CustomButton from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import Toast from "react-native-toast-message";

type TelaCadastroNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaCadastroNavigationProp;
};

export default function Login({navigation}: Props) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const route = useRoute();
  const {userId, edit}: any = route.params

  useEffect(() => {
    const loadUserName = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.get(`/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (data) {
        setNome(data.name);
        setSobrenome(data.surname);
        setCpf(data.cpf)
        setEmail(data.email);
        setUsername(data.username);
      }
    };

    loadUserName();

  }, [userId, edit]);

  const handleSignUp = async () => {
    try {
      const payload = {
        name: nome,
        surname: sobrenome,
        cpf,
        email,
        username,
      };

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      let response

      if(!edit) {
        response = await api.put(`/signup`, {user: payload}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }else{
        response = await api.put(`/users/${userId}`, {user: payload}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }


      if(!edit){
        if (response.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Sucesso!',
            text2: 'Usuário cadastrado com sucesso!',
            visibilityTime: 5000
          });
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro!',
            text2: 'Falha ao cadastrar o usuário.',
            visibilityTime: 5000
          });
        }
      }else{
        if (response.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Sucesso!',
            text2: 'Usuário editado com sucesso.',
            visibilityTime: 5000
          });
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro!',
            text2: 'Falha ao editar o usuário.',
            visibilityTime: 5000
          });
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao cadastrar o usuário.',
        visibilityTime: 5000
      });
    }
  };

  return (
    <View style={styles.container}>
      {!edit && (
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        placeholderTextColor={theme.colors.primary}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        placeholderTextColor={theme.colors.primary}
        value={sobrenome}
        onChangeText={setSobrenome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor={theme.colors.primary}
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.primary}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor={theme.colors.primary}
        value={username}
        onChangeText={setUsername}
      />
      {!edit && (
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={theme.colors.primary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      )}
      <View style={styles.buttonContainer}>
        <CustomButton title={edit ? "Editar" : "Cadastrar"} onPress={handleSignUp}/>
      </View>
      {!edit && (
        <Text style={styles.promptText}>
          Já possui uma conta?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
