import React, {useState, useEffect} from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Ionicons, FontAwesome6} from '@expo/vector-icons';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import {capitalizeFirstLetter} from '../utils/capitalizeFirst';
import {formatCPF} from '../utils/formatCPF';
import {formatDate} from '../utils/dateFormat';
import {getGreeting} from '../utils/greeting';
import {theme} from "../theme";
import LoadingDots from "react-native-loading-dots";
import Toast from "react-native-toast-message";

type TelaDashboardNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: TelaDashboardNavigationProp;
};

const Dashboard: React.FC<Props> = ({navigation}) => {
  const [dashInfos, setDashInfos] = useState<any>();
  const [lastUsers, setLastUsers] = useState<any>();
  const [accessesHistory, setAcessesHistory] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState('Usuário');
  const [currentRole, setCurrentRole] = useState<any>();

  const [showCredenciados, setShowCredenciados] = useState(false);
  const [showAcessos, setShowAcessos] = useState(false);

  useEffect(() => {
    const loadUserName = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
        setCurrentRole(storedRole);
      }
    };

    loadUserName();

    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{capitalizeFirstLetter(userName)}</Text>
        </View>
      ),
    });
  }, [navigation, userName]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        if(currentRole === 'user'){
          const [dashInfosRes] = await Promise.all([
            api.get('/dashinfos', {headers}),
          ]);

          setDashInfos(dashInfosRes.data || 0);
        }else{
          const [dashInfosRes, accessHistoryRes, lastUsersRes] = await Promise.all([
            api.get('/dashinfos', {headers}),
            api.get('/accesshistory', {headers}),
            api.get('/lastusers', {headers}),
          ]);

          setDashInfos(dashInfosRes.data || 0);
          setAcessesHistory(accessHistoryRes.data || []);
          setLastUsers(lastUsersRes.data || []);
        }


      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentRole]);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.dotsWrapper}>
          <LoadingDots colors={[theme.colors.primary, theme.colors.primary, theme.colors.primary, theme.colors.primary]}/>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardTitleContainer}>
          <Ionicons name="grid-outline" size={24} color={theme.colors.primary} style={styles.icon}/>
          <Text style={styles.dashboardTitle}>| Dashboard</Text>
        </View>
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Ionicons name="person-outline" size={24} color={theme.colors.primary}/>
            <Text style={styles.cardTitle}>Usuários</Text>
            <Text style={styles.cardNumber}>{dashInfos?.domain_users_count || 0}</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.primary}/>
            <Text style={styles.cardTitle}>Acessos Hoje</Text>
            <Text style={styles.cardNumber}>{dashInfos?.today_accesses_count || 0}</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.primary}/>
            <Text style={styles.cardTitle}>Acessos Mês</Text>
            <Text style={styles.cardNumber}>{dashInfos?.month_accesses_count || 0}</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.primary}/>
            <Text style={styles.cardTitle}>Acessos Total</Text>
            <Text style={styles.cardNumber}>{dashInfos?.all_accesses_count || 0}</Text>
          </View>
        </View>

        <View style={styles.shortcutContainer}>
          <View style={styles.shortcutTitleContainer}>
            <Ionicons name="open-outline" size={24} color={theme.colors.primary} style={styles.icon}/>
            <Text style={styles.shortcutTitle}>| Atalhos</Text>
          </View>

          {currentRole === 'user' ? (
            <View style={styles.shortcutItemsContainer}>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Accesses')}>
                <Ionicons name="swap-horizontal-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Acessos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Images')}>
                <Ionicons name="image-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Imagens</Text>
              </TouchableOpacity>
            </View>
          ) : currentRole === 'admin' ? (
            <View style={styles.shortcutItemsContainer}>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Users')}>
                <Ionicons name="people-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Usuários</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Doors')}>
                <FontAwesome6 name="door-open" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Portas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Images')}>
                <Ionicons name="image-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Imagens</Text>
              </TouchableOpacity>
            </View>
            ) : (
            <View style={styles.shortcutItemsContainer}>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Users')}>
                <Ionicons name="people-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Usuários</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Keys')}>
                <Ionicons name="key-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Chaves</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Doors')}>
                <FontAwesome6 name="door-open" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Portas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Accesses')}>
                <Ionicons name="swap-horizontal-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Acessos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Images')}>
                <Ionicons name="image-outline" size={24} color={theme.colors.primary}/>
                <Text style={styles.shortcutLabel}>Imagens</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyTitleContainer}>
            <FontAwesome6 name="clock-rotate-left" size={24} color={theme.colors.primary} style={styles.icon}/>
            <Text style={styles.historyTitle}>| Histórico</Text>
          </View>

          {currentRole === 'superuser' && (
            <>
              <TouchableOpacity onPress={() => setShowCredenciados(!showCredenciados)} style={styles.historyDrop}>
                <Text style={styles.historyLabel}>Credenciados (últimos 5)</Text>
                <Ionicons name={showCredenciados ? 'caret-up-outline' : 'caret-down-outline'} size={24}
                          color={theme.colors.primary}/>
              </TouchableOpacity>
              {showCredenciados && (
                <View style={styles.historyList}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Nome</Text>
                    <Text style={styles.tableHeaderText}>CPF</Text>
                    <Text style={styles.tableHeaderText}>Data de Criação</Text>
                  </View>
                  {lastUsers.map((item: any, index: any) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>
                        {capitalizeFirstLetter(item.name)} {capitalizeFirstLetter(item.surname)}
                      </Text>
                      <Text style={styles.tableCell}>{formatCPF(item.cpf)}</Text>
                      <Text style={styles.tableCell}>{formatDate(item.created_at)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <TouchableOpacity onPress={() => setShowAcessos(!showAcessos)} style={styles.historyDrop}>
            <Text style={styles.historyLabel}>Acessos (últimos 5)</Text>
            <Ionicons name={showAcessos ? 'caret-up-outline' : 'caret-down-outline'} size={24}
                      color={theme.colors.primary}/>
          </TouchableOpacity>
          {showAcessos && (
            <View style={styles.historyList}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Nome</Text>
                <Text style={styles.tableHeaderText}>Acesso</Text>
                <Text style={styles.tableHeaderText}>Porta</Text>
              </View>
              {accessesHistory.map((item: any, index: any) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {capitalizeFirstLetter(item.user.name)} {capitalizeFirstLetter(item.user.surname)}
                  </Text>
                  <Text style={styles.tableCell}>{formatDate(item.created_at)}</Text>
                  <Text style={styles.tableCell}>{item.door.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
    ;
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerRightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 15,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.26)",
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
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  dashboardContainer: {
    flex: 1,
    padding: 20,
  },
  dashboardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  dashboardTitle: {
    fontSize: 24,
    textAlignVertical: 'center',
    color: theme.colors.primary,
  },
  icon: {
    marginRight: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  card: {
    width: 160,
    margin: 10,
    padding: 23,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cards,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    marginTop: 10,
    color: theme.colors.primary,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: theme.colors.primary,
  },
  shortcutContainer: {
    marginBottom: 30,
  },
  shortcutTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  shortcutTitle: {
    fontSize: 24,
    textAlignVertical: 'center',
    color: theme.colors.primary,
  },
  shortcutItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shortcut: {
    width: 100,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cards,
    elevation: 5,
  },
  shortcutLabel: {
    fontSize: 14,
    marginTop: 5,
    color: theme.colors.primary,
  },
  historyContainer: {
    marginBottom: 30,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 24,
    textAlignVertical: 'center',
    color: theme.colors.primary,
  },
  historyDrop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  historyLabel: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  historyList: {
    backgroundColor: theme.colors.cards,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  historyListItem: {
    fontSize: 16,
    color: theme.colors.background,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    padding: 10,
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.primary,
  },
});

export default Dashboard;
