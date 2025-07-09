import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { CountryCard } from "@/components/CountryCard";
import { CountryDetailsPanel } from "@/components/CountryDetailsPanel";
import { ErrorBanner } from "@/components/ErrorBanner";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCountriesContext } from "@/contexts/CountriesContext";
import { useFunFact } from "@/hooks/useFunFact";
import { Country, Region } from "@/types/country";

export default function CountriesScreen() {
  const {
    countries,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    toggleFavorite,
    updateNote,
    isFavorite,
    loadMore,
    hasMore,
    retryFetch,
    favorites,
  } = useCountriesContext();

  const { getFunFact, loading: loadingFunFact } = useFunFact();

  const [showError, setShowError] = useState<boolean>(!!error);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [funFact, setFunFact] = useState<string | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      // Reset any UI state when screen is focused
      setShowError(!!error);
    }, [error])
  );

  const handleDismissError = () => {
    setShowError(false);
  };

  const handleRetry = () => {
    retryFetch();
    setShowError(false);
  };

  const handleCountryPress = async (country: Country) => {
    setSelectedCountry(country);
    setShowDetails(true);

    try {
      const fact = await getFunFact(country);
      setFunFact(fact);
    } catch (err) {
      console.error("Failed to fetch fun fact:", err);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setFunFact(undefined);
    setTimeout(() => setSelectedCountry(null), 300); // Clear after animation
  };

  const handleToggleFavorite = (country: Country) => {
    toggleFavorite(country);
  };

  const handleSaveNote = (note: string) => {
    if (selectedCountry) {
      updateNote(selectedCountry.cca3, note);
    }
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <CountryCard
      country={item}
      isFavorite={isFavorite(item.cca3)}
      onPress={() => handleCountryPress(item)}
      onToggleFavorite={() => handleToggleFavorite(item)}
    />
  );

  const renderListEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText>Loading countries...</ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <ThemedText>No countries found matching your criteria.</ThemedText>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore || countries.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ThemedText>Loading more countries...</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Countries</ThemedText>
      </View>

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion as Region}
        onRegionChange={setSelectedRegion}
      />

      {error && showError && (
        <ErrorBanner
          message={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      )}

      <FlatList
        data={countries}
        keyExtractor={(item) => item.cca3}
        renderItem={renderCountryItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      <CountryDetailsPanel
        isVisible={showDetails}
        country={selectedCountry}
        isFavorite={selectedCountry ? isFavorite(selectedCountry.cca3) : false}
        favoriteData={selectedCountry ? favorites[selectedCountry.cca3] : undefined}
        onClose={handleCloseDetails}
        onToggleFavorite={() =>
          selectedCountry && handleToggleFavorite(selectedCountry)
        }
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
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  footerLoader: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
