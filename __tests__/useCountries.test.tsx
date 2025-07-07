import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import {
  CountriesProvider,
  useCountriesContext,
} from "../contexts/CountriesContext";
import { Country } from "../types/country";

// Mock data
const mockCountries: Country[] = [
  {
    name: { common: "United States", official: "United States of America" },
    cca3: "USA",
    flags: {
      png: "https://flagcdn.com/w320/us.png",
      svg: "https://flagcdn.com/us.svg",
    },
    capital: ["Washington, D.C."],
    region: "Americas",
    subregion: "North America",
    population: 331002651,
    languages: { eng: "English" },
    currencies: { USD: { name: "United States dollar", symbol: "$" } },
  },
  {
    name: { common: "Canada", official: "Canada" },
    cca3: "CAN",
    flags: {
      png: "https://flagcdn.com/w320/ca.png",
      svg: "https://flagcdn.com/ca.svg",
    },
    capital: ["Ottawa"],
    region: "Americas",
    subregion: "North America",
    population: 37742154,
    languages: { eng: "English", fra: "French" },
    currencies: { CAD: { name: "Canadian dollar", symbol: "$" } },
  },
  {
    name: { common: "Japan", official: "Japan" },
    cca3: "JPN",
    flags: {
      png: "https://flagcdn.com/w320/jp.png",
      svg: "https://flagcdn.com/jp.svg",
    },
    capital: ["Tokyo"],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 125836021,
    languages: { jpn: "Japanese" },
    currencies: { JPY: { name: "Japanese yen", symbol: "¥" } },
  },
];

const mockFavoritesStorage = {
  USA: { countryId: "USA", note: "Great country!" },
  JPN: { countryId: "JPN", note: "Love the culture!" },
};

// Wrapper component for testing the context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CountriesProvider>{children}</CountriesProvider>
);

describe("useCountries Hook via CountriesContext", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCountries),
    });

    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockFavoritesStorage)
    );
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  test("should fetch and return countries successfully", async () => {
    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.countries).toEqual([]);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check if countries are loaded and sorted alphabetically
    expect(result.current.allCountries).toHaveLength(3);
    expect(result.current.allCountries[0].name.common).toBe("Canada");
    expect(result.current.allCountries[1].name.common).toBe("Japan");
    expect(result.current.allCountries[2].name.common).toBe("United States");
  });

  test("should load favorites from storage", async () => {
    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Wait for favorites to load
    await waitFor(() => {
      expect(Object.keys(result.current.favorites)).toHaveLength(2);
    });

    expect(result.current.favorites["USA"]).toEqual({
      countryId: "USA",
      note: "Great country!",
    });
    expect(result.current.favorites["JPN"]).toEqual({
      countryId: "JPN",
      note: "Love the culture!",
    });
  });

  test("should toggle favorite status", async () => {
    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(Object.keys(result.current.favorites)).toHaveLength(2);
    });

    const canadaCountry = result.current.allCountries.find(
      (c) => c.cca3 === "CAN"
    );
    expect(canadaCountry).toBeDefined();

    // Initially Canada should not be favorite
    expect(result.current.isFavorite("CAN")).toBe(false);

    // Toggle favorite
    act(() => {
      result.current.toggleFavorite(canadaCountry!);
    });

    // Now Canada should be favorite
    expect(result.current.isFavorite("CAN")).toBe(true);
    expect(result.current.favorites["CAN"]).toEqual({
      countryId: "CAN",
      note: "",
    });

    // Toggle again to remove from favorites
    act(() => {
      result.current.toggleFavorite(canadaCountry!);
    });

    expect(result.current.isFavorite("CAN")).toBe(false);
    expect(result.current.favorites["CAN"]).toBeUndefined();
  });

  test("should update note for favorite country", async () => {
    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(Object.keys(result.current.favorites)).toHaveLength(2);
    });

    // Update note for USA
    act(() => {
      result.current.updateNote("USA", "Updated note for USA");
    });

    expect(result.current.favorites["USA"].note).toBe("Updated note for USA");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "country-favorites",
      expect.stringContaining("Updated note for USA")
    );
  });

  test("should filter countries by search query", async () => {
    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Search for "japan"
    act(() => {
      result.current.setSearchQuery("japan");
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(1);
      expect(result.current.countries[0].name.common).toBe("Japan");
    });
  });

  test("should filter countries by region", async () => {
    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Filter by Americas
    act(() => {
      result.current.setSelectedRegion("Americas");
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(2);
      expect(
        result.current.countries.every((c) => c.region === "Americas")
      ).toBe(true);
    });
  });

  test("should handle API error", async () => {
    // Mock failed fetch
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.allCountries).toHaveLength(0);
  });

  test("should handle pagination correctly", async () => {
    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Initially should show first page (all countries since we have less than page size)
    expect(result.current.countries).toHaveLength(3);
    expect(result.current.hasMore).toBe(false);

    // Test loadMore (should not add more since we already have all)
    act(() => {
      result.current.loadMore();
    });

    expect(result.current.countries).toHaveLength(3);
  });

  test("should retry fetch on error", async () => {
    // Mock initial failed fetch
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useCountriesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");

    // Mock successful retry
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCountries),
    });

    // Retry fetch
    await act(async () => {
      await result.current.retryFetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.allCountries).toHaveLength(3);
  });
});
