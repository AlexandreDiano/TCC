import 'react-native-gesture-handler';

import RootStack from './navigation';
import Toast from "react-native-toast-message";
import React from "react";
import {AuthProvider} from "./contexts/AuthContext";

export default function App() {
  return <AuthProvider>
    <RootStack />
  </AuthProvider>
}