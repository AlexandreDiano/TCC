import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import CustomButton from "../components/Button";
import {theme} from "../theme";
import Toast from "react-native-toast-message";

type TelaNovoUsuarioNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaNovoUsuarioNavigationProp;
};

export default function Login({navigation}: Props) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roletype, setRoletype] = useState(2);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    const fetchDomain = async () => {
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setDomain(parsedUser.domain);
      } else {
        console.error('Usuário não encontrado no AsyncStorage');
      }
    };

    fetchDomain();
  }, []);

  const handlePasswordConfirmation = () => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const handleSignUp = async () => {
    if (!passwordsMatch) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'As senhas não coincidem',
        visibilityTime: 5000
      });
      return;
    }

    if (!domain) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Domínio do usuário não encontrado',
        visibilityTime: 5000
      });
      return;
    }


    try {
      const payload = {
        name,
        surname,
        cpf,
        email,
        username,
        password,
        roletype,
      };

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.post('/signup', {user: payload}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Usuário cadastrado com sucesso',
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
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao cadastrar o usuário.',
        visibilityTime: 5000
      });
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.white}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.white}
        placeholder="Sobrenome"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.white}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.white}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.white}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.white}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.white}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        onBlur={handlePasswordConfirmation}
      />
      {!passwordsMatch && (
        <Text style={styles.errorText}>As senhas não coincidem.</Text>
      )}
      <View style={styles.pickerContainer}>
        <Text style={{color: theme.colors.white}}>Cargo:</Text>
        <Picker
          selectedValue={roletype}
          style={styles.picker}
          onValueChange={(itemValue: React.SetStateAction<string>, itemIndex: any) => setRoletype(itemValue)}
        >
          <Picker.Item style={{color: theme.colors.white}} label="Usuário" value={2}/>
          <Picker.Item style={{color: theme.colors.white}} label="SuperAdmin" value={1}/>
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton title="Cadastrar" onPress={handleSignUp}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 5,
    color: theme.colors.white,
    backgroundColor: theme.colors.cards,
  },
  buttonContainer: {
    marginTop: 16,
    width: '80%',
  },
  promptText: {
    marginTop: 16,
  },
  loginText: {
    marginTop: 16,
    color: '#007bff',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    color: theme.colors.textWhite,
  },
  picker: {
    color: theme.colors.buttonText,
    height: 50,
    width: 150,
    marginLeft: 8,
  },
});
