import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  const handleFilterSelection = (index) => {
    const newSelections = [...selections];
    newSelections[index] = !newSelections[index];
    onChange(newSelections);
  };

  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleFilterSelection(index)}
          style={[
            styles.filterButton,
            {
              backgroundColor: selections[index] ? '#495e57' : '#edefee',
              marginRight: index === sections.length - 1 ? 0 : 15,
            },
          ]}>
          <Text style={[styles.filterButtonText, { color: selections[index] ? '#edefee' : '#495e57' }]}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 15,
  },
  filterButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  filterButtonText: {
    fontWeight: 'bold',
  },
});

export default Filters;
