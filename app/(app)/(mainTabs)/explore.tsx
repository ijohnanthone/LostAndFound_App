import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";

import { AppHeader } from "@/components/app/app-header";
import { db } from "@/firebaseConfig";

type BoardItem = {
  id: string;
  name: string;
  place: string;
  status: string;
  source: "lost" | "found";
  createdAtMs: number;
  createdAtLabel: string;
};

export default function CommunityBoardScreen() {
  const navigation = useNavigation();
  const [lostItems, setLostItems] = useState<BoardItem[]>([]);
  const [foundItems, setFoundItems] = useState<BoardItem[]>([]);

  useEffect(() => {
    const unsubLost = onSnapshot(collection(db, "lostItems"), (snapshot) => {
      setLostItems(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.();

          return {
            id: doc.id,
            name: data.name || "Unnamed item",
            place: data.place || "Unknown location",
            status: data.reviewStatus || "Pending Admin Review",
            source: "lost",
            createdAtMs: createdAt ? createdAt.getTime() : 0,
            createdAtLabel: createdAt ? createdAt.toLocaleString() : "Just now",
          };
        })
      );
    });

    const unsubFound = onSnapshot(collection(db, "foundItems"), (snapshot) => {
      setFoundItems(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.();

          return {
            id: doc.id,
            name: data.name || "Unnamed item",
            place: data.place || "Unknown location",
            status: data.reviewStatus || "Pending Admin Review",
            source: "found",
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Community Board"
          subtitle="Live reports across lost and found collections"
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
                      item.source === "lost" ? styles.sourceBadgeTextBlue : styles.sourceBadgeTextGreen,
                    ]}
                  >
                    {item.source === "lost" ? "Lost" : "Found"}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemBody}>{item.place}</Text>
              <Text style={styles.itemStatus}>{item.status}</Text>
              <Text style={styles.itemDate}>{item.createdAtLabel}</Text>
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
});
