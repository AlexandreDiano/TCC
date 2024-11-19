import React, {useEffect, useRef, useState} from 'react';
import * as MediaLibrary from 'expo-media-library';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Camera, CameraView} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from "../theme";
import api from "../services/api";
import Toast from "react-native-toast-message";
import {useAuth} from "../contexts/AuthContext";
import {BASE_URL, FLASK_PORT} from '@env';
import {getDownloadURL, ref} from 'firebase/storage';
import {storage} from '../utils/firebase';

const Images = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const {token, user} = useAuth();

  const downloadImage = async () => {
    try {
      const responseKey = await api.get('/keys', {
        headers: {
          'Authorization': `Bearer ${token}`,
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

      const keyCode = userKey.code

      const fileName = `${user.name} ${user.surname}_${keyCode}.jpg`;
      const filePath = `${user.name} ${user.surname}/${fileName}`;

      const storageRef = ref(storage, filePath);

      const url = await getDownloadURL(storageRef)

      await AsyncStorage.setItem('userPhoto', url);
      setImage(url)

      return url
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Não foi possivel baixar a imagem salva!',
        visibilityTime: 5000
      });

      console.error("Erro ao baixar imagem:", error.message);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const url = await downloadImage();

      if (url) {
        await AsyncStorage.setItem('userPhoto', url);
        setImage(url)

        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Imagem resgatada com sucesso.',
          visibilityTime: 5000
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Não foi encontrado nenhuma imagem salva!',
          visibilityTime: 5000
        });
      }
    };

    fetchImage();
  }, []);

  useEffect(() => {
    (async () => {
      const storedImage = await AsyncStorage.getItem('userPhoto');
      if (storedImage) {
        setImage(storedImage);
      } else {
        downloadImage()
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
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      await AsyncStorage.removeItem('userPhoto');
      setImage(null);
      setShowCamera(true);

      const responseKey = await api.get('/keys', {
        headers: {
          'Authorization': `Bearer ${token}`,
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

      const keyCode = userKey.code

      const data = new FormData();
      data.append('username', `${user.name} ${user.surname}`);
      data.append('image_name', `${user.name} ${user.surname}_${keyCode}.jpg`);

      const response = await fetch(`${BASE_URL}:${FLASK_PORT}/delete_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Foto removida com sucesso.',
          visibilityTime: 5000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Falha ao remover a foto do backend.',
          visibilityTime: 5000,
        });
      }
    } catch (error) {
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
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const responseKey = await api.get('/keys', {
          headers: {
            'Authorization': `Bearer ${token}`,
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

        const keyCode = userKey.code

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

        const response = await fetch(`${BASE_URL}:${FLASK_PORT}/detect_face`, {
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
          console.error(responseJson.error)
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
        <CameraView style={styles.camera} facing="front" ref={cameraRef}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={takePicture}/>
          </View>
        </CameraView>
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
