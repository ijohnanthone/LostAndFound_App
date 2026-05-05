import React from "react";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { AppDrawerContent } from "@/components/app/drawer-content";
import { useAuth } from "@/contexts/auth-context";

export default function AppLayout() {
  const { user, isAuthLoading, role } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthLoading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerActiveTintColor: "#F97316",
        drawerInactiveTintColor: "#475569",
        drawerLabelStyle: {
          marginLeft: -12,
          fontWeight: "700",
        },
      }}
    >
      <Drawer.Screen
        name="(mainTabs)"
        options={{
          drawerLabel: "Home Hub",
          title: "Home Hub",
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          drawerLabel: "Notifications",
          title: "Notifications",
        }}
      />
      <Drawer.Screen
        name="admin"
        options={{
          drawerLabel: role === "admin" ? "Admin Match Desk" : "Admin Policy",
          title: "Admin Match Desk",
        }}
      />
      <Drawer.Screen
        name="security"
        options={{
          drawerLabel: "Security Center",
          title: "Security Center",
        }}
      />
      <Drawer.Screen
        name="report"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Report Item",
        }}
      />
    </Drawer>
  );
}
