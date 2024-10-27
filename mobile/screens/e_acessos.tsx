import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, RefreshControl} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";
import {theme} from "../theme";
import {capitalizeFirstLetter} from "../utils/capitalizeFirst";
import {formatDate} from "../utils/dateFormat";
import {formatCPF} from "../utils/formatCPF";
import LoadingDots from "react-native-loading-dots";

type TelaChavesNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaChavesNavigationProp;
};

const Acessos: React.FC<Props> = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'data-asc' | 'data-desc' | null>(null);
  const [acessosData, setAcessosData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchAcessos = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.get('/accesses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      setAcessosData(data);
    } catch (error) {
      console.error('Erro ao buscar acessos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAcessos();
  }, []);

  const handleExpand = (id: number) => {
    setExpandedKey(expandedKey === id ? null : id);
  };

  const handleSort = () => {
    if (sortOrder === 'data-asc') {
      setSortOrder('data-desc');
    } else {
      setSortOrder('data-asc');
    }
  };

  const sortedAcessos = [...acessosData].sort((a, b) => {
    if (sortOrder === 'data-asc' || sortOrder === 'data-desc') {
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

  const filteredAndSortedAcessos = sortedAcessos.filter(acesso =>
    searchText === '' ||
    (acesso.door?.description && acesso.door.description.toLowerCase().includes(searchText.toLowerCase()))
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
    fetchAcessos();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pela descrição da porta..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={theme.colors.primary}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="filter" size={24} color={theme.colors.primary}/>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TouchableOpacity onPress={handleSort}>
            <Text style={styles.filterItem}>
              {sortOrder === 'data-asc' ? 'Data Ascendente' : 'Data Descendente'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredAndSortedAcessos}
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
          <View style={styles.keyItem}>
            <View style={styles.main}>
              <Ionicons name="swap-horizontal-outline" size={50} color={theme.colors.primary} style={styles.keyIcon}/>
              <View style={styles.keyInfo}>
                <Text style={styles.keyCode}>{item.door?.description}</Text>
                <Text style={styles.keyDate}>{formatDate(item.created_at)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleExpand(item.id)}>
                <Ionicons name={expandedKey === item.id ? "chevron-up" : "chevron-down"} size={24}
                          color={theme.colors.primary}/>
              </TouchableOpacity>
            </View>
            {expandedKey === item.id && (
              <View style={styles.keyDetails}>
                <View style={styles.keyDetailsItem}>
                  <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary}
                            style={styles.detailIcon}/>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailTitle}>Nome completo:</Text>
                    <Text style={styles.detailText}>{capitalizeFirstLetter(item.user.name)} {capitalizeFirstLetter(item.user.surname)}</Text>
                  </View>
                </View>
                <View style={styles.keyDetailsItem}>
                  <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary}
                            style={styles.detailIcon}/>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailTitle}>CPF: </Text>
                      {formatCPF(item.user.cpf)}
                    </Text>
                  </View>
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
  loadingScreen: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsWrapper: {
    width: 100,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 10,
    borderRadius: 5,
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
    color: theme.colors.primary,
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
  keyItem: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  keyIcon: {
    marginRight: 10,
    color: theme.colors.primary,
  },
  keyInfo: {
    flex: 1,
  },
  keyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  keyDate: {
    fontSize: 14,
    color: theme.colors.white,
  },
  keyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 10,
    borderRadius: 5
  },
  keyDetailsItem: {
    flexDirection: 'row',
    padding: 20,
  },
  detailIcon: {
    marginRight: 10,
    color: theme.colors.primary,
  },
  detailTextContainer: {
    flexDirection: 'column',
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
});

export default Acessos;
