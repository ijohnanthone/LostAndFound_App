import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";

import { AppHeader } from "@/components/app/app-header";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/firebaseConfig";

type UserNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAtMs: number;
  createdAtLabel: string;
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const nextItems = snapshot.docs
        .map((item) => {
          const data = item.data();
          const createdAt = data.createdAt?.toDate?.();

          return {
            id: item.id,
            userId: data.userId || "",
            title: data.title || "Admin update",
            body: data.body || "",
            read: Boolean(data.read),
            createdAtMs: createdAt ? createdAt.getTime() : 0,
            createdAtLabel: createdAt ? createdAt.toLocaleString() : "Just now",
          };
        })
        .sort((left, right) => right.createdAtMs - left.createdAtMs);

      setNotifications(nextItems);
    });

    return unsubscribe;
  }, [user]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      Alert.alert("Update failed", "We couldn't mark this notification as read.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Notifications"
          subtitle="Admin-confirmed match updates only"
          rightBadgeText={String(unreadCount)}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Manual admin matching is active</Text>
          <Text style={styles.bannerBody}>
            Demonstration flow: a user sends a claim from the Community Board, the admin reviews the
            answer, and an approval or rejection appears here.
          </Text>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyBody}>
              When an admin confirms a match for one of your reports, the notice will appear here.
            </Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View key={item.id} style={[styles.notificationCard, !item.read && styles.unreadCard]}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationBody}>{item.body}</Text>
              <Text style={styles.notificationDate}>{item.createdAtLabel}</Text>
              {!item.read ? (
                <TouchableOpacity
                  style={styles.readButton}
                  onPress={() => handleMarkAsRead(item.id)}
                >
                  <Text style={styles.readButtonText}>Mark as read</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.readLabel}>Read</Text>
              )}
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
  banner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  bannerTitle: {
    color: "#1D4ED8",
    fontSize: 18,
    fontWeight: "800",
  },
  bannerBody: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
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
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
  },
  unreadCard: {
    borderWidth: 1,
    borderColor: "#F97316",
  },
  notificationTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  notificationBody: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  notificationDate: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 10,
  },
  readButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#F97316",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  readButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  readLabel: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12,
  },
});
