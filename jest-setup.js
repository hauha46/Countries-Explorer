// jest-setup.js
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {},
  AppOwnership: {
    Standalone: 'standalone',
    Expo: 'expo',
    Guest: 'guest',
  },
}));

jest.mock('expo', () => ({
  AppRegistry: {
    registerComponent: jest.fn(),
  },
}));

jest.mock('expo-symbols', () => ({
  SF: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
  AntDesign: 'AntDesign',
  FontAwesome: 'FontAwesome',
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock fetch globally
global.fetch = jest.fn();

// Suppress console warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning')) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning')) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
