import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, Gift, Check, ChevronRight, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { rewardsData, tierBenefits } from '@/mocks/rewards';
import { useUser } from '@/contexts/UserContext';
import { RewardsTier } from '@/types';
import * as Haptics from 'expo-haptics';

const tierOrder: RewardsTier[] = ['bronze', 'silver', 'gold', 'vip'];

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: rewardsData.tierProgress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const currentTierIndex = tierOrder.indexOf(user.rewardsTier);
  const currentTierData = tierBenefits[user.rewardsTier];

  const handleRedeem = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Rewards</Text>

        <View style={[styles.tierCard, { borderColor: currentTierData.color + '40' }]}>
          <View style={styles.tierCardHeader}>
            <View style={[styles.tierIconWrap, { backgroundColor: currentTierData.color + '20' }]}>
              <Sparkles size={24} color={currentTierData.color} />
            </View>
            <View style={styles.tierCardInfo}>
              <Text style={styles.tierCardTitle}>{currentTierData.name} Member</Text>
              <Text style={styles.tierCardPoints}>
                {user.rewardsPoints.toLocaleString()} points
              </Text>
            </View>
          </View>

          {rewardsData.nextTier && (
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressWidth,
                      backgroundColor: currentTierData.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {rewardsData.pointsToNextTier} pts to{' '}
                {tierBenefits[rewardsData.nextTier].name}
              </Text>
            </View>
          )}

          <View style={styles.perksContainer}>
            <Text style={styles.perksTitle}>Your Benefits</Text>
            {currentTierData.perks.map((perk, i) => (
              <View key={i} style={styles.perkRow}>
                <Check size={14} color={Colors.success} />
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tierTimeline}>
          <Text style={styles.sectionTitle}>Tier Levels</Text>
          <View style={styles.timelineRow}>
            {tierOrder.map((tier, i) => {
              const data = tierBenefits[tier];
              const isActive = i <= currentTierIndex;
              return (
                <View key={tier} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: isActive ? data.color : Colors.borderLight,
                        borderColor: isActive ? data.color : Colors.border,
                      },
                    ]}
                  >
                    {isActive && <Star size={10} color={Colors.white} fill={Colors.white} />}
                  </View>
                  <Text
                    style={[
                      styles.timelineLabel,
                      { color: isActive ? Colors.text : Colors.warmGrayLight },
                    ]}
                  >
                    {data.name}
                  </Text>
                  {i < tierOrder.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: i < currentTierIndex ? data.color : Colors.borderLight,
                        },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Redeem Rewards</Text>
          {rewardsData.availableRewards.map(reward => {
            const canRedeem = user.rewardsPoints >= reward.pointsCost;
            return (
              <Pressable
                key={reward.id}
                style={[styles.rewardCard, !canRedeem && styles.rewardCardDisabled]}
                onPress={canRedeem ? handleRedeem : undefined}
                testID={`reward-${reward.id}`}
              >
                <View style={styles.rewardIcon}>
                  <Gift size={20} color={canRedeem ? Colors.accent : Colors.warmGrayLight} />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={[styles.rewardName, !canRedeem && styles.rewardNameDisabled]}>
                    {reward.name}
                  </Text>
                  <Text style={styles.rewardDesc}>{reward.description}</Text>
                  <Text style={[styles.rewardCost, { color: canRedeem ? Colors.accent : Colors.warmGray }]}>
                    {reward.pointsCost.toLocaleString()} pts
                  </Text>
                </View>
                <ChevronRight size={18} color={canRedeem ? Colors.warmGray : Colors.warmGrayLight} />
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    letterSpacing: -0.5,
  },
  tierCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  tierCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  tierIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierCardInfo: {
    flex: 1,
  },
  tierCardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  tierCardPoints: {
    fontSize: 14,
    color: Colors.warmGray,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.beigeLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.warmGray,
  },
  perksContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 14,
  },
  perksTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  perkText: {
    fontSize: 14,
    color: Colors.text,
  },
  tierTimeline: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  timelineLine: {
    position: 'absolute',
    top: 13,
    left: '60%',
    right: '-60%',
    height: 2,
    zIndex: -1,
  },
  rewardsSection: {
    paddingHorizontal: 20,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardCardDisabled: {
    opacity: 0.6,
  },
  rewardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  rewardNameDisabled: {
    color: Colors.warmGray,
  },
  rewardDesc: {
    fontSize: 12,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  rewardCost: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
});
