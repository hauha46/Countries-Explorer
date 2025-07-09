import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Country } from "../types/country";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

interface CountryCardProps {
  country: Country;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const CountryCard = ({
  country,
  isFavorite,
  onPress,
  onToggleFavorite,
}: CountryCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: country.flags.png }}
        style={styles.flag}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.infoContainer}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {country.name.common}
        </ThemedText>
        <ThemedText style={styles.region}>{country.region}</ThemedText>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        testID="favorite-button"
      >
        <IconSymbol
          size={24}
          name={isFavorite ? "star.fill" : "star"}
          color={isFavorite ? "#FFD700" : "#8E8E93"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(180, 180, 180, 0.1)",
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  region: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  favoriteButton: {
    padding: 6,
    backgroundColor: "rgba(200, 200, 200, 0.2)",
    borderRadius: 20,
    marginLeft: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
