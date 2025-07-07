import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { CountryDetailsPanel } from "../components/CountryDetailsPanel";
import { Country, FavoriteCountry } from "../types/country";

// Mock expo-image
jest.mock("expo-image", () => ({
  Image: ({ source, style, testID }: any) => {
    const MockedImage = require("react-native").Text;
    return (
      <MockedImage testID={testID} style={style}>
        {source.uri}
      </MockedImage>
    );
  },
}));

// Mock IconSymbol
jest.mock("../components/ui/IconSymbol", () => ({
  IconSymbol: ({ name, size, color, testID }: any) => {
    const MockedIcon = require("react-native").Text;
    return (
      <MockedIcon testID={testID}>{`${name}-${size}-${color}`}</MockedIcon>
    );
  },
}));

// Mock ThemedText and ThemedView
jest.mock("../components/ThemedText", () => ({
  ThemedText: ({ children, style, type, testID }: any) => {
    const MockedText = require("react-native").Text;
    return (
      <MockedText testID={testID || "themed-text"} style={style}>
        {children}
      </MockedText>
    );
  },
}));

jest.mock("../components/ThemedView", () => ({
  ThemedView: ({ children, style, testID }: any) => {
    const MockedView = require("react-native").View;
    return (
      <MockedView testID={testID || "themed-view"} style={style}>
        {children}
      </MockedView>
    );
  },
}));

describe("CountryDetailsPanel", () => {
  const mockCountry: Country = {
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
  };

  const mockFavoriteData: FavoriteCountry = {
    countryId: "USA",
    note: "Great country to visit!",
  };

  const defaultProps = {
    isVisible: true,
    country: mockCountry,
    isFavorite: false,
    onClose: jest.fn(),
    onToggleFavorite: jest.fn(),
    onSaveNote: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders when visible with country data", () => {
    const { getByText } = render(<CountryDetailsPanel {...defaultProps} />);

    expect(getByText("United States")).toBeTruthy();
    expect(getByText("https://flagcdn.com/us.svg")).toBeTruthy();
  });

  test("does not render when not visible", () => {
    const { queryByText } = render(
      <CountryDetailsPanel {...defaultProps} isVisible={false} />
    );

    expect(queryByText("United States")).toBeNull();
  });

  test("returns null when country is null", () => {
    const { queryByTestId } = render(
      <CountryDetailsPanel {...defaultProps} country={null} />
    );

    expect(queryByTestId("themed-view")).toBeNull();
  });

  test("displays correct country information", () => {
    const { getByText } = render(<CountryDetailsPanel {...defaultProps} />);

    expect(getByText("United States")).toBeTruthy();
    expect(getByText("Americas")).toBeTruthy();
    expect(getByText("North America")).toBeTruthy();
    expect(getByText("Washington, D.C.")).toBeTruthy();
    expect(getByText("331,002,651")).toBeTruthy(); // Formatted population
    expect(getByText("English")).toBeTruthy();
    expect(getByText("United States dollar ($)")).toBeTruthy();
  });

  test("shows correct star icon when not favorite", () => {
    const { getByText } = render(
      <CountryDetailsPanel {...defaultProps} isFavorite={false} />
    );

    expect(getByText("star-24-#8E8E93")).toBeTruthy();
  });

  test("shows correct star icon when favorite", () => {
    const { getByText } = render(
      <CountryDetailsPanel {...defaultProps} isFavorite={true} />
    );

    expect(getByText("star.fill-24-#FFD700")).toBeTruthy();
  });

  test("calls onClose when close button is pressed", () => {
    const mockOnClose = jest.fn();
    const { getByTestId } = render(
      <CountryDetailsPanel {...defaultProps} onClose={mockOnClose} />
    );

    fireEvent.press(getByTestId("close-details-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onToggleFavorite when favorite button is pressed", () => {
    const mockOnToggleFavorite = jest.fn();
    const { getByTestId } = render(
      <CountryDetailsPanel
        {...defaultProps}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    fireEvent.press(getByTestId("favorite-button-details"));
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
  });

  test("loads note from favoriteData when panel opens", async () => {
    const { getByDisplayValue } = render(
      <CountryDetailsPanel
        {...defaultProps}
        favoriteData={mockFavoriteData}
        isFavorite={true}
      />
    );

    await waitFor(() => {
      expect(getByDisplayValue("Great country to visit!")).toBeTruthy();
    });
  });

  test("saves note when input changes and save button is pressed", async () => {
    const mockOnSaveNote = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <CountryDetailsPanel
        {...defaultProps}
        onSaveNote={mockOnSaveNote}
        isFavorite={true}
      />
    );

    const noteInput = getByPlaceholderText("Add a note about this country...");
    fireEvent.changeText(noteInput, "My new note");

    const saveButton = getByText("Save Note");
    fireEvent.press(saveButton);

    expect(mockOnSaveNote).toHaveBeenCalledWith("My new note");
  });

  test("displays fun fact when provided", () => {
    const { getByText } = render(
      <CountryDetailsPanel
        {...defaultProps}
        funFact="This is an interesting fact about the country!"
      />
    );

    expect(
      getByText("This is an interesting fact about the country!")
    ).toBeTruthy();
  });

  test("shows loading indicator when fun fact is loading", () => {
    const { getByText } = render(
      <CountryDetailsPanel {...defaultProps} isLoadingFunFact={true} />
    );

    expect(getByText("Loading fun fact...")).toBeTruthy();
  });

  test("resets note when panel closes and reopens", async () => {
    const { rerender, queryByDisplayValue } = render(
      <CountryDetailsPanel
        {...defaultProps}
        favoriteData={mockFavoriteData}
        isFavorite={true}
      />
    );

    // Panel is open, note should be loaded
    await waitFor(() => {
      expect(queryByDisplayValue("Great country to visit!")).toBeTruthy();
    });

    // Close panel
    rerender(
      <CountryDetailsPanel
        {...defaultProps}
        isVisible={false}
        favoriteData={mockFavoriteData}
        isFavorite={true}
      />
    );

    // Reopen panel
    rerender(
      <CountryDetailsPanel
        {...defaultProps}
        favoriteData={mockFavoriteData}
        isFavorite={true}
      />
    );

    // Note should be loaded again
    await waitFor(() => {
      expect(queryByDisplayValue("Great country to visit!")).toBeTruthy();
    });
  });

  test("handles country with no languages", () => {
    const countryWithoutLanguages = {
      ...mockCountry,
      languages: undefined,
    };

    const { getByText } = render(
      <CountryDetailsPanel
        {...defaultProps}
        country={countryWithoutLanguages}
      />
    );

    expect(getByText("None")).toBeTruthy();
  });

  test("handles country with no currencies", () => {
    const countryWithoutCurrencies = {
      ...mockCountry,
      currencies: undefined,
    };

    const { getByText } = render(
      <CountryDetailsPanel
        {...defaultProps}
        country={countryWithoutCurrencies}
      />
    );

    expect(getByText("None")).toBeTruthy();
  });

  test("handles country with multiple languages", () => {
    const countryWithMultipleLanguages = {
      ...mockCountry,
      languages: { eng: "English", spa: "Spanish", fra: "French" },
    };

    const { getByText } = render(
      <CountryDetailsPanel
        {...defaultProps}
        country={countryWithMultipleLanguages}
      />
    );

    expect(getByText("English, Spanish, French")).toBeTruthy();
  });

  test("handles country with multiple currencies", () => {
    const countryWithMultipleCurrencies = {
      ...mockCountry,
      currencies: {
        USD: { name: "US Dollar", symbol: "$" },
        EUR: { name: "Euro", symbol: "€" },
      },
    };

    const { getByText } = render(
      <CountryDetailsPanel
        {...defaultProps}
        country={countryWithMultipleCurrencies}
      />
    );

    expect(getByText("US Dollar ($), Euro (€)")).toBeTruthy();
  });

  test("formats large population numbers correctly", () => {
    const countryWithLargePopulation = {
      ...mockCountry,
      population: 1234567890,
    };

    const { getByText } = render(
      <CountryDetailsPanel
        {...defaultProps}
        country={countryWithLargePopulation}
      />
    );

    expect(getByText("1,234,567,890")).toBeTruthy();
  });

  test("prefers SVG flag over PNG when available", () => {
    const { getByText } = render(<CountryDetailsPanel {...defaultProps} />);

    // Should use SVG flag
    expect(getByText("https://flagcdn.com/us.svg")).toBeTruthy();
  });

  test("falls back to PNG flag when SVG not available", () => {
    const countryWithoutSvgFlag = {
      ...mockCountry,
      flags: { png: "https://flagcdn.com/w320/us.png", svg: "" },
    };

    const { getByText } = render(
      <CountryDetailsPanel {...defaultProps} country={countryWithoutSvgFlag} />
    );

    expect(getByText("https://flagcdn.com/w320/us.png")).toBeTruthy();
  });
});
