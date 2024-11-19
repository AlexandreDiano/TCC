import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {NavigationProp, ParamListBase, useIsFocused} from '@react-navigation/native';
import { Clipboard } from 'react-native';
import api from "../services/api";
import {theme} from "../theme";
import LoadingDots from "react-native-loading-dots";
import Toast from "react-native-toast-message";
import {useAuth} from "../contexts/AuthContext";
import {BASE_URL, FLASK_PORT} from "@env";

type TelaPortasNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaPortasNavigationProp;
};

const Portas: React.FC<Props> = ({navigation}) => {
  const [portasData, setPortasData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const {token, role} = useAuth();

  const fetchPortas = async () => {
    try {
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchPortas();
  };

  const handleEditDoor = (porta: any) => {
    navigation.navigate('AddDoor', {porta});
  };

  const solicitarEntrada = async () => {
    try {
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const openResponse = await fetch(`${BASE_URL}:${FLASK_PORT}/open`, {
        method: 'POST',
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
      }else{
          Toast.show({
              type: 'success',
              text1: 'Sucesso!',
              text2: 'Porta aberta com sucesso!',
              visibilityTime: 5000
          });
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

  useEffect(() => {
    if (isFocused) {
      fetchPortas();
    }
  }, [isFocused]);

  const handleDeleteDoors = async (doorId: number | string) => {
    try {
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.delete(`/doors/${doorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: "Porta removida com sucesso!",
          visibilityTime: 5000
        });
      }

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: "Falha ao remover porta.",
        visibilityTime: 5000
      });
      console.error('Erro ao remover porta:', error);
    } finally {
      fetchPortas()
    }
  }

  const copyToClipboard = (text: any) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copiado!',
      text2: 'Serial copiado para a área de transferência.',
      visibilityTime: 2000,
    });
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
            <TouchableOpacity onPress={() => copyToClipboard(item.identification)}>
              <Text style={[styles.tableCell, styles.copyText]}>
                {item.identification}
              </Text>
            </TouchableOpacity>
            <View style={styles.actionButtons}>
              {role === 'superuser' && (
                <TouchableOpacity onPress={() => solicitarEntrada()} style={styles.actionButton}>
                  <Ionicons name="lock-open-outline" size={20} color={theme.colors.primary}/>
                </TouchableOpacity>
              )}
              {role === 'admin' && (
                <TouchableOpacity onPress={() => handleEditDoor(item)} style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color={theme.colors.primary}/>
                </TouchableOpacity>
              )}
              {(role === 'admin' || role === 'superuser') && (
                <TouchableOpacity onPress={() => handleDeleteDoors(item.id)}
                                  style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.primary}/>
                </TouchableOpacity>
              )}
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
  copyText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
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
