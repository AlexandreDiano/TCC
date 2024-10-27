import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import {capitalizeFirstLetter} from "../utils/capitalizeFirst";
import {theme} from "../theme";
import Toast from "react-native-toast-message";

type AssociarChaveNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: AssociarChaveNavigationProp;
};

type Usuario = {
  id: number;
  nomeCompleto: string;
  email: string;
};

const AssociarChave: React.FC<Props> = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [description, setDescription] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const route = useRoute();
  const {id}: any = route.params

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const response = await api.get('/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Não foi possível buscar os usuários.',
          visibilityTime: 5000
        });
      }
    };

    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(
    (usuario: any) =>
      (usuario.name && usuario.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (usuario.surname && usuario.surname.toLowerCase().includes(searchText.toLowerCase())) ||
      (usuario.email && usuario.email.toLowerCase().includes(searchText.toLowerCase()))
  );


  const handleConfirmar = async () => {
    if (!usuarioSelecionado) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Por favor, selecione um usuário.',
        visibilityTime: 5000
      });
      return;
    }

    if (description.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Por favor, insira uma descrição do acesso.',
        visibilityTime: 5000
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Token de autenticação não encontrado.',
          visibilityTime: 5000
        });
        return;
      }

      const key = {
        user_id: usuarioSelecionado.id,
        description,
      };

      const response = await api.put(`/keys/${id}`, key, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Chave associada com sucesso!',
          visibilityTime: 5000
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro!',
          text2: 'Não foi possível associar a chave.',
          visibilityTime: 5000
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao associar a chave.',
        visibilityTime: 5000
      });
      console.error('Erro ao associar a chave:', error);
    }
  };

  const renderUsuario = ({item}: { item: any }) => {
    const isSelected = usuarioSelecionado?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.usuarioCard, isSelected && styles.usuarioCardSelecionado]}
        onPress={() => setUsuarioSelecionado(item)}
        activeOpacity={0.8}
      >
        <Ionicons name="person-circle" size={50} color={theme.colors.primary} style={styles.usuarioIcon}/>
        <View style={styles.usuarioInfo}>
          <Text
            style={styles.usuarioNome}>{capitalizeFirstLetter(item.name)} {capitalizeFirstLetter(item.surname)}</Text>
          <Text style={styles.usuarioEmail}>{item.email}</Text>
        </View>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary}/>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>

              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon}/>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar usuário..."
                  placeholderTextColor={theme.colors.primary}
                  value={searchText}
                  onChangeText={setSearchText}
                  returnKeyType="search"
                />
              </View>
            </View>

            <View style={styles.listContainer}>
              <FlatList
                data={filteredUsuarios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUsuario}
                ListEmptyComponent={<Text style={styles.listaVazia}>Nenhum usuário encontrado.</Text>}
                keyboardShouldPersistTaps="always"
              />
            </View>

            <View style={styles.footerContainer}>
              <TextInput
                style={styles.descricaoInput}
                placeholder="Descrição do acesso..."
                placeholderTextColor={theme.colors.primary}
                value={description}
                onChangeText={setDescription}
                multiline
                returnKeyType="done"
              />

              <TouchableOpacity
                style={[
                  styles.botaoConfirmar,
                  (!usuarioSelecionado || description.trim() === '') && styles.botaoConfirmarDesabilitado,
                ]}
                onPress={handleConfirmar}
                disabled={!usuarioSelecionado || description.trim() === ''}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoConfirmarTexto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    marginBottom: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 20,
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.cards,
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  usuarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  usuarioCardSelecionado: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.cards,
  },
  usuarioIcon: {
    marginRight: 15,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNome: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#777',
  },
  listaVazia: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 16,
  },
  footerContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  descricaoInput: {
    backgroundColor: theme.colors.cards,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: theme.colors.primary,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    elevation: 2,
  },
  botaoConfirmar: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 2,
  },
  botaoConfirmarDesabilitado: {
    backgroundColor: theme.colors.primary,
  },
  botaoConfirmarTexto: {
    color: theme.colors.textWhite,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AssociarChave;
