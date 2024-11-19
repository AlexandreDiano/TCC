import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import DrawerNavigator from './drawer-navigator';
import AuthLoading from "../screens/Auth";
import Login from "../screens/h_login";
import TelaInicial from "../screens/g_telaInicial";
import React from "react";
import AddDoor from "../screens/AddDoor";
import {theme} from "../theme";
import j_novousuario from 'screens/j_novousuario';
import i_cadastro from 'screens/i_cadastro';
import k_associarchave from "../screens/k_associarchave";
import l_configuraracesso from "../screens/l_configuraracesso";
import Toast, {BaseToast, ErrorToast} from "react-native-toast-message";

export type RootStackParamList = {
  DrawerNavigator: undefined;
  Dashboard: undefined;
  Usuarios: undefined;
  Chaves: undefined;
  Imagens: undefined;
  Acessos: undefined;
  Configs: undefined;
  TelaInicial: undefined;
  Login: undefined;
  Cadastro: undefined;
  NewUser: undefined;
  AddDoor: undefined;
  AuthLoading: undefined;
  Association: undefined;
  EditUser: undefined;
  AccessConfig: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green', backgroundColor: theme.colors.toast, width: 420, height: 100}}
      text1Style={{
        fontSize: 20,
        fontWeight: 'bold'
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: 'red', backgroundColor: theme.colors.toast, width: 420, height: 100}}
      text1Style={{
        fontSize: 20,
        fontWeight: 'bold'
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
};

export default function RootStack() {
  return (
    <NavigationContainer theme={{
      dark: false,
      colors: {
        background: theme.colors.background,
        primary: theme.colors.primary,
        text: theme.colors.primary,
        card: theme.colors.cards,
        border: theme.colors.primary,
        notification: theme.colors.toast
      },
    }}>
      <Stack.Navigator
        initialRouteName="AuthLoading"
      >
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoading}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddDoor"
          component={AddDoor}
          options={{title: 'Adicionar Porta'}}
        />
        <Stack.Screen
          name="Association"
          component={k_associarchave}
          options={{title: 'Associar Chave'}}
        />
        <Stack.Screen
          name="EditUser"
          component={i_cadastro}
          options={{title: 'Editar Usuário'}}
        />
        <Stack.Screen
          name="AccessConfig"
          component={l_configuraracesso}
          options={{title: 'Configurar Acesso'}}
        />
        <Stack.Screen
          name="NewUser"
          component={j_novousuario}
          options={{title: 'Cadastrar Usuário'}}
        />
        <Stack.Screen
          name="Register"
          component={i_cadastro}
        />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{headerShown: false, headerTitleAlign: 'center'}}
        />
        <Stack.Screen
          name="TelaInicial"
          component={TelaInicial}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
      <Toast config={toastConfig}/>
    </NavigationContainer>
  );
}
