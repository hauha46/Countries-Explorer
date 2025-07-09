import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Country, FavoriteCountry } from "../types/country";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

interface CountryDetailsPanelProps {
  isVisible: boolean;
  country: Country | null;
  isFavorite: boolean;
  favoriteData?: FavoriteCountry;
  onClose: () => void;
  onToggleFavorite: () => void;
  onSaveNote: (note: string) => void;
  funFact?: string;
  isLoadingFunFact?: boolean;
}

export const CountryDetailsPanel = ({
  isVisible,
  country,
  isFavorite,
  favoriteData,
  onClose,
  onToggleFavorite,
  onSaveNote,
  funFact,
  isLoadingFunFact,
}: CountryDetailsPanelProps) => {
  const [note, setNote] = useState<string>("");

  // Reset and load note when panel opens or country/favoriteData changes
  useEffect(() => {
    if (isVisible && country) {
      // Lazy load the note from favoriteData when panel opens
      setNote(favoriteData?.note || "");
    }
  }, [isVisible, country, favoriteData]);

  // Reset note when panel closes
  useEffect(() => {
    if (!isVisible) {
      setNote("");
    }
  }, [isVisible]);

  if (!country) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getLanguageList = () => {
    if (!country.languages) return "None";
    return Object.values(country.languages).join(", ");
  };

  const getCurrencyList = () => {
    if (!country.currencies) return "None";

    return Object.values(country.currencies)
      .map((currency) => `${currency.name} (${currency.symbol})`)
      .join(", ");
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              testID="close-details-button"
            >
              <IconSymbol name="xmark" size={24} color="#8E8E93" />
            </TouchableOpacity>
            <ThemedText type="title">{country.name.common}</ThemedText>
            <TouchableOpacity
              onPress={onToggleFavorite}
              style={styles.favoriteButton}
              testID="favorite-button-details"
            >
              <IconSymbol
                size={24}
                name={isFavorite ? "star.fill" : "star"}
                color={isFavorite ? "#FFD700" : "#8E8E93"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: country.flags.svg || country.flags.png }}
              style={styles.flag}
              contentFit="cover"
              transition={300}
            />

            {country.flags.alt && (
              <ThemedText style={styles.flagDescription}>
                {country.flags.alt}
              </ThemedText>
            )}

            <InfoRow
              label="Capital"
              value={country.capital?.join(", ") || "None"}
            />
            <InfoRow
              label="Region"
              value={`${country.region}${
                country.subregion ? ` (${country.subregion})` : ""
              }`}
            />
            <InfoRow
              label="Population"
              value={formatNumber(country.population)}
            />
            <InfoRow label="Languages" value={getLanguageList()} />
            <InfoRow label="Currencies" value={getCurrencyList()} />

            {funFact && (
              <View style={styles.funFactContainer}>
                <ThemedText type="subtitle">Fun Fact</ThemedText>
                <ThemedText style={styles.funFactText}>{funFact}</ThemedText>
              </View>
            )}

            {isLoadingFunFact && (
              <ThemedText style={styles.loadingText}>
                Loading fun fact...
              </ThemedText>
            )}

            {isFavorite && (
              <View style={styles.notesContainer}>
                <ThemedText type="subtitle">Notes</ThemedText>
                <TextInput
                  style={styles.notesInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note about this country..."
                  multiline
                  maxLength={500}
                  onBlur={() => onSaveNote(note)}
                  testID="country-note-input"
                />
              </View>
            )}
          </ScrollView>
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
      {label}:
    </ThemedText>
    <ThemedText style={styles.infoValue}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    flex: 0.9,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150, 150, 150, 0.3)",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "rgba(200, 200, 200, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  flag: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  flagDescription: {
    fontStyle: "italic",
    marginBottom: 20,
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  infoLabel: {
    width: 100,
  },
  infoValue: {
    flex: 1,
  },
  notesContainer: {
    marginTop: 24,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.3)",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    minHeight: 100,
  },
  funFactContainer: {
    marginTop: 24,
    marginBottom: 12,
  },
  funFactText: {
    marginTop: 8,
    fontStyle: "italic",
  },
  loadingText: {
    marginTop: 24,
    fontStyle: "italic",
    opacity: 0.7,
  },
});
