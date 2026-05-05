import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function SplashRoute() {
  const { isAuthLoading, user } = useAuth();
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoScale, wordmarkOpacity]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace(user ? "/(app)/(mainTabs)" : "/(auth)/login");
    }, 1400);

    return () => clearTimeout(timeout);
  }, [isAuthLoading, user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoCircle,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.logoEmoji}>🦊</Text>
        </Animated.View>
        <Animated.View style={{ opacity: wordmarkOpacity }}>
          <Text style={styles.title}>FoxFind</Text>
          <Text style={styles.subtitle}>Lost & Found Community App</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F97316",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7ED",
    shadowColor: "#7C2D12",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 54,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#FFEDD5",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
});
