import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "../../firebaseConfig";

type FoundItem = {
  id: string;
  name: string;
  place: string;
  status?: string;
  createdAtLabel: string;
  createdAtMs: number;
};

export default function FoundItemsScreen() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundItemsQuery = query(collection(db, "foundItems"));

    const unsubscribe = onSnapshot(
      foundItemsQuery,
      (snapshot) => {
        const nextItems = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const createdAtValue = data.createdAt?.toDate?.();

            return {
              id: doc.id,
              name: typeof data.name === "string" ? data.name : "Unnamed item",
              place:
                typeof data.place === "string"
                  ? data.place
                  : "Unknown location",
              status: typeof data.status === "string" ? data.status : "Found",
              createdAtMs: createdAtValue ? createdAtValue.getTime() : 0,
              createdAtLabel: createdAtValue
                ? createdAtValue.toLocaleString()
                : "Just now",
            };
          })
          .sort((left, right) => right.createdAtMs - left.createdAtMs);

        setItems(nextItems);
        setLoading(false);
      },
      (error) => {
        console.error("Error reading foundItems:", error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const summary = useMemo(
    () => ({
      total: items.length,
      found: items.filter((item) => item.status?.toLowerCase() === "found")
        .length,
    }),
    [items],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Found Items</Text>
                <Text style={styles.headerSubtitle}>
                  Live updates from your Firestore data
                </Text>
              </View>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{summary.total}</Text>
              </View>
            </View>

            <View style={styles.heroCard}>
              <Text style={styles.heroEmoji}>✨</Text>
              <Text style={styles.heroTitle}>Recent community reports</Text>
              <Text style={styles.heroSubtitle}>
                Every successful submission from the home tab appears here so
                you can verify the cloud connection visually.
              </Text>
              <View style={styles.metricsRow}>
                <View style={styles.metricPill}>
                  <Text style={styles.metricValue}>{summary.total}</Text>
                  <Text style={styles.metricLabel}>Total posts</Text>
                </View>
                <View style={[styles.metricPill, styles.metricPillGreen]}>
                  <Text style={styles.metricValue}>{summary.found}</Text>
                  <Text style={styles.metricLabel}>Marked found</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Latest listings</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyCard}>
              <ActivityIndicator color="#F97316" />
              <Text style={styles.emptyText}>Loading found items...</Text>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>No found items yet</Text>
              <Text style={styles.emptyText}>
                Post your first item from the Home tab and it will show up here.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.itemLocation}>{item.place}</Text>
            <Text style={styles.itemDate}>{item.createdAtLabel}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    flexGrow: 1,
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
  headerBadge: {
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  heroCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 28,
    marginBottom: 24,
    padding: 22,
  },
  heroEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  heroTitle: {
    color: "#064E3B",
    fontSize: 24,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#047857",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  metricPill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  metricPillGreen: {
    backgroundColor: "#D1FAE5",
  },
  metricValue: {
    color: "#064E3B",
    fontSize: 20,
    fontWeight: "800",
  },
  metricLabel: {
    color: "#047857",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
  },
  itemHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: {
    color: "#0F172A",
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },
  itemLocation: {
    color: "#475569",
    fontSize: 14,
    marginTop: 10,
  },
  itemDate: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 10,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusBadgeText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "700",
  },
  separator: {
    height: 12,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 34,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    textAlign: "center",
  },
});
