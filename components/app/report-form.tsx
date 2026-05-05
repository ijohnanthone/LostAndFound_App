import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { useAuth } from "@/contexts/auth-context";
import { db } from "@/firebaseConfig";

type ReportType = "lost" | "found";

export function ReportForm({ type }: { type: ReportType }) {
  const { user } = useAuth();
  const [itemName, setItemName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const isLost = type === "lost";
  const palette = useMemo(
    () =>
      isLost
        ? { accent: "#2563EB", light: "#EFF6FF", chip: "Report Lost Item" }
        : { accent: "#F97316", light: "#FFF7ED", chip: "Report Found Item" },
    [isLost]
  );

  const handleSubmit = async () => {
    if (!itemName.trim() || !location.trim() || !description.trim() || !contact.trim()) {
      Alert.alert("Missing details", "Complete the item, place, description, and contact fields.");
      return;
    }

    setLoading(true);

    try {
      const collectionName = isLost ? "lostItems" : "foundItems";

      await addDoc(collection(db, collectionName), {
        name: itemName.trim(),
        place: location.trim(),
        description: description.trim(),
        contact: contact.trim(),
        type,
        userId: user?.uid || null,
        userEmail: user?.email || contact.trim(),
        status: isLost ? "Lost" : "Found",
        reviewStatus: "Pending Admin Review",
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Submitted",
        isLost
          ? "Your lost-item report is now in the system for admin review."
          : "Your found-item report is now in the system for admin review."
      );
      setItemName("");
      setLocation("");
      setDescription("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      Alert.alert("Submission failed", "We couldn't save this report to Firestore right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: palette.light }]}>
          <Text style={[styles.heroChip, { color: palette.accent }]}>{palette.chip}</Text>
          <Text style={styles.heroTitle}>
            {isLost ? "Tell the community what you lost" : "Help the owner recover the item"}
          </Text>
          <Text style={styles.heroSubtitle}>
            Reports are reviewed by admins before they trigger user notifications for a confirmed
            match.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Wallet, ID, tumbler, charger..."
            placeholderTextColor="#94A3B8"
            value={itemName}
            onChangeText={setItemName}
          />

          <Text style={styles.label}>{isLost ? "Last Seen Location" : "Found Location"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Library, cafeteria, parking lot..."
            placeholderTextColor="#94A3B8"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            multiline
            style={[styles.input, styles.multiline]}
            placeholder="Color, brand, unique marks, date, and anything an admin should verify."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Contact Reference</Text>
          <TextInput
            style={styles.input}
            placeholder="Email or alternate contact"
            placeholderTextColor="#94A3B8"
            value={contact}
            onChangeText={setContact}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: palette.accent }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLost ? "Submit Lost Report" : "Submit Found Report"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingBottom: 32,
  },
  hero: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  heroChip: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },
  heroTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: "#0F172A",
  },
  multiline: {
    minHeight: 120,
  },
  button: {
    alignItems: "center",
    borderRadius: 20,
    marginTop: 22,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
