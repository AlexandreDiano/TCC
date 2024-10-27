import React, {useState, useEffect, useRef} from 'react';
import * as MediaLibrary from 'expo-media-library';
import {View, Text, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import {Camera} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from "../theme";
import api from "../services/api";
import Toast from "react-native-toast-message";

const Images = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const storedImage = await AsyncStorage.getItem('userPhoto');
      if (storedImage) {
        setImage(storedImage);
      } else {
        setShowCamera(true);
      }

      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
        await AsyncStorage.setItem('userPhoto', data.uri);
        setShowCamera(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const removePicture = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.delete('/delete-photo', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          userId: user.id,
        },
      });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Foto removida com sucesso.',
          visibilityTime: 5000,
        });
        await AsyncStorage.removeItem('userPhoto');
        setImage(null);
        setShowCamera(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Falha ao remover a foto do backend.',
          visibilityTime: 5000,
        });
      }
    } catch (error) {
      console.error('Erro ao remover a foto:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao remover a foto.',
        visibilityTime: 5000,
      });
    }
  };

  const savePicture = async () => {
    if (image && user) {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const responseKey = await api.get('/keys', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const keysData = responseKey.data;
        const userKey = keysData.find((key) => key.user_id === user.id);

        if (!userKey) {
          Toast.show({
            type: 'error',
            text1: 'Erro!',
            text2: 'KeyCode não encontrado para o usuário.',
            visibilityTime: 5000
          });
          return;
        }

        const keyCode = userKey.code;

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          image,
          [{resize: {width: 800}}],
          {compress: 0.5, format: ImageManipulator.SaveFormat.JPEG}
        );

        const data = new FormData();
        data.append('image', {
          uri: manipulatedImage.uri,
          type: 'image/jpeg',
          name: `${user.fullname}_${keyCode}.jpg`,
        });

        data.append('username', `${user.name} ${user.surname}`);

        const {status} = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Precisamos de permissão para salvar a imagem na galeria.');
          return;
        }

        const response = await fetch('http://192.168.100.229:5555/detect_face', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        });

        const responseJson = await response.json();

        if (response.ok) {
          await MediaLibrary.createAssetAsync(manipulatedImage.uri);
          Toast.show({
            type: 'success',
            text1: 'Sucesso!',
            text2: responseJson.message,
            visibilityTime: 5000
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro!',
            text2: `${responseJson.error || 'Erro inesperado.'}`,
            visibilityTime: 5000
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: `${error.message}`,
          visibilityTime: 5000
        });
      }
    }
  };

  if (!hasPermission) {
    return <View style={styles.container}><Text>Solicitando permissão para a câmera...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <Camera style={styles.camera} type={Camera.Constants.Type.front} ref={cameraRef}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Capturar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={{flex: 1}}>
          <Image source={{uri: image}} style={styles.preview}/>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.options} onPress={savePicture}>
              <Text style={styles.buttonTitle}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={removePicture}>
              <Text style={styles.buttonTitle}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  camera: {
    flex: 1,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    width: 70,
    height: 70,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  options: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonTitle: {
    color: theme.colors.background,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});

export default Images;
