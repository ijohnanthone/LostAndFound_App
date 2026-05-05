import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { AppHeader } from "@/components/app/app-header";
import { useAuth } from "@/contexts/auth-context";

export default function HomeHubScreen() {
  const navigation = useNavigation();
  const { user, role } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Home Hub"
          subtitle="Lost & Found community dashboard"
          rightBadgeText={role === "admin" ? "ADM" : "LIVE"}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Authenticated Session Active</Text>
          <Text style={styles.heroTitle}>Welcome, {user?.displayName || "Community Member"}</Text>
          <Text style={styles.heroSubtitle}>
            Existing sessions now skip login automatically, and admin-confirmed notifications are
            routed through the dashboard instead of bot matching.
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.primaryAction, styles.lostAction]}
            onPress={() => router.push({ pathname: "/(app)/report", params: { type: "lost" } })}
          >
            <Text style={styles.actionEmoji}>🔍</Text>
            <Text style={styles.actionTitle}>Report Lost Item</Text>
            <Text style={styles.actionCaption}>Create a verified report for admin matching</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryAction, styles.foundAction]}
            onPress={() => router.push({ pathname: "/(app)/report", params: { type: "found" } })}
          >
            <Text style={styles.actionEmoji}>✨</Text>
            <Text style={styles.actionTitle}>Report Found Item</Text>
            <Text style={styles.actionCaption}>Post what you found so the owner can be notified</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Notification Policy</Text>
            <Text style={styles.infoBody}>
              Users only receive notifications after an admin reviews and confirms a likely match.
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Drawer Dashboard</Text>
            <Text style={styles.infoBody}>
              Use the hamburger menu to access notifications, admin review, and the security center.
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Security Tweaks Added</Text>
            <Text style={styles.infoBody}>
              Email/password auth, protected routes, persisted sessions, role-aware admin flow, and
              draft Firestore rules.
            </Text>
          </View>
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
  heroCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 30,
    padding: 22,
    marginBottom: 22,
  },
  heroEyebrow: {
    color: "#C2410C",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },
  heroTitle: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  actionsSection: {
    gap: 14,
    marginBottom: 22,
  },
  primaryAction: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  lostAction: {
    backgroundColor: "#DBEAFE",
  },
  foundAction: {
    backgroundColor: "#DCFCE7",
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 12,
  },
  actionTitle: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
  },
  actionCaption: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  grid: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
  },
  infoTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  infoBody: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
  },
});
