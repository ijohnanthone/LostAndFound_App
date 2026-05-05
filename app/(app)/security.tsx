import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { AppHeader } from "@/components/app/app-header";
import { useAuth } from "@/contexts/auth-context";

const trustChecks = [
  "Ask the claimant to answer the hidden claim question saved in the report.",
  "Compare unique identifiers like engravings, stickers, scratches, or bag contents.",
  "Require a personal photo, receipt, or older screenshot for valuable items.",
  "Release items only at a monitored handoff point and log which admin approved the claim.",
];

export default function SecurityScreen() {
  const navigation = useNavigation();
  const { user, role } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Trust & Safety"
          subtitle="How this prototype reduces false claims"
          rightBadgeText={role === "admin" ? "ADM" : "SAFE"}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Active Account</Text>
          <Text style={styles.cardBody}>{user?.email}</Text>
          <Text style={styles.cardTag}>
            {role === "admin" ? "Admin profile" : "Verified user profile"}
          </Text>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.cardTitle}>Recommended legitimacy checks</Text>
          {trustChecks.map((feature) => (
            <Text key={feature} style={styles.listItem}>
              • {feature}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  profileCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  cardBody: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
  },
  cardTag: {
    color: "#C2410C",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12,
  },
  listItem: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
});
