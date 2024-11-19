import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, RefreshControl} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";
import {theme} from "../theme";
import {formatDate} from "../utils/dateFormat";
import {capitalizeFirstLetter} from "../utils/capitalizeFirst";
import {formatCPF} from "../utils/formatCPF";
import LoadingDots from "react-native-loading-dots";
import {useAuth} from "../contexts/AuthContext";

type TelaChavesNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaChavesNavigationProp;
};

const Chaves: React.FC<Props> = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'data-asc' | 'data-desc' | null>(null);
  const [chavesData, setChavesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  const {token} = useAuth();

  const fetchChaves = async () => {
    try {
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await api.get('/keys', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      setChavesData(data);
    } catch (error) {
      console.error('Erro ao buscar chaves:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChaves();
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

  const sortedChaves = [...chavesData].sort((a, b) => {
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

  const filteredAndSortedChaves = sortedChaves.filter(chave =>
    searchText === '' ||
    chave.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchChaves();
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pelo código..."
          value={searchText}
          placeholderTextColor={theme.colors.primary}
          onChangeText={setSearchText}
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
        data={filteredAndSortedChaves}
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
              <Ionicons name="key" size={50} color={theme.colors.primary} style={styles.keyIcon}/>
              <View style={styles.keyInfo}>
                <Text style={styles.keyCode}>{item.code}</Text>
                <Text style={styles.keyDate}>{formatDate(item.created_at)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleExpand(item.id)}>
                <Ionicons name={expandedKey === item.id ? "chevron-up" : "chevron-down"} size={24}
                          color={theme.colors.primary}/>
              </TouchableOpacity>
            </View>
            {expandedKey === item.id && (
              <View style={styles.detailsWrapper}>
                <View style={styles.userDetails}>
                  {item.user && (
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.keyDetailsText}>
                        <Text style={styles.detailTitle}>Credenciado: </Text> {item.user.name} {item.user.surname}
                      </Text>
                    </View>
                  )}
                  {item.description && (
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.keyDetailsText}>
                        <Text style={styles.detailTitle}>Descrição: </Text> {item.description}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.keyDetailsItem}>
                  <TouchableOpacity onPress={() => navigation.navigate('Association', {id: item.id})}>
                    <Ionicons name="link" size={24} color={theme.colors.primary}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('AccessConfig', {id: item.id})}>
                    <Ionicons name="settings" size={24} color={theme.colors.primary}/>
                  </TouchableOpacity>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  keyDetailsText: {
    fontSize: 14,
    marginBottom: 5,
    color: theme.colors.primary,
  },
  detailsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 10,
    borderRadius: 5,
  },
  userDetails: {
    marginTop: 10,
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
    marginTop: 10,
  },
  keyDetailsItem: {
    flexDirection: 'column',
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

export default Chaves;
