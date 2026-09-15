module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  moduleNameMapper: {
    '^lucide-react-native$': '<rootDir>/tests/__mocks__/lucide-react-native.js',
    '^react-native-reanimated$': '<rootDir>/tests/__mocks__/react-native-reanimated.js'
  }
};
