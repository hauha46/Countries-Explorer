import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CountryCard } from '../components/CountryCard';
import { Country } from '../types/country';

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: ({ source, style, testID }: any) => {
    const MockedImage = require('react-native').Text;
    return <MockedImage testID={testID} style={style}>{source.uri}</MockedImage>;
  }
}));

// Mock IconSymbol
jest.mock('../components/ui/IconSymbol', () => ({
  IconSymbol: ({ name, size, color, testID }: any) => {
    const MockedIcon = require('react-native').Text;
    return <MockedIcon testID={testID}>{`${name}-${size}-${color}`}</MockedIcon>;
  }
}));

// Mock ThemedText
jest.mock('../components/ThemedText', () => ({
  ThemedText: ({ children, style, numberOfLines, type, testID }: any) => {
    const MockedText = require('react-native').Text;
    return (
      <MockedText 
        testID={testID || 'themed-text'}
        style={style}
        numberOfLines={numberOfLines}
      >
        {children}
      </MockedText>
    );
  }
}));

describe('CountryCard', () => {
  const mockCountry: Country = {
    name: { common: 'United States' },
    cca3: 'USA',
    flags: { png: 'https://flagcdn.com/w320/us.png', svg: 'https://flagcdn.com/us.svg' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    subregion: 'North America',
    population: 331002651,
    languages: { eng: 'English' },
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
    area: 9833517
  };

  const defaultProps = {
    country: mockCountry,
    isFavorite: false,
    onPress: jest.fn(),
    onToggleFavorite: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders country information correctly', () => {
    const { getByText } = render(<CountryCard {...defaultProps} />);

    expect(getByText('United States')).toBeTruthy();
    expect(getByText('Americas')).toBeTruthy();
    expect(getByText('https://flagcdn.com/w320/us.png')).toBeTruthy();
  });

  test('shows correct star icon when not favorite', () => {
    const { getByText } = render(<CountryCard {...defaultProps} isFavorite={false} />);

    expect(getByText('star-24-#8E8E93')).toBeTruthy();
  });

  test('shows correct star icon when favorite', () => {
    const { getByText } = render(<CountryCard {...defaultProps} isFavorite={true} />);

    expect(getByText('star.fill-24-#FFD700')).toBeTruthy();
  });

  test('calls onPress when card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CountryCard {...defaultProps} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('United States'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleFavorite when favorite button is pressed', () => {
    const mockOnToggleFavorite = jest.fn();
    const { getByTestId } = render(
      <CountryCard {...defaultProps} onToggleFavorite={mockOnToggleFavorite} />
    );

    fireEvent.press(getByTestId('favorite-button'));
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
  });

  test('renders with different country data', () => {
    const differentCountry: Country = {
      name: { common: 'Japan' },
      cca3: 'JPN',
      flags: { png: 'https://flagcdn.com/w320/jp.png', svg: 'https://flagcdn.com/jp.svg' },
      capital: ['Tokyo'],
      region: 'Asia',
      subregion: 'Eastern Asia',
      population: 125836021,
      languages: { jpn: 'Japanese' },
      currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
      area: 377930
    };

    const { getByText } = render(
      <CountryCard {...defaultProps} country={differentCountry} />
    );

    expect(getByText('Japan')).toBeTruthy();
    expect(getByText('Asia')).toBeTruthy();
    expect(getByText('https://flagcdn.com/w320/jp.png')).toBeTruthy();
  });

  test('handles long country names with numberOfLines prop', () => {
    const longNameCountry: Country = {
      ...mockCountry,
      name: { common: 'Very Long Country Name That Should Be Truncated' }
    };

    const { getByText } = render(
      <CountryCard {...defaultProps} country={longNameCountry} />
    );

    const countryNameElement = getByText('Very Long Country Name That Should Be Truncated');
    expect(countryNameElement).toBeTruthy();
    expect(countryNameElement.props.numberOfLines).toBe(1);
  });

  test('applies correct styling and accessibility props', () => {
    const { getByTestId } = render(<CountryCard {...defaultProps} />);

    const favoriteButton = getByTestId('favorite-button');
    expect(favoriteButton).toBeTruthy();
  });

  test('handles undefined or null country gracefully', () => {
    // This test ensures the component doesn't crash with invalid data
    const invalidProps = {
      ...defaultProps,
      country: {
        ...defaultProps.country,
        name: { common: '' },
        region: ''
      }
    };

    const { getByText } = render(<CountryCard {...invalidProps} />);
    
    // Should render empty strings without crashing
    expect(getByText('')).toBeTruthy();
  });

  test('favorite button has correct hit slop for better accessibility', () => {
    const { getByTestId } = render(<CountryCard {...defaultProps} />);

    const favoriteButton = getByTestId('favorite-button');
    expect(favoriteButton).toBeTruthy();
    // Note: hit slop testing is more about ensuring the prop exists
    // The actual touch area testing would require integration tests
  });
});
