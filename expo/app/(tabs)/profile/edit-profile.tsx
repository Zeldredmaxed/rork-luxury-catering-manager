import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { User, Camera } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = useCallback((setter: (val: string) => void) => {
    return (val: string) => {
      setter(val);
      setHasChanges(true);
    };
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    setHasChanges(false);
    Alert.alert('Saved', 'Your profile has been updated.');
    router.back();
  }, [name, email, phone, updateProfile, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerShown: true,
          headerStyle: { backgroundColor: Colors.cream },
          headerTintColor: Colors.text,
          headerRight: () => (
            <Pressable onPress={handleSave} disabled={!hasChanges}>
              <Text style={[styles.saveHeaderBtn, !hasChanges && styles.saveHeaderBtnDisabled]}>Save</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            <User size={40} color={Colors.white} />
          </View>
          <Pressable
            style={styles.changePhotoBtn}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Change Photo', 'Photo upload will be available soon.');
            }}
          >
            <Camera size={14} color={Colors.accent} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>
        </View>

        <View style={styles.formSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={handleChange(setName)}
              placeholder="Your name"
              placeholderTextColor={Colors.warmGrayLight}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={handleChange(setEmail)}
              placeholder="you@email.com"
              placeholderTextColor={Colors.warmGrayLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={handleChange(setPhone)}
              placeholder="(555) 123-4567"
              placeholderTextColor={Colors.warmGrayLight}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Account Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>March 2026</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rewards Tier</Text>
            <Text style={[styles.infoValue, { color: Colors.accent }]}>
              {user.rewardsTier.charAt(0).toUpperCase() + user.rewardsTier.slice(1)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Orders</Text>
            <Text style={styles.infoValue}>{user.totalOrders}</Text>
          </View>
        </View>
      </ScrollView>

      {hasChanges && (
        <View style={styles.bottomBar}>
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  saveHeaderBtn: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  saveHeaderBtnDisabled: {
    color: Colors.warmGrayLight,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.beigeLight,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  formSection: {
    gap: 18,
    marginBottom: 28,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warmGray,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.warmGray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: Colors.cream,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
});
