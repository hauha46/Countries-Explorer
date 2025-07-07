import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Country, FavoriteCountry, Region } from '../types/country';

const API_URL = 'https://restcountries.com/v3.1/all';
const FAVORITES_STORAGE_KEY = 'country-favorites';
const params = new URLSearchParams({
  fields: "name,cca3,flags,capital,region,subregion,population,languages,currencies"
})

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [favorites, setFavorites] = useState<Record<string, FavoriteCountry>>({});
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}?${params}` );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
      }
      
      const data: Country[] = await response.json();
      // Sort countries alphabetically
      data.sort((a, b) => a.name.common.localeCompare(b.name.common));
      setCountries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        // Filter favorite countries using the newly loaded favorites
        const favCountries = countries.filter(country => !!parsedFavorites[country.cca3]);
        setFavoriteCountries(favCountries);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  // Save favorites to AsyncStorage
  const saveFavorites = async (newFavorites: Record<string, FavoriteCountry>) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (err) {
      console.error('Failed to save favorites:', err);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (country: Country) => {
    const countryId = country.cca3;
    const newFavorites = { ...favorites };
    
    if (newFavorites[countryId]) {
      delete newFavorites[countryId];
    } else {
      newFavorites[countryId] = {
        countryId,
        note: '',
      };
    }
    
    setFavorites(newFavorites);
    // Filter favorite countries using the new favorites state
    const favCountries = countries.filter(c => !!newFavorites[c.cca3]);
    setFavoriteCountries(favCountries);
    saveFavorites(newFavorites);
  };

  // Update note for a favorite country
  const updateNote = (countryId: string, note: string) => {
    if (!favorites[countryId]) return;
    
    const newFavorites = { 
      ...favorites, 
      [countryId]: {
        ...favorites[countryId],
        note,
      }
    };
    
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // Filter countries based on search query and region
  useEffect(() => {
    if (countries.length === 0) return;
    
    let filtered = [...countries];
    
    // Filter by region if not 'All'
    if (selectedRegion !== 'All') {
      filtered = filtered.filter(country => country.region === selectedRegion);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(country => 
        country.name.common.toLowerCase().includes(query)
      );
    }
    
    setFilteredCountries(filtered);
    setPage(1); // Reset to first page when filters change
  }, [countries, searchQuery, selectedRegion]);

  // Initial data fetch
  useEffect(() => {
    fetchCountries();
  }, []);

  // Load favorites after countries are loaded
  useEffect(() => {
    if (countries.length > 0) {
      loadFavorites();
    }
  }, [countries]);

  // Update favoriteCountries whenever favorites or countries change
  useEffect(() => {
    if (countries.length > 0) {
      const favCountries = countries.filter(country => !!favorites[country.cca3]);
      setFavoriteCountries(favCountries);
    }
  }, [favorites, countries]);

  // Get paginated countries
  const getPaginatedCountries = () => {
    const start = 0;
    const end = page * pageSize;
    return filteredCountries.slice(start, end);
  };

  // Load more countries (for infinite scroll)
  const loadMore = () => {
    if (page * pageSize < filteredCountries.length) {
      setPage(page + 1);
    }
  };

  // Check if a country is favorited
  const isFavorite = (countryId: string) => {
    return !!favorites[countryId];
  };

  return {
    countries: getPaginatedCountries(),
    allCountries: countries,
    loading,
    error,
    favorites,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    toggleFavorite,
    updateNote,
    isFavorite,
    loadMore,
    favoriteCountries,
    hasMore: page * pageSize < filteredCountries.length,
    retryFetch: fetchCountries,
  };
};
