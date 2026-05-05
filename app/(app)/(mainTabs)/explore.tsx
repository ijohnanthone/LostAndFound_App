import React, { useEffect, useMemo, useState } from "react";
import {
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
import { addDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";

import { AppHeader } from "@/components/app/app-header";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/firebaseConfig";

type BoardItem = {
  id: string;
  name: string;
  place: string;
  description: string;
  contact: string;
  status: string;
  source: "lost" | "found";
  userId: string;
  userEmail: string;
  userDisplayName: string;
  claimQuestion: string;
  verificationClue: string;
  hasPhotoAttachment: boolean;
  createdAtMs: number;
  createdAtLabel: string;
};

export default function CommunityBoardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState<BoardItem[]>([]);
  const [foundItems, setFoundItems] = useState<BoardItem[]>([]);
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
  const [claimAnswer, setClaimAnswer] = useState("");
  const [claimContact, setClaimContact] = useState(user?.email || "");

  useEffect(() => {
    const unsubLost = onSnapshot(collection(db, "lostItems"), (snapshot) => {
      setLostItems(
        snapshot.docs.map((entry) => {
          const data = entry.data();
          const createdAt = data.createdAt?.toDate?.();

          return {
            id: entry.id,
            name: data.name || "Unnamed item",
            place: data.place || "Unknown location",
            description: data.description || "",
            contact: data.contact || data.userEmail || "No contact provided",
            status: data.reviewStatus || "Pending Admin Review",
            source: "lost",
            userId: data.userId || "",
            userEmail: data.userEmail || "",
            userDisplayName: data.userDisplayName || "Community Member",
            claimQuestion: data.claimQuestion || "Describe a detail only the owner would know.",
            verificationClue: data.verificationClue || "",
            hasPhotoAttachment: Boolean(data.hasPhotoAttachment),
            createdAtMs: createdAt ? createdAt.getTime() : 0,
            createdAtLabel: createdAt ? createdAt.toLocaleString() : "Just now",
          };
        })
      );
    });

    const unsubFound = onSnapshot(collection(db, "foundItems"), (snapshot) => {
      setFoundItems(
        snapshot.docs.map((entry) => {
          const data = entry.data();
          const createdAt = data.createdAt?.toDate?.();

          return {
            id: entry.id,
            name: data.name || "Unnamed item",
            place: data.place || "Unknown location",
            description: data.description || "",
            contact: data.contact || data.userEmail || "No contact provided",
            status: data.reviewStatus || "Pending Admin Review",
            source: "found",
            userId: data.userId || "",
            userEmail: data.userEmail || "",
            userDisplayName: data.userDisplayName || "Community Member",
            claimQuestion: data.claimQuestion || "Describe a detail only the owner would know.",
            verificationClue: data.verificationClue || "",
            hasPhotoAttachment: Boolean(data.hasPhotoAttachment),
            createdAtMs: createdAt ? createdAt.getTime() : 0,
            createdAtLabel: createdAt ? createdAt.toLocaleString() : "Just now",
          };
        })
      );
    });

    return () => {
      unsubLost();
      unsubFound();
    };
  }, []);

  const mergedItems = useMemo(
    () =>
      [...lostItems, ...foundItems].sort((left, right) => right.createdAtMs - left.createdAtMs),
    [foundItems, lostItems]
  );

  const handleClaim = async (item: BoardItem) => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in before sending a claim request.");
      return;
    }

    if (!claimAnswer.trim()) {
      Alert.alert("Missing answer", "Answer the claim question before sending your request.");
      return;
    }

    try {
      await addDoc(collection(db, "claimRequests"), {
        itemId: item.id,
        itemType: item.source,
        itemName: item.name,
        itemPlace: item.place,
        reportDescription: item.description,
        reportContact: item.contact,
        reportOwnerUserId: item.userId,
        reportOwnerName: item.userDisplayName,
        reportOwnerEmail: item.userEmail,
        claimQuestion: item.claimQuestion,
        expectedVerificationClue: item.verificationClue,
        reportHasPhotoAttachment: item.hasPhotoAttachment,
        claimantUserId: user.uid,
        claimantName: user.displayName || "Community Member",
        claimantEmail: user.email || claimContact.trim(),
        claimantContact: claimContact.trim() || user.email || "",
        claimAnswer: claimAnswer.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Claim sent",
        "Your claim is now waiting for admin verification."
      );
      setExpandedClaimId(null);
      setClaimAnswer("");
    } catch (error) {
      console.error("Failed to create claim request:", error);
      Alert.alert("Could not send claim", "Please try again in a moment.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Community Board"
          subtitle="Browse reports and claim an item if you are the owner"
          rightBadgeText={String(mergedItems.length)}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.summaryCard}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{lostItems.length}</Text>
            <Text style={styles.metricLabel}>Lost reports</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{foundItems.length}</Text>
            <Text style={styles.metricLabel}>Found reports</Text>
          </View>
        </View>

        {mergedItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptyBody}>
              Once users submit lost or found items, they’ll appear here for community visibility
              and admin review.
            </Text>
          </View>
        ) : (
          mergedItems.map((item) => (
            <View key={`${item.source}-${item.id}`} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <View
                  style={[
                    styles.sourceBadge,
                    item.source === "lost" ? styles.sourceBadgeBlue : styles.sourceBadgeGreen,
                  ]}
                >
                  <Text
                    style={[
                      styles.sourceBadgeText,
                      item.source === "lost"
                        ? styles.sourceBadgeTextBlue
                        : styles.sourceBadgeTextGreen,
                    ]}
                  >
                    {item.source === "lost" ? "Lost" : "Found"}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemBody}>{item.place}</Text>
              {item.description ? <Text style={styles.itemDescription}>{item.description}</Text> : null}
              <Text style={styles.itemStatus}>{item.status}</Text>
              <Text style={styles.itemDate}>{item.createdAtLabel}</Text>

              {item.source === "found" && user?.uid !== item.userId ? (
                <View style={styles.claimSection}>
                  {expandedClaimId === item.id ? (
                    <>
                      <Text style={styles.claimTitle}>Claim this item</Text>
                      <Text style={styles.claimQuestionLabel}>Question from the finder</Text>
                      <Text style={styles.claimQuestionBox}>{item.claimQuestion}</Text>
                      <Text style={styles.claimBody}>
                        Answer carefully. The admin will compare your response with the hidden proof
                        clue saved by the person who reported the item.
                      </Text>
                      <TextInput
                        style={[styles.claimInput, styles.claimTextarea]}
                        placeholder="Type your answer here"
                        placeholderTextColor="#94A3B8"
                        value={claimAnswer}
                        onChangeText={setClaimAnswer}
                        multiline
                        textAlignVertical="top"
                      />
                      <TextInput
                        style={styles.claimInput}
                        placeholder="Best contact email or phone"
                        placeholderTextColor="#94A3B8"
                        value={claimContact}
                        onChangeText={setClaimContact}
                      />
                      <View style={styles.claimButtonRow}>
                        <TouchableOpacity
                          style={styles.claimCancelButton}
                          onPress={() => {
                            setExpandedClaimId(null);
                            setClaimAnswer("");
                          }}
                        >
                          <Text style={styles.claimCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.claimPrimaryButton}
                          onPress={() => handleClaim(item)}
                        >
                          <Text style={styles.claimPrimaryText}>Send Claim</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.claimPromptButton}
                      onPress={() => setExpandedClaimId(item.id)}
                    >
                      <Text style={styles.claimPromptText}>This looks like mine</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : null}
            </View>
          ))
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
  summaryCard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "800",
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyBody: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
  },
  itemHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: {
    flex: 1,
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 10,
  },
  sourceBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sourceBadgeBlue: {
    backgroundColor: "#DBEAFE",
  },
  sourceBadgeGreen: {
    backgroundColor: "#DCFCE7",
  },
  sourceBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  sourceBadgeTextBlue: {
    color: "#1D4ED8",
  },
  sourceBadgeTextGreen: {
    color: "#15803D",
  },
  itemBody: {
    color: "#475569",
    fontSize: 14,
    marginTop: 10,
  },
  itemDescription: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  itemStatus: {
    color: "#C2410C",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
  itemDate: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 8,
  },
  claimSection: {
    borderTopColor: "#E2E8F0",
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
  },
  claimPromptButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F97316",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  claimPromptText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  claimTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  claimQuestionLabel: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 6,
  },
  claimQuestionBox: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
    borderRadius: 16,
    borderWidth: 1,
    color: "#9A3412",
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
  },
  claimBody: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    marginBottom: 10,
  },
  claimInput: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 16,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 14,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  claimTextarea: {
    minHeight: 88,
  },
  claimButtonRow: {
    flexDirection: "row",
    gap: 10,
  },
  claimCancelButton: {
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    flex: 1,
    paddingVertical: 12,
  },
  claimCancelText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
  },
  claimPrimaryButton: {
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 14,
    flex: 1,
    paddingVertical: 12,
  },
  claimPrimaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
