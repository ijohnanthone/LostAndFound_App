import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

import { useAuth } from "@/contexts/auth-context";

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { user, role, logout } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🦊</Text>
        </View>
        <Text style={styles.name}>{user?.displayName || "FoxFind User"}</Text>
        <Text style={styles.email}>{user?.email || "Community member"}</Text>
        <Text style={styles.role}>{role === "admin" ? "Admin access" : "Verified user"}</Text>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await logout();
        }}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: 0,
  },
  header: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
  },
  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  email: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  role: {
    color: "#C2410C",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
  logoutButton: {
    marginTop: "auto",
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
