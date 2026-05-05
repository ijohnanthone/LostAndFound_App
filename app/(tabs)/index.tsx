import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "../../firebaseConfig";

const quickActions = [
  {
    id: "lost",
    emoji: "🔍",
    label: "Lost Items",
    caption: "Browse reports",
    backgroundColor: "#3B82F6",
  },
  {
    id: "found",
    emoji: "✨",
    label: "Found Items",
    caption: "Check matches",
    backgroundColor: "#10B981",
  },
] as const;

export default function HomeScreen() {
  const [itemName, setItemName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const pendingCards = useMemo(
    () => [
      {
        id: "1",
        title: itemName.trim() || "Black Umbrella",
        detail: location.trim() || "Student Center",
        status: "Ready to post",
      },
      {
        id: "2",
        title: "ID Lace",
        detail: "Library Hallway",
        status: "Community tip",
      },
    ],
    [itemName, location],
  );

  const handlePostItem = async () => {
    if (!itemName.trim() || !location.trim()) {
      Alert.alert("Wait!", "Please tell us what was found and where.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "foundItems"), {
        name: itemName.trim(),
        place: location.trim(),
        createdAt: serverTimestamp(),
        status: "Found",
      });

      Alert.alert("Success!", "Listing posted to the cloud.");
      setItemName("");
      setLocation("");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Could not connect to Firebase. Check your Rules!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Home</Text>
              <Text style={styles.headerSubtitle}>
                Lost and Found dashboard
              </Text>
            </View>
            <View style={styles.alertWrap}>
              <Text style={styles.alertIcon}>🔔</Text>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>3</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.92} style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🦊</Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.profileName}>FoxUser</Text>
              <Text style={styles.profileEmail}>user@foxfind.com</Text>
            </View>
            <Text style={styles.profileChevron}>⌄</Text>
          </TouchableOpacity>

          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Community-powered</Text>
            </View>
            <Text style={styles.heroTitle}>FoxFind</Text>
            <Text style={styles.heroSubtitle}>
              Report found items quickly and help owners reconnect with what
              matters.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionRow}>
              {quickActions.map((action) => (
                <View
                  key={action.id}
                  style={[
                    styles.quickActionCard,
                    { backgroundColor: action.backgroundColor },
                  ]}
                >
                  <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                  <Text style={styles.quickActionCaption}>
                    {action.caption}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Post Found Item</Text>
              <Text style={styles.sectionAccent}>Live to Firestore</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.formIntro}>
                <Text style={styles.formIcon}>📦</Text>
                <View style={styles.formIntroCopy}>
                  <Text style={styles.formTitle}>
                    Help someone recover their item
                  </Text>
                  <Text style={styles.formDescription}>
                    Keep the report short and precise so other students can
                    identify it fast.
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>Item Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Black Wallet, School ID, Earbuds"
                placeholderTextColor="#94A3B8"
                value={itemName}
                onChangeText={setItemName}
              />

              <Text style={styles.label}>Place Found</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Cafeteria, Library, Gym entrance"
                placeholderTextColor="#94A3B8"
                value={location}
                onChangeText={setLocation}
              />

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  loading && styles.primaryButtonDisabled,
                ]}
                onPress={handlePostItem}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF7ED" />
                ) : (
                  <Text style={styles.primaryButtonText}>Post Item</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>At a Glance</Text>
            {pendingCards.map((card) => (
              <View key={card.id} style={styles.pendingCard}>
                <View style={styles.pendingTextWrap}>
                  <Text style={styles.pendingTitle}>{card.title}</Text>
                  <Text style={styles.pendingDetail}>{card.detail}</Text>
                </View>
                <View style={styles.pendingStatus}>
                  <Text style={styles.pendingStatusText}>{card.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerTitle: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 4,
  },
  alertWrap: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 18,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    position: "relative",
    width: 48,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertBadge: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: -4,
    top: -4,
    width: 20,
  },
  alertBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#FFEDD5",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  avatarText: {
    fontSize: 26,
  },
  profileMeta: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  profileEmail: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 2,
  },
  profileChevron: {
    color: "#94A3B8",
    fontSize: 20,
    marginLeft: 12,
  },
  heroCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 28,
    marginBottom: 22,
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroBadgeText: {
    color: "#C2410C",
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionAccent: {
    color: "#F97316",
    fontSize: 12,
    fontWeight: "700",
  },
  quickActionRow: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionCard: {
    borderRadius: 24,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  quickActionEmoji: {
    fontSize: 26,
    marginBottom: 14,
  },
  quickActionLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  quickActionCaption: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
  },
  formIntro: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 18,
  },
  formIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  formIntroCopy: {
    flex: 1,
  },
  formTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "700",
  },
  formDescription: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 18,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 15,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 22,
    marginTop: 18,
    paddingVertical: 17,
  },
  primaryButtonDisabled: {
    backgroundColor: "#FDBA74",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  pendingCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  pendingTextWrap: {
    flex: 1,
    marginRight: 14,
  },
  pendingTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  pendingDetail: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  pendingStatus: {
    backgroundColor: "#FFF7ED",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pendingStatusText: {
    color: "#C2410C",
    fontSize: 12,
    fontWeight: "700",
  },
});
