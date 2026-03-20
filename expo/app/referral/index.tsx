import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Gift, Copy, Share2, Users, Award } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const mockReferralData = {
  referralCode: 'EXQ-ALEXCH',
  shareLink: 'https://exquisitemeals.com/join?ref=EXQ-ALEXCH',
  totalReferred: 3,
  totalEarned: 1500,
  bonusPerReferral: 500,
  history: [
    { id: '1', refereeName: 'Jessica M.', status: 'credited', date: '2026-03-15' },
    { id: '2', refereeName: 'Ryan K.', status: 'credited', date: '2026-03-10' },
    { id: '3', refereeName: 'Olivia T.', status: 'credited', date: '2026-02-28' },
  ],
};

export default function ReferralScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [data] = useState(mockReferralData);

  const handleCopyCode = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Referral code copied to clipboard.');
  };

  const handleShare = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Join me on Exquisite Meals and we both get ${data.bonusPerReferral} reward points! Use my code: ${data.referralCode}\n\n${data.shareLink}`,
      });
    } catch {}
  };

  const statusColors: Record<string, string> = {
    credited: '#4CAF50',
    signed_up: '#FF9800',
    pending: '#9E9E9E',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Refer Friends</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Gift size={40} color={Colors.accent} />
          <Text style={styles.heroTitle}>Give {data.bonusPerReferral}, Get {data.bonusPerReferral}</Text>
          <Text style={styles.heroSubtitle}>
            Share your code and both you and your friend earn {data.bonusPerReferral} reward points!
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{data.referralCode}</Text>
            <Pressable onPress={handleCopyCode} style={styles.copyBtn}>
              <Copy size={18} color={Colors.accent} />
            </Pressable>
          </View>

          <Pressable onPress={handleShare} style={styles.shareBtn}>
            <Share2 size={18} color="#FFF" />
            <Text style={styles.shareBtnText}>Share with Friends</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Users size={20} color={Colors.accent} />
            <Text style={styles.statValue}>{data.totalReferred}</Text>
            <Text style={styles.statLabel}>Friends Referred</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={20} color={Colors.accent} />
            <Text style={styles.statValue}>{data.totalEarned.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>Referral History</Text>
        {data.history.map(ref => (
          <View key={ref.id} style={styles.historyItem}>
            <View style={styles.historyAvatar}>
              <Text style={styles.historyInitial}>{ref.refereeName[0]}</Text>
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyName}>{ref.refereeName}</Text>
              <Text style={styles.historyDate}>{ref.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[ref.status] + '20' }]}>
              <Text style={[styles.statusText, { color: statusColors[ref.status] }]}>
                {ref.status === 'credited' ? '+500 pts' : ref.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroCard: { backgroundColor: Colors.white, borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginTop: 16 },
  heroSubtitle: { fontSize: 14, color: Colors.warmGray, textAlign: 'center', marginTop: 8, lineHeight: 20, paddingHorizontal: 10 },
  codeContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.cream, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14, marginTop: 20, borderWidth: 1, borderColor: Colors.border },
  codeText: { fontSize: 20, fontWeight: '800', color: Colors.text, letterSpacing: 2 },
  copyBtn: { padding: 6 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 16 },
  shareBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.warmGray, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  historyAvatar: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.accent + '15', justifyContent: 'center', alignItems: 'center' },
  historyInitial: { fontSize: 15, fontWeight: '700', color: Colors.accent },
  historyInfo: { flex: 1, marginLeft: 12 },
  historyName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  historyDate: { fontSize: 11, color: Colors.warmGray, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
