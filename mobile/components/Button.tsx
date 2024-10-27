import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {theme} from "../theme";

const CustomButton = ({onPress, title}: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
