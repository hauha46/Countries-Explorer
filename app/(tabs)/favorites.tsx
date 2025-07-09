import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { CountryCard } from '@/components/CountryCard';
import { CountryDetailsPanel } from '@/components/CountryDetailsPanel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountriesContext } from '@/contexts/CountriesContext';
import { useFunFact } from '@/hooks/useFunFact';
import { Country } from '@/types/country';

export default function FavoritesScreen() {
  const {
    toggleFavorite,
    updateNote,
    favorites,
    favoriteCountries
  } = useCountriesContext();
  
  const { getFunFact, loading: loadingFunFact } = useFunFact();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [funFact, setFunFact] = useState<string | undefined>(undefined);
  
  const handleCountryPress = async (country: Country) => {
    setSelectedCountry(country);
    setShowDetails(true);
    
    try {
      const fact = await getFunFact(country);
      setFunFact(fact);
    } catch (err) {
      console.error('Failed to fetch fun fact:', err);
    }
  };
  
  const handleCloseDetails = () => {
    setShowDetails(false);
    setFunFact(undefined);
    setTimeout(() => setSelectedCountry(null), 300); // Clear after animation
  };
  
  const handleToggleFavorite = (country: Country) => {
    // Toggle the favorite status first
    toggleFavorite(country);
    
    // Close details panel if we're unfavoriting the currently selected country
    if (selectedCountry && selectedCountry.cca3 === country.cca3) {
      handleCloseDetails();
    }
  };
  
  const handleSaveNote = (note: string) => {
    if (selectedCountry) {
      updateNote(selectedCountry.cca3, note);
    }
  };
  
  const renderCountryItem = ({ item }: { item: Country }) => (
    <CountryCard
      country={item}
      isFavorite={true} // All items in this list are favorites
      onPress={() => handleCountryPress(item)}
      onToggleFavorite={() => handleToggleFavorite(item)}
    />
  );
  
  const renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>You haven&apos;t added any favorites yet.</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Browse countries and tap the star icon to add them here.
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Favorites</ThemedText>
      </View>
      
      <FlatList
        data={favoriteCountries}
        keyExtractor={(item) => item.cca3}
        renderItem={renderCountryItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderListEmptyComponent}
      />
      
      <CountryDetailsPanel
        isVisible={showDetails}
        country={selectedCountry}
        isFavorite={true}
        favoriteData={selectedCountry ? favorites[selectedCountry.cca3] : undefined}
        onClose={handleCloseDetails}
        onToggleFavorite={() => selectedCountry && handleToggleFavorite(selectedCountry)}
        onSaveNote={handleSaveNote}
        funFact={funFact}
        isLoadingFunFact={loadingFunFact}
      />
      
      <StatusBar style="auto" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptySubtext: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
});
