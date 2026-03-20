import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Bell, ShoppingBag, Tag, Award, MessageCircle, Megaphone } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: 'orders', label: 'Order Updates', description: 'Status changes, delivery tracking', icon: <ShoppingBag size={20} color={Colors.accent} />, enabled: true },
    { id: 'promotions', label: 'Promotions & Deals', description: 'Exclusive offers and discounts', icon: <Tag size={20} color={Colors.warning} />, enabled: true },
    { id: 'rewards', label: 'Rewards Activity', description: 'Points earned, tier updates', icon: <Award size={20} color={Colors.tierGold} />, enabled: true },
    { id: 'messages', label: 'Chat Messages', description: 'New messages from our team', icon: <MessageCircle size={20} color={Colors.success} />, enabled: true },
    { id: 'announcements', label: 'Announcements', description: 'New menu items, events', icon: <Megaphone size={20} color={Colors.accentDark} />, enabled: false },
  ]);

  const togglePush = useCallback((val: boolean) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPushEnabled(val);
    if (!val) {
      setSettings(prev => prev.map(s => ({ ...s, enabled: false })));
    }
  }, []);

  const toggleSetting = useCallback((id: string) => {
    if (!pushEnabled) {
      Alert.alert('Push Disabled', 'Enable push notifications first to manage individual preferences.');
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  }, [pushEnabled]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifications', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.masterToggle}>
          <View style={styles.masterToggleLeft}>
            <View style={styles.masterIconWrap}>
              <Bell size={24} color={pushEnabled ? Colors.accent : Colors.warmGray} />
            </View>
            <View>
              <Text style={styles.masterLabel}>Push Notifications</Text>
              <Text style={styles.masterDesc}>{pushEnabled ? 'Enabled' : 'Disabled'}</Text>
            </View>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={togglePush}
            trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
            thumbColor={pushEnabled ? Colors.accent : Colors.warmGrayLight}
          />
        </View>

        <Text style={styles.sectionLabel}>Notification Types</Text>

        <View style={styles.settingsCard}>
          {settings.map((setting, idx) => (
            <View key={setting.id} style={[styles.settingRow, idx < settings.length - 1 && styles.settingBorder]}>
              <View style={styles.settingIcon}>{setting.icon}</View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, !pushEnabled && styles.settingDisabled]}>{setting.label}</Text>
                <Text style={styles.settingDesc}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: Colors.borderLight, true: Colors.accent + '40' }}
                thumbColor={setting.enabled ? Colors.accent : Colors.warmGrayLight}
                disabled={!pushEnabled}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Notification Schedule</Text>
          <Text style={styles.infoText}>
            Promotional notifications are sent between 9 AM - 8 PM in your local time zone. Order updates are sent in real-time.
          </Text>
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
  masterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  masterToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  masterIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  masterLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  masterDesc: {
    fontSize: 13,
    color: Colors.warmGray,
    marginTop: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warmGray,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  settingDisabled: {
    color: Colors.warmGrayLight,
  },
  settingDesc: {
    fontSize: 12,
    color: Colors.warmGray,
    marginTop: 1,
  },
  infoCard: {
    backgroundColor: Colors.beigeLight,
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.warmGray,
    lineHeight: 19,
  },
});
