import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { NavigationProp, ParamListBase, useRoute } from '@react-navigation/native';
import { theme } from "../theme";
import CustomButton from "../components/Button";
import api from "../services/api";
import Toast from "react-native-toast-message";
import { useAuth } from "../contexts/AuthContext";

type TelaCadastroNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaCadastroNavigationProp;
};

export default function Login({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const route = useRoute();
  const { userId, edit }: any = route.params || {};
  const { token }: any = useAuth() || {};

  const applyCpfMask = (value: string) => {
    value = value.replace(/\D/g, '').slice(0, 11);

    return value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const isValidCpf = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  };


  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const loadUserName = async () => {
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
      setCpf(data.cpf);
      setEmail(data.email);
      setUsername(data.username);
    }
  };

  useEffect(() => {
    if (edit) {
      loadUserName();
    }
  }, [userId, edit]);


  const validateFields = () => {
    if (!nome) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo Nome é obrigatório.',
        visibilityTime: 3000,
      });
      return false;
    }
    if (!sobrenome) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo Sobrenome é obrigatório.',
        visibilityTime: 3000,
      });
      return false;
    }
    if (!cpf) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo CPF é obrigatório.',
        visibilityTime: 3000,
      });
      return false;
    }
    if (!isValidCpf(cpf)) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'CPF inválido.',
        visibilityTime: 3000,
      });
      return false;
    }
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo Email é obrigatório.',
        visibilityTime: 3000,
      });
      return false;
    }
    if (!isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'E-mail inválido.',
        visibilityTime: 3000,
      });
      return false;
    }
    if (!username) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo Usuário é obrigatório.',
        visibilityTime: 3000,
      });
      return false;
    }
    if (!edit && !password) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo Senha é obrigatório.',
        visibilityTime: 3000,
      });
      return false;
    }
    return true;
  };


  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const payload = {
        name: nome,
        surname: sobrenome,
        cpf,
        email,
        username,
        password
      };

      let response;
      if (!edit) {
        response = await api.post(`/signup`, { user: payload }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        response = await api.put(`/users/${userId}`, { user: payload }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: edit ? 'Usuário editado com sucesso.' : 'Usuário cadastrado com sucesso!',
          visibilityTime: 5000,
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Falha ao processar o usuário.',
          visibilityTime: 5000,
        });
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao cadastrar o usuário.',
        visibilityTime: 5000,
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
        onChangeText={(value) => setCpf(applyCpfMask(value))}
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
        <CustomButton title={edit ? "Editar" : "Cadastrar"} onPress={handleSignUp} />
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
