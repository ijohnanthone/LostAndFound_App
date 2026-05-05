import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { AppHeader } from "@/components/app/app-header";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/firebaseConfig";

type ClaimRequest = {
  id: string;
  itemId: string;
  itemType: "lost" | "found";
  itemName: string;
  itemPlace: string;
  reportDescription: string;
  reportContact: string;
  reportOwnerName: string;
  reportOwnerEmail: string;
  claimQuestion: string;
  expectedVerificationClue: string;
  reportHasPhotoAttachment: boolean;
  claimantUserId: string;
  claimantName: string;
  claimantEmail: string;
  claimantContact: string;
  claimAnswer: string;
  status: string;
  createdAtMs: number;
  createdAtLabel: string;
};

export default function AdminScreen() {
  const navigation = useNavigation();
  const { role } = useAuth();
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [loadingClaimId, setLoadingClaimId] = useState<string | null>(null);

  useEffect(() => {
    const claimsQuery = query(collection(db, "claimRequests"));

    const unsubscribe = onSnapshot(claimsQuery, (snapshot) => {
      const nextClaims = snapshot.docs
        .map((claim) => {
          const data = claim.data();
          const createdAt = data.createdAt?.toDate?.();

          return {
            id: claim.id,
            itemId: data.itemId || "",
            itemType: data.itemType || "found",
            itemName: data.itemName || "Unknown item",
            itemPlace: data.itemPlace || "Unknown place",
            reportDescription: data.reportDescription || "",
            reportContact: data.reportContact || "No contact provided",
            reportOwnerName: data.reportOwnerName || "Community Member",
            reportOwnerEmail: data.reportOwnerEmail || "No email provided",
            claimQuestion: data.claimQuestion || "No stored question",
            expectedVerificationClue: data.expectedVerificationClue || "No stored clue",
            reportHasPhotoAttachment: Boolean(data.reportHasPhotoAttachment),
            claimantUserId: data.claimantUserId || "",
            claimantName: data.claimantName || "Unknown claimant",
            claimantEmail: data.claimantEmail || "No email provided",
            claimantContact: data.claimantContact || "",
            claimAnswer: data.claimAnswer || "",
            status: data.status || "pending",
            createdAtMs: createdAt ? createdAt.getTime() : 0,
            createdAtLabel: createdAt ? createdAt.toLocaleString() : "Just now",
          } as ClaimRequest;
        })
        .sort((left, right) => right.createdAtMs - left.createdAtMs);

      setClaims(nextClaims);
    });

    return unsubscribe;
  }, []);

  const pendingClaims = useMemo(
    () => claims.filter((claim) => claim.status === "pending"),
    [claims]
  );

  const handleClaimDecision = async (claim: ClaimRequest, decision: "approved" | "rejected") => {
    if (role !== "admin") {
      Alert.alert("Admin only", "Assign your user document role to admin to use this desk.");
      return;
    }

    setLoadingClaimId(claim.id);

    try {
      await updateDoc(doc(db, "claimRequests", claim.id), {
        status: decision,
        reviewedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "notifications"), {
        userId: claim.claimantUserId,
        title: decision === "approved" ? "Claim approved for pickup" : "Claim needs more proof",
        body:
          decision === "approved"
            ? `Your claim for ${claim.itemName} was approved. Please contact ${claim.reportOwnerName} at ${claim.reportOwnerEmail} to arrange the handoff.`
            : `Your claim for ${claim.itemName} needs more proof. The admin could not confirm ownership from the current answer.`,
        read: false,
        type: "admin-match",
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        decision === "approved" ? "Claim approved" : "Claim rejected",
        decision === "approved"
          ? "The claimant has been notified with the pickup contact details."
          : "The claimant has been notified that more proof is needed."
      );
    } catch (error) {
      console.error("Failed to review claim:", error);
      Alert.alert("Failed", "We couldn't save this claim decision.");
    } finally {
      setLoadingClaimId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Admin Match Desk"
          subtitle="Compare the expected proof with the claimant answer"
          rightBadgeText={role === "admin" ? "ADM" : "SAFE"}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>How to validate a claim</Text>
          <Text style={styles.policyBody}>
            Review the stored ownership question, the hidden verification clue, and the claimant’s
            answer. Approve only when the answer clearly matches the expected proof.
          </Text>
        </View>

        {role !== "admin" ? (
          <View style={styles.lockedCard}>
            <Text style={styles.lockedTitle}>Admin access required</Text>
            <Text style={styles.lockedBody}>
              Your account is currently a regular user account. To unlock this screen, change your
              Firestore user document `role` field to `admin` in Firebase Console for testing.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{pendingClaims.length}</Text>
              <Text style={styles.summaryLabel}>Pending claims</Text>
            </View>

            {pendingClaims.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.emptyTitle}>No pending claims</Text>
                <Text style={styles.emptyBody}>
                  Once a user taps “This looks like mine” from the Community Board, the request will
                  appear here with the original question and the submitted answer.
                </Text>
              </View>
            ) : (
              pendingClaims.map((claim) => (
                <View key={claim.id} style={styles.card}>
                  <Text style={styles.claimItem}>{claim.itemName}</Text>
                  <Text style={styles.claimMeta}>
                    {claim.itemType === "found" ? "Found item claim" : "Lost item response"} • {claim.itemPlace}
                  </Text>

                  <Text style={styles.sectionLabel}>Claimant</Text>
                  <Text style={styles.infoText}>
                    {claim.claimantName} • {claim.claimantEmail}
                  </Text>
                  <Text style={styles.infoText}>{claim.claimantContact}</Text>

                  <Text style={styles.sectionLabel}>Question shown to claimant</Text>
                  <Text style={styles.questionBox}>{claim.claimQuestion}</Text>

                  <Text style={styles.sectionLabel}>Expected proof clue</Text>
                  <Text style={styles.expectedBox}>{claim.expectedVerificationClue}</Text>

                  <Text style={styles.sectionLabel}>Claimant answer</Text>
                  <Text style={styles.answerBox}>{claim.claimAnswer}</Text>

                  <Text style={styles.sectionLabel}>Original found report</Text>
                  <Text style={styles.infoText}>
                    {claim.reportOwnerName} • {claim.reportOwnerEmail}
                  </Text>
                  <Text style={styles.infoText}>{claim.reportContact}</Text>
                  {claim.reportDescription ? (
                    <Text style={styles.reportBox}>{claim.reportDescription}</Text>
                  ) : null}
                  <Text style={styles.photoFlag}>
                    {claim.reportHasPhotoAttachment ? "Photo was attached to report" : "No photo attached"}
                  </Text>

                  <Text style={styles.claimDate}>{claim.createdAtLabel}</Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      disabled={loadingClaimId === claim.id}
                      onPress={() => handleClaimDecision(claim, "rejected")}
                    >
                      {loadingClaimId === claim.id ? (
                        <ActivityIndicator color="#334155" />
                      ) : (
                        <Text style={styles.rejectText}>Reject</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      disabled={loadingClaimId === claim.id}
                      onPress={() => handleClaimDecision(claim, "approved")}
                    >
                      {loadingClaimId === claim.id ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.approveText}>Approve Claim</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
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
  summaryCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 24,
    marginBottom: 16,
    padding: 18,
  },
  summaryValue: {
    color: "#065F46",
    fontSize: 24,
    fontWeight: "800",
  },
  summaryLabel: {
    color: "#047857",
    fontSize: 13,
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 14,
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
  claimItem: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  claimMeta: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 6,
  },
  sectionLabel: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 6,
  },
  infoText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
  },
  questionBox: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 16,
    borderWidth: 1,
    color: "#1D4ED8",
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
  },
  expectedBox: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
    borderRadius: 16,
    borderWidth: 1,
    color: "#9A3412",
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
  },
  answerBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 16,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
  },
  reportBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 16,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    padding: 14,
  },
  photoFlag: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },
  claimDate: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  rejectButton: {
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 16,
  },
  rejectText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "800",
  },
  approveButton: {
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 16,
  },
  approveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
