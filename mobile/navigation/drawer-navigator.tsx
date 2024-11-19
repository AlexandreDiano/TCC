import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StackScreenProps} from '@react-navigation/stack';
import {Ionicons, MaterialIcons, FontAwesome6} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';
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
import {useAuth} from "../contexts/AuthContext";

type Props = StackScreenProps<RootStackParamList, 'DrawerNavigator'>;

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({navigation}: Props) {
  const {role, setToken, setUser, setRole} = useAuth();

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userPhoto');
      await AsyncStorage.removeItem('role');

      setToken(null);
      setUser(null);
      setRole(null);

      navigation.reset({
        index: 0,
        routes: [{name: 'TelaInicial'}],
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Não foi possível fazer logout.',
        visibilityTime: 5000,
      });
    }
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

      {(role === 'superuser' || role === 'admin') && (
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

      {(role === 'superuser') && (
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

      {(role === 'superuser' || role === 'user') && (
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

      {(role === 'superuser' || role === 'admin') && (
        <Drawer.Screen
          name="Doors"
          component={Doors}
          options={{
            title: 'Portas',
            drawerIcon: ({size, color}) => (
              <FontAwesome6 name="door-open" size={size} color={theme.colors.primary}/>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('AddDoor')}
                style={{marginRight: 15}}
              >
                <Ionicons name="add" size={24} color={theme.colors.primary}/>
              </TouchableOpacity>
            ),
          }}
        />
      )}

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
