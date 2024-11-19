import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from "../theme";

type FilterOption = {
  key: string;
  label: string;
  icon: string;
};

type FilterProps = {
  options: FilterOption[];
  selectedOptions: string[];
  onChange: (option: string) => void;
};

function Filter({options, selectedOptions, onChange}: FilterProps) {
  return (
    <View style={styles.filtersContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option.key}
          style={styles.filterButton}
          onPress={() => onChange(option.key)}
        >
          <Ionicons
            // @ts-ignore
            name={option.icon}
            size={20}
            color={selectedOptions.includes(option.key) ? theme.colors.primary : 'gray'}
          />
          <Text
            style={[
              styles.filterText,
              selectedOptions.includes(option.key) && styles.activeFilterText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginRight: 10,
  },
  filterText: {
    fontSize: 16,
    marginLeft: 5,
    color: 'gray',
  },
  activeFilterText: {
    color: theme.colors.primary,
  },
});

export default Filter;
