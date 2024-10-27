import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {theme} from "../theme";
import CustomButton from "../components/Button";
import Toast from "react-native-toast-message";

const AdicionarPorta = ({navigation}: any) => {
  const [serial, setSerial] = useState('');

  const handleAddPorta = async () => {
    if (!serial) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: "Por favor, insira o serial da porta!",
        visibilityTime: 5000
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.post(
        '/doors',
        {serial},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: "Porta adicionada com sucesso!",
          visibilityTime: 5000
        });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: "Ocorreu um erro ao adicionar a porta.",
        visibilityTime: 5000
      });
      console.error('Erro ao adicionar porta:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Insira o serial da porta"
        placeholderTextColor={theme.colors.primary}
        value={serial}
        onChangeText={setSerial}
      />
      <CustomButton title="Vincular" onPress={handleAddPorta}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: theme.colors.primary
  },
  input: {
    height: 40,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default AdicionarPorta;
