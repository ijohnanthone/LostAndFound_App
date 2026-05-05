import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onMenuPress?: () => void;
  rightBadgeText?: string;
};

export function AppHeader({ title, subtitle, onMenuPress, rightBadgeText }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} activeOpacity={0.82}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{rightBadgeText || "•"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 18,
  },
  menuButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuIcon: {
    fontSize: 20,
    color: "#0F172A",
  },
  copy: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    color: "#0F172A",
    fontSize: 25,
    fontWeight: "800",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  badge: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
  },
  badgeText: {
    color: "#C2410C",
    fontWeight: "800",
    fontSize: 12,
  },
});
