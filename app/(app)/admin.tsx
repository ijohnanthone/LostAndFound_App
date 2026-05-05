import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { AppHeader } from "@/components/app/app-header";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/firebaseConfig";

export default function AdminScreen() {
  const navigation = useNavigation();
  const { role } = useAuth();
  const [targetUserId, setTargetUserId] = useState("");
  const [title, setTitle] = useState("Match confirmed by admin");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async () => {
    if (role !== "admin") {
      Alert.alert("Admin only", "Assign your user document role to admin to use this desk.");
      return;
    }

    if (!targetUserId.trim() || !title.trim() || !body.trim()) {
      Alert.alert("Missing fields", "Enter the target user ID, title, and notification body.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "notifications"), {
        userId: targetUserId.trim(),
        title: title.trim(),
        body: body.trim(),
        read: false,
        type: "admin-match",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Notification sent", "The admin-confirmed message is now queued for that user.");
      setTargetUserId("");
      setBody("");
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      Alert.alert("Failed", "We couldn't save the admin notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Admin Match Desk"
          subtitle="Manual review and user notification workflow"
          rightBadgeText={role === "admin" ? "ADM" : "POL"}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>Centralized matching policy</Text>
          <Text style={styles.policyBody}>
            The system does not auto-match items to users. Admins review details first, then send a
            manual confirmation notice once the owner is identified.
          </Text>
        </View>

        {role !== "admin" ? (
          <View style={styles.lockedCard}>
            <Text style={styles.lockedTitle}>Admin access required</Text>
            <Text style={styles.lockedBody}>
              Your account is currently a regular user account. To unlock this screen, change your
              Firestore user document `role` field to `admin`.
            </Text>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.label}>Target User ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Firebase auth UID"
              placeholderTextColor="#94A3B8"
              value={targetUserId}
              onChangeText={setTargetUserId}
            />

            <Text style={styles.label}>Notification Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Match confirmed by admin"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Notification Body</Text>
            <TextInput
              multiline
              style={[styles.input, styles.multiline]}
              placeholder="Tell the user where the item is and how to claim it."
              placeholderTextColor="#94A3B8"
              value={body}
              onChangeText={setBody}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Send Admin Notification</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
  policyCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  policyTitle: {
    color: "#C2410C",
    fontSize: 18,
    fontWeight: "800",
  },
  policyBody: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  lockedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
  },
  lockedTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  lockedBody: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
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
    backgroundColor: "#0F172A",
    borderRadius: 20,
    marginTop: 22,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
