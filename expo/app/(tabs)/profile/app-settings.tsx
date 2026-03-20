import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Moon, Globe, Smartphone, RefreshCw, Zap, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function AppSettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoReorder, setAutoReorder] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [quickCheckout, setQuickCheckout] = useState(true);

  const handleToggle = useCallback((setter: (val: boolean) => void) => {
    return (val: boolean) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setter(val);
    };
  }, []);

  const handleClearCache = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Clear Cache', 'This will clear locally cached data. Your account and orders are safe.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => Alert.alert('Done', 'Cache has been cleared.') },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'App Settings', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Moon size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Dark Mode</Text>
                <Text style={styles.rowDesc}>Switch to dark theme</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleToggle(setDarkMode)}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={darkMode ? Colors.accent : Colors.warmGrayLight}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ordering</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowIcon}>
                <RefreshCw size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Smart Reorder</Text>
                <Text style={styles.rowDesc}>Suggest reordering your favorites</Text>
              </View>
              <Switch
                value={autoReorder}
                onValueChange={handleToggle(setAutoReorder)}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={autoReorder ? Colors.accent : Colors.warmGrayLight}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Zap size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Quick Checkout</Text>
                <Text style={styles.rowDesc}>Skip confirmation for saved payment</Text>
              </View>
              <Switch
                value={quickCheckout}
                onValueChange={handleToggle(setQuickCheckout)}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={quickCheckout ? Colors.accent : Colors.warmGrayLight}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowIcon}>
                <Smartphone size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Haptic Feedback</Text>
                <Text style={styles.rowDesc}>Vibrations for interactions</Text>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={handleToggle(setHapticFeedback)}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={hapticFeedback ? Colors.accent : Colors.warmGrayLight}
              />
            </View>
            <Pressable style={styles.row} onPress={handleClearCache}>
              <View style={styles.rowIcon}>
                <Globe size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Clear Cache</Text>
                <Text style={styles.rowDesc}>Free up storage space</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.appInfo}>
          <Info size={16} color={Colors.warmGrayLight} />
          <View>
            <Text style={styles.appInfoText}>Exquisite Meals v1.0.0</Text>
            <Text style={styles.appInfoSubtext}>Build 2026.03.20</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warmGray,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  rowDesc: {
    fontSize: 12,
    color: Colors.warmGray,
    marginTop: 1,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 8,
  },
  appInfoText: {
    fontSize: 13,
    color: Colors.warmGrayLight,
  },
  appInfoSubtext: {
    fontSize: 11,
    color: Colors.warmGrayLight,
  },
});
