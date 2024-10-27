import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StackScreenProps} from '@react-navigation/stack';
import {Ionicons, MaterialIcons, FontAwesome6} from '@expo/vector-icons';
import {TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RootStackParamList} from '.';
import Dashboard from 'screens/a_dashboard';
import Usuarios from 'screens/b_usuarios';
import Chaves from 'screens/c_chaves';
import Imagens from 'screens/d_imagens';
import Acessos from 'screens/e_acessos';
import Doors from '../screens/f_doors';
import TelaInicial from 'screens/g_telaInicial';
import {theme} from "../theme";
import Toast from "react-native-toast-message";

type Props = StackScreenProps<RootStackParamList, 'DrawerNavigator'>;

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({navigation}: Props) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('role');
        console.log('role', role);
        setUserRole(role);
      } catch (error) {
        console.error('Erro ao buscar tipo de usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('role');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Não foi possível fazer logout.',
        visibilityTime: 5000
      });
    }
  }

  if (loading) {
    return null;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.background},
        headerTintColor: theme.colors.primary,
        drawerStyle: {backgroundColor: theme.colors.background, width: 240},
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.primary,
        headerTransparent: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Dashboard',
          drawerIcon: ({size, color}) => (
            <Ionicons name="grid-outline" size={size} color={theme.colors.primary}/>
          ),
        }}
      />

      {(userRole === 'superuser' || userRole === 'admin') && (
        <Drawer.Screen
          name="Users"
          component={Usuarios}
          options={{
            title: 'Usuários',
            drawerIcon: ({size, color}) => (
              <MaterialIcons name="person-outline" size={size} color={theme.colors.primary}/>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NewUser')}
                style={{marginRight: 15}}
              >
                <Ionicons name="add" size={24} color={theme.colors.primary}/>
              </TouchableOpacity>
            ),
          }}
        />
      )}

      {(userRole === 'superuser') && (
        <Drawer.Screen
          name="Keys"
          component={Chaves}
          options={{
            title: 'Chaves',
            drawerIcon: ({size, color}) => (
              <Ionicons name="key-outline" size={size} color={theme.colors.primary}/>
            ),
          }}
        />
      )}

      {(userRole === 'superuser' || userRole === 'user') && (
        <Drawer.Screen
          name="Accesses"
          component={Acessos}
          options={{
            title: 'Acessos',
            drawerIcon: ({size, color}) => (
              <Ionicons name="swap-horizontal-outline" size={size} color={theme.colors.primary}/>
            ),
          }}
        />
      )}

      {(userRole === 'superuser' || userRole === 'admin') && (
        <Drawer.Screen
          name="Doors"
          component={Doors}
          options={{
            title: 'Portas',
            drawerIcon: ({size, color}) => (
              <FontAwesome6 name="door-open" size={size} color={theme.colors.primary}/>
            ),
          }}
        />
      )}

      {userRole && (
        <Drawer.Screen
          name="Images"
          component={Imagens}
          options={{
            title: 'Imagens',
            drawerIcon: ({size, color}) => (
              <Ionicons name="image-outline" size={size} color={theme.colors.primary}/>
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="Logout"
        component={TelaInicial}
        options={{
          title: 'Logout',
          drawerIcon: ({size, color}) => (
            <Ionicons name="log-out-outline" size={size} color={theme.colors.primary}/>
          ),
        }}
        listeners={{
          drawerItemPress: () => {
            handleLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
}
