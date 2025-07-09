# Countries Explorer 🌍

A React Native app built with Expo that lets you explore countries around the world, save your favorites, and discover interesting facts powered by AI.

## ✨ Features

- **🌍 Countries Exploration**: Browse and search through countries worldwide
- **⭐ Favorites Management**: Save countries to your favorites for quick access
- **📝 Personal Notes**: Add and save personal notes for each country
- **🤖 AI Fun Facts**: Get interesting facts about countries powered by OpenAI
- **🔍 Advanced Search**: Search countries by name, region, or other criteria
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🎨 Modern UI**: Beautiful, responsive design with dark/light theme support
- **💾 Offline Storage**: Your favorites and notes are saved locally

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- OpenAI API key (optional, for fun facts feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shoptivitylabs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your OpenAI API key to `.env`:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```
   > ⚠️ **Note**: The `EXPO_PUBLIC_` prefix is required for Expo to make the variable accessible in the client code.

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal or scan QR code with Camera app
   - **Android Emulator**: Press `a` in the terminal or scan QR code with Expo Go
   - **Web Browser**: Press `w` in the terminal
   - **Physical Device**: Install Expo Go and scan the QR code

## 🏗️ Project Structure

```
shoptivitylabs/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── countries.tsx  # Countries exploration screen
│   │   └── favorites.tsx  # Favorites management screen
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── CountryCard.tsx   # Country display component
├── contexts/             # React Context providers
│   └── CountriesContext.tsx # Global state management
├── hooks/                # Custom React hooks
│   ├── useCountries.ts   # Countries data and favorites logic
│   ├── useFunFact.ts     # OpenAI integration for fun facts
│   └── useThemeColor.ts  # Theme and color management
├── types/                # TypeScript type definitions
│   └── country.ts        # Country data types
└── __tests__/            # Test files
```

## 🧪 Testing

This project includes comprehensive test coverage with Jest and React Native Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Setup

- **Jest Configuration**: Configured for React Native with Expo
- **Testing Library**: Uses React Native Testing Library for component testing
- **Mocks**: Comprehensive mocking for Expo modules and external dependencies
- **Coverage**: Tracks test coverage across TypeScript files

## 🔧 Technical Stack

### Core Technologies
- **React Native**: 0.79.5
- **Expo**: ~53.0.17 with new architecture enabled
- **React**: 19.0.0
- **TypeScript**: ~5.8.3
- **Expo Router**: File-based routing system

### Key Dependencies
- **@react-native-async-storage/async-storage**: Local data persistence
- **expo-symbols**: Native SF Symbols (iOS) with Material Icons fallback
- **expo-image**: Optimized image loading and caching
- **@expo/vector-icons**: Icon library
- **react-native-gesture-handler**: Enhanced gesture support
- **react-native-reanimated**: Smooth animations

### Development Tools
- **ESLint**: Code linting with Expo config
- **Jest**: Testing framework
- **React Native Testing Library**: Component testing utilities
- **TypeScript**: Static type checking

## 🎯 Key Features Implementation

### State Management
- **Context Provider Pattern**: Centralized state management using React Context
- **Custom Hooks**: Modular logic with `useCountries` and `useFunFact`
- **Persistent Storage**: AsyncStorage for favorites and notes

### API Integration
- **Countries API**: Real-time country data fetching
- **OpenAI Integration**: AI-powered fun facts generation
- **Error Handling**: Comprehensive error states and fallbacks

### UI/UX Features
- **Responsive Design**: Adapts to different screen sizes
- **Platform-Specific Icons**: SF Symbols on iOS, Material Icons elsewhere
- **Theme Support**: Automatic dark/light theme switching
- **Smooth Animations**: Enhanced user interactions

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | OpenAI API key for fun facts | Optional |

> **Security Note**: In production, consider using a backend proxy to hide API keys instead of embedding them in the client bundle.

## 📱 Platform Support

- **iOS**: Full native support with SF Symbols
- **Android**: Full support with Material Icons
- **Web**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the [troubleshooting guide](TESTING.md)
2. Review existing issues in the repository
3. Create a new issue with detailed information

---

*Built with ❤️ using React Native and Expo*

## Architecture plan
- Since this is a simple web application that requires no backend, we can host it easily on free platforms like Heroku or Vercel.
- Further development can be adding a backend system for user management, pages for user profile management, as well as admin management. Host via ECS from AWS. 

## Trade-offs
- Could not verify the complete flow for the fun fact endpoint. I have an issue with the OpenAI free tier and the new generated key is not functioning. I added a fail-safe for the useFunFact to mimic the same fun fact behavior for any LLM. 
- Could not add all of the unit tests and verify them completely due to the time constraint.
- Can make the UI/UX better.
