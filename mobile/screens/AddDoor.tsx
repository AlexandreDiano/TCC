import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {theme} from "../theme";
import CustomButton from "../components/Button";
import Toast from "react-native-toast-message";
import {useAuth} from "../contexts/AuthContext";

const AdicionarPorta = ({navigation, route}: any) => {
  const [serial, setSerial] = useState('');
  const [description, setDescription] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [portaId, setPortaId] = useState<number | null>(null);

  const {token, role} = useAuth();

  useEffect(() => {
    if (route.params?.porta) {
      const { porta } = route.params;
      setSerial(porta.identification);
      setDescription(porta.description);
      setIsEditing(true);
      setPortaId(porta.id);
    }
  }, [route.params]);

  useEffect(() => {
    setIsButtonDisabled(serial.length !== 32);
  }, [serial]);

  const handleAddOrUpdatePorta = async () => {
    if (!serial) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: "Por favor, insira o serial da porta!",
        visibilityTime: 5000
      });
      return;
    }

    if (role === 'admin' && !description) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: "Por favor, insira a descrição da porta!",
        visibilityTime: 5000
      });
      return;
    }

    try {
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const endpoint = isEditing ? `/doors/${portaId}` : (role === 'superuser' ? '/doors/link' : '/doors');
      const method = isEditing ? 'put' : 'post';
      const payload = {identification: serial, description};

      const response = await api[method](endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201 || response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `Porta ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`,
          visibilityTime: 5000
        });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'adicionar'} a porta.`,
        visibilityTime: 5000
      });
      console.error('Erro ao adicionar porta:', error);
    }
  };

  const gerarSerialAleatorio = () => {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let serialAleatorio = '';
    for (let i = 0; i < 32; i++) {
      serialAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setSerial(serialAleatorio);
  };

  return (
    <View style={styles.container}>
      {role === 'admin' && (
        <CustomButton title="Gerar Serial" style={styles.randomSerial} onPress={gerarSerialAleatorio}/>
      )}

      <TextInput
        style={styles.input}
        placeholder="Insira o serial da porta (32 caracteres)"
        placeholderTextColor={theme.colors.primary}
        value={serial}
        onChangeText={setSerial}
        maxLength={32}
      />
      {role === 'admin' && (
        <TextInput
          style={styles.input}
          placeholder="Insira a descrição da porta"
          placeholderTextColor={theme.colors.primary}
          value={description}
          onChangeText={setDescription}
        />
      )}
      <CustomButton title={isEditing ? "Atualizar" : "Vincular"} onPress={handleAddOrUpdatePorta} disabled={isButtonDisabled}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
  },
  randomSerial: {
    backgroundColor: theme.colors.primary,
    width: '50%',
    paddingVertical: 5,
    marginVertical: 5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    color: theme.colors.white,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default AdicionarPorta;
