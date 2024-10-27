import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
  Alert,
  RefreshControl
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import {theme} from "../theme";
import axios from "axios";
import LoadingDots from "react-native-loading-dots";
import Toast from "react-native-toast-message";

type TelaPortasNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaPortasNavigationProp;
};

const Portas: React.FC<Props> = ({navigation}) => {
  const [portasData, setPortasData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  const solicitarEntrada = async (code: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      // @ts-ignore
      const response = await api.get('/v1.0/rfid/solicitaentrada', code, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Solicitação de abertura feita!',
        visibilityTime: 5000
      });

      if (response.status === 200) {
        const openResponse = await axios.post('http://192.168.100.229:5555/open', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (openResponse.status !== 200) {
          Toast.show({
            type: 'error',
            text1: 'Erro!',
            text2: 'Falha ao abrir a porta.',
            visibilityTime: 5000
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Falha ao solicitar entrada. Tente novamente!',
        visibilityTime: 5000
      });
      console.error('Erro ao solicitar entrada:', error);
    }
  };


  const fetchPortas = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.get('/doors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      setPortasData(data);

    } catch (error) {
      console.error('Erro ao buscar portas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPortas();
  }, []);

  const handleAcao = (acao: string, portaId: number) => {
    Toast.show({
      type: 'success',
      text1: 'Sucesso!',
      text2: `Ação: ${acao} Ação escolhida para a porta: ${portaId}`,
      visibilityTime: 5000
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddDoor')} style={{marginRight: 15}}>
          <Ionicons name="add" size={24} color={theme.colors.primary}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPortas();
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.dotsWrapper}>
          <LoadingDots
            colors={[theme.colors.primary, theme.colors.primary, theme.colors.primary, theme.colors.primary]}/>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={portasData}
        keyExtractor={item => item.id.toString()}
        overScrollMode="never"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        renderItem={({item}) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.identification}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => solicitarEntrada(item.identification)} style={styles.actionButton}>
                <Ionicons name="lock-open-outline" size={20} color={theme.colors.primary}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAcao('Editar', item.id)} style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color={theme.colors.primary}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAcao('Desvincular', item.id)} style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.primary}/>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Descrição</Text>
            <Text style={styles.tableHeaderText}>Serial</Text>
            <Text style={styles.tableHeaderText}>Ações</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cards,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: theme.colors.cards,
    marginBottom: 5,
    borderRadius: 5,
  },
  loadingScreen: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsWrapper: {
    width: 100,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: 8,
  },
  actionButtonIcon: {
    color: theme.colors.primary,
  },
});

export default Portas;
