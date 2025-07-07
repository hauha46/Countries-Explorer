import React, { useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { Region } from '../types/country';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions: Region[] = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
}: SearchFilterBarProps) => {
  const inputRef = useRef<TextInput>(null);
  
  const handleClearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={18} style={styles.searchIcon} color="#8E8E93" />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search countries..."
          placeholderTextColor="#8E8E93"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <IconSymbol name="xmark.circle.fill" size={18} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.regionContainer}>
        {regions.map((region) => (
          <TouchableOpacity
            key={region}
            style={[
              styles.regionButton,
              selectedRegion === region && styles.selectedRegionButton,
            ]}
            onPress={() => onRegionChange(region)}
          >
            <ThemedText
              style={[
                styles.regionText,
                selectedRegion === region && styles.selectedRegionText,
              ]}
            >
              {region}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginLeft: 6,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  regionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  regionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
  },
  selectedRegionButton: {
    backgroundColor: '#007AFF',
  },
  regionText: {
    fontSize: 14,
  },
  selectedRegionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
