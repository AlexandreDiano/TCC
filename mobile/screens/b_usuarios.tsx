import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, RefreshControl} from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import Filter from "../components/Filter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {formatDate} from "../utils/dateFormat";
import {formatCPF} from "../utils/formatCPF";
import {capitalizeFirstLetter} from "../utils/capitalizeFirst";
import api from "../services/api";
import {theme} from "../theme";
import LoadingDots from "react-native-loading-dots";
import Toast from "react-native-toast-message";

type TelaUsuariosNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaUsuariosNavigationProp;
};

const Usuarios: React.FC<Props> = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'nome-asc' | 'nome-desc' | 'data-asc' | 'data-desc' | null>(null);
  const [usuariosData, setUsuariosData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');

      setCurrentUser(user);
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

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setUsuariosData(data);
      } else {
        console.error('Dados inválidos ou vazios recebidos');
        setUsuariosData([]);
      }

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Para o indicador de refresh
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsuarios();
    });

    return unsubscribe;
  }, [navigation]);

  const handleExpand = (id: number) => {
    setExpandedUser(expandedUser === id ? null : id);
  };

  const filterOptions = [
    {key: 'admin', label: 'Administrador', icon: 'shield-checkmark'},
    {key: 'user', label: 'Usuário', icon: 'person'},
    {key: 'superuser', label: 'Super Usuário', icon: 'ribbon'},
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const handleDeleteUser = async (userId: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este usuário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              if (!token) {
                console.error('Token não encontrado');
                return;
              }

              const response = await api.put(`/users/${userId}`, {
                active: false,
                userId: userId,
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.status === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Sucesso!',
                  text2: "Usuário deletado com sucesso.",
                  visibilityTime: 5000
                });
                fetchUsuarios();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Erro!',
                  text2: 'Falha ao excluir o usuário!',
                  visibilityTime: 5000
                });
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro!',
                text2: 'Ocorreu um erro ao excluir o usuário.',
                visibilityTime: 5000
              });
              console.error('Erro ao deletar usuário:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredUsuarios = usuariosData.filter(usuario => {
    if (activeFilters.length > 0) {
      return activeFilters.includes(usuario.roletype);
    }
    return true;
  });

  const sortedUsuarios = filteredUsuarios.sort((a, b) => {
    if (sortOrder === 'nome-asc' || sortOrder === 'nome-desc') {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (sortOrder === 'nome-asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    } else if (sortOrder === 'data-asc' || sortOrder === 'data-desc') {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      if (sortOrder === 'data-asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    }
    return 0;
  });

  const filteredAndSortedUsuarios = sortedUsuarios.filter(usuario =>
    searchText === '' ||
    usuario.name.toLowerCase().includes(searchText.toLowerCase()) ||
    usuario.surname.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.dotsWrapper}>
          <LoadingDots colors={[theme.colors.primary, theme.colors.primary, theme.colors.primary, theme.colors.primary]}/>
        </View>
      </View>
    );
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsuarios();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={theme.colors.primary}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="filter" size={24} color={theme.colors.primary}/>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <Filter
          options={filterOptions}
          selectedOptions={activeFilters}
          onChange={handleFilterChange}
        />
      )}

      {activeFilters.length > 0 && (
        <View style={styles.activeFiltersContainer}>
          {activeFilters.map(filter => (
            <Text key={filter} style={styles.activeFilter}>
              {filter === "user" ? 'Usuário' : filter === "admin" ? 'Administrador' : "Super Usuário"}
            </Text>
          ))}
        </View>
      )}

      <FlatList
        data={filteredAndSortedUsuarios}
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
          <View style={styles.userItem}>
            <View style={styles.main}>
              <AntDesign name="user" size={50} style={{marginRight: 10}} color={theme.colors.primary}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {capitalizeFirstLetter(item.name)} {capitalizeFirstLetter(item.surname)}
                </Text>
                <Text style={styles.userType}>{capitalizeFirstLetter(item.roletype)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleExpand(item.id)}>
                <Ionicons name={expandedUser === item.id ? "chevron-up" : "chevron-down"} size={24} color={theme.colors.primary}/>
              </TouchableOpacity>
            </View>
            {expandedUser === item.id && (
              <View style={styles.detailsWrapper}>
                <View style={styles.userDetails}>
                  <Text style={styles.userDetailsText}>
                    <Text style={{fontWeight: "bold"}}>Nome Completo:</Text> {capitalizeFirstLetter(item.name)} {capitalizeFirstLetter(item.surname)}
                  </Text>
                  <Text style={styles.userDetailsText}>
                    <Text style={{fontWeight: "bold"}}>CPF:</Text> {formatCPF(item.cpf)}
                  </Text>
                  <Text style={styles.userDetailsText}>
                    <Text style={{fontWeight: "bold"}}>Data de Criação:</Text> {formatDate(item.created_at)}
                  </Text>
                </View>
                <View style={styles.userDetailsActions}>
                  <TouchableOpacity style={styles.iconStyle} onPress={() => navigation.navigate('EditUser', { userId: item.id, edit: true })}>
                    <Ionicons name="create-outline" size={24} color={theme.colors.primary}/>
                  </TouchableOpacity>
                  {(item.roletype !== "admin" && item.cpf === currentUser.cpf) && (
                    <TouchableOpacity style={styles.iconStyle} onPress={() => handleDeleteUser(item.id)}>
                      <Ionicons name="trash-outline" size={24} color={theme.colors.primary}/>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  iconStyle: {
    margin: 5,
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
  headerButton: {
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.cards,
    color: theme.colors.white,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    elevation: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterItem: {
    padding: 5,
    fontSize: 16,
    color: theme.colors.primary,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  activeFilter: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  userItem: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 10,
    borderRadius: 5,
  },
  detailsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 10,
    borderRadius: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  userType: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  userDetails: {
    marginTop: 10,
  },
  userDetailsActions: {
    flexDirection: 'column',
    padding: 20,
  },
  userDetailsText: {
    fontSize: 14,
    marginBottom: 5,
    color: theme.colors.primary,
  },
});

export default Usuarios;
