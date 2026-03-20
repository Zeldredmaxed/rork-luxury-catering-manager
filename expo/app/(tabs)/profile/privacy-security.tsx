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
import { Shield, Eye, Fingerprint, Trash2, Download, Lock, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function PrivacySecurityScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);

  const handleChangePassword = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Change Password', 'A password reset link will be sent to your email address.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Link', onPress: () => Alert.alert('Sent', 'Check your email for the reset link.') },
    ]);
  }, []);

  const handleDownloadData = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Download Data', 'We will prepare a copy of your data and email it to you within 48 hours.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Request', onPress: () => Alert.alert('Requested', 'You will receive an email when your data is ready.') },
    ]);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data, order history, rewards points, and preferences will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => Alert.alert('Account Deletion', 'Your request has been submitted. Your account will be deleted within 30 days.'),
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Privacy & Security', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <Pressable style={[styles.row, styles.rowBorder]} onPress={handleChangePassword}>
              <View style={styles.rowIcon}>
                <Lock size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Change Password</Text>
                <Text style={styles.rowDesc}>Update your account password</Text>
              </View>
              <ChevronRight size={18} color={Colors.warmGrayLight} />
            </Pressable>

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Fingerprint size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Biometric Login</Text>
                <Text style={styles.rowDesc}>Use Face ID or fingerprint</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={(val) => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBiometricEnabled(val);
                }}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={biometricEnabled ? Colors.accent : Colors.warmGrayLight}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowIcon}>
                <Eye size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Usage Analytics</Text>
                <Text style={styles.rowDesc}>Help us improve the app experience</Text>
              </View>
              <Switch
                value={analyticsEnabled}
                onValueChange={(val) => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAnalyticsEnabled(val);
                }}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={analyticsEnabled ? Colors.accent : Colors.warmGrayLight}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Shield size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Marketing Communications</Text>
                <Text style={styles.rowDesc}>Personalized offers and updates</Text>
              </View>
              <Switch
                value={marketingEnabled}
                onValueChange={(val) => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMarketingEnabled(val);
                }}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={marketingEnabled ? Colors.accent : Colors.warmGrayLight}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data</Text>
          <View style={styles.card}>
            <Pressable style={[styles.row, styles.rowBorder]} onPress={handleDownloadData}>
              <View style={styles.rowIcon}>
                <Download size={20} color={Colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Download My Data</Text>
                <Text style={styles.rowDesc}>Get a copy of your personal data</Text>
              </View>
              <ChevronRight size={18} color={Colors.warmGrayLight} />
            </Pressable>

            <Pressable style={styles.row} onPress={handleDeleteAccount}>
              <View style={[styles.rowIcon, { backgroundColor: Colors.error + '10' }]}>
                <Trash2 size={20} color={Colors.error} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: Colors.error }]}>Delete Account</Text>
                <Text style={styles.rowDesc}>Permanently delete your account</Text>
              </View>
              <ChevronRight size={18} color={Colors.warmGrayLight} />
            </Pressable>
          </View>
        </View>

        <View style={styles.legalLinks}>
          <Pressable style={styles.legalLink}>
            <Text style={styles.legalLinkText}>Privacy Policy</Text>
          </Pressable>
          <Pressable style={styles.legalLink}>
            <Text style={styles.legalLinkText}>Terms of Service</Text>
          </Pressable>
          <Pressable style={styles.legalLink}>
            <Text style={styles.legalLinkText}>Cookie Policy</Text>
          </Pressable>
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
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  legalLink: {
    paddingVertical: 8,
  },
  legalLinkText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '500' as const,
  },
});
