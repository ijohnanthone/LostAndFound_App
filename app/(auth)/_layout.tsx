import React from "react";
import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function AuthLayout() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthLoading && user) {
    return <Redirect href="/(app)/(mainTabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
