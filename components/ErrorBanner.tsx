import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ErrorBanner = ({ message, onRetry, onDismiss }: ErrorBannerProps) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <IconSymbol size={24} name="exclamationmark.triangle.fill" color="#FF3B30" />
        <ThemedText style={styles.message}>{message}</ThemedText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton} testID="dismiss-button">
          <IconSymbol size={20} name="xmark.circle.fill" color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    marginLeft: 8,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButton: {
    marginRight: 12,
    padding: 6,
  },
  retryText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
  },
});
