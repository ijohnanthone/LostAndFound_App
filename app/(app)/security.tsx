import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { AppHeader } from "@/components/app/app-header";
import { useAuth } from "@/contexts/auth-context";

const implementedFeatures = [
  "Firebase email/password login and registration",
  "Persistent session auto-login for returning users",
  "Protected app routes behind authentication",
  "Role-aware admin matching workflow",
  "User-scoped in-app notifications",
  "Draft Firestore security rules file added to the project",
];

const recommendedNextSteps = [
  "Enable Firebase email verification before allowing reports",
  "Store Expo push tokens and send real device notifications through Cloud Functions",
  "Add per-user rate limiting for report creation",
  "Add image upload validation and Storage security rules before photo support goes live",
  "Promote admin privileges only through a trusted backend process, not client writes",
  "Log security events such as sign-in failures and admin notification actions",
];

export default function SecurityScreen() {
  const navigation = useNavigation();
  const { user, role } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Security Center"
          subtitle="Trust and admin review safeguards"
          rightBadgeText={role === "admin" ? "ADM" : "SAFE"}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Active Account</Text>
          <Text style={styles.cardBody}>{user?.email}</Text>
          <Text style={styles.cardTag}>{role === "admin" ? "Admin profile" : "Verified user profile"}</Text>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.cardTitle}>Implemented now</Text>
          {implementedFeatures.map((feature) => (
            <Text key={feature} style={styles.listItem}>
              • {feature}
            </Text>
          ))}
        </View>

        <View style={styles.listCard}>
          <Text style={styles.cardTitle}>Recommended next security tweaks</Text>
          {recommendedNextSteps.map((feature) => (
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
