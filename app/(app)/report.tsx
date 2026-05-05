import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

import { AppHeader } from "@/components/app/app-header";
import { ReportForm } from "@/components/app/report-form";

export default function ReportScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ type?: "lost" | "found" }>();
  const type = params.type === "lost" ? "lost" : "found";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <AppHeader
          title={type === "lost" ? "Lost Item Report" : "Found Item Report"}
          subtitle="Admins review reports before user notifications are sent"
          rightBadgeText={type === "lost" ? "LOST" : "FIND"}
          onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        <ReportForm type={type} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
