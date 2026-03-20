import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Zap, Crown, Users } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const plans = [
  {
    id: 'WEEKLY_BASIC',
    name: 'Basic',
    price: 79.99,
    meals: 5,
    description: '5 chef-crafted meals per week',
    perks: ['5 meals/week', 'Free delivery', 'Flexible schedule', 'Skip anytime'],
    icon: Zap,
    color: '#AAA9AD',
    popular: false,
  },
  {
    id: 'WEEKLY_PREMIUM',
    name: 'Premium',
    price: 149.99,
    meals: 10,
    description: '10 gourmet meals per week',
    perks: ['10 meals/week', 'Free delivery', 'Priority kitchen', '2x reward points', 'Dietary customization'],
    icon: Crown,
    color: '#C4956A',
    popular: true,
  },
  {
    id: 'WEEKLY_FAMILY',
    name: 'Family',
    price: 199.99,
    meals: 14,
    description: '14 meals — feeds the whole family',
    perks: ['14 meals/week', 'Free delivery', 'Family portions', '3x reward points', 'Personal concierge', 'Menu preview access'],
    icon: Users,
    color: '#D4AF37',
    popular: false,
  },
];

export default function SubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('WEEKLY_PREMIUM');

  const handleSubscribe = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const plan = plans.find(p => p.id === selectedPlan);
    Alert.alert(
      'Subscription Started! 🎉',
      `You're now subscribed to the ${plan?.name} plan. Your first delivery will arrive within 3 days.`,
      [{ text: 'Awesome!', onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </Pressable>
        <View>
          <Text style={styles.title}>Meal Plans</Text>
          <Text style={styles.subtitle}>Weekly gourmet delivered to your door</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {plans.map(plan => {
          const isSelected = selectedPlan === plan.id;
          const Icon = plan.icon;
          return (
            <Pressable
              key={plan.id}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedPlan(plan.id);
              }}
              style={[
                styles.planCard,
                isSelected && styles.planCardSelected,
                isSelected && { borderColor: plan.color },
              ]}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: plan.color + '15' }]}>
                  <Icon size={22} color={plan.color} />
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDesc}>{plan.description}</Text>
                </View>
                <View style={styles.planPrice}>
                  <Text style={styles.priceAmount}>${plan.price}</Text>
                  <Text style={styles.pricePeriod}>/week</Text>
                </View>
              </View>

              <View style={styles.perksList}>
                {plan.perks.map((perk, i) => (
                  <View key={i} style={styles.perkRow}>
                    <Check size={14} color={isSelected ? plan.color : Colors.warmGray} />
                    <Text style={[styles.perkText, isSelected && { color: Colors.text }]}>{perk}</Text>
                  </View>
                ))}
              </View>

              {isSelected && (
                <View style={[styles.selectedIndicator, { backgroundColor: plan.color }]}>
                  <Check size={16} color="#FFF" />
                </View>
              )}
            </Pressable>
          );
        })}

        <Pressable style={styles.subscribeBtn} onPress={handleSubscribe}>
          <Text style={styles.subscribeBtnText}>Start Subscription</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Cancel or skip anytime. Billed weekly. First delivery within 3 business days.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.warmGray, marginTop: 2 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  planCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: Colors.border, position: 'relative', overflow: 'hidden' },
  planCardSelected: { borderWidth: 2 },
  popularBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  popularText: { fontSize: 10, fontWeight: '700', color: '#FFF', letterSpacing: 0.5 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  planInfo: { flex: 1 },
  planName: { fontSize: 17, fontWeight: '700', color: Colors.text },
  planDesc: { fontSize: 12, color: Colors.warmGray, marginTop: 2 },
  planPrice: { alignItems: 'flex-end' },
  priceAmount: { fontSize: 22, fontWeight: '800', color: Colors.text },
  pricePeriod: { fontSize: 11, color: Colors.warmGray },
  perksList: { marginTop: 16, gap: 8 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  perkText: { fontSize: 13, color: Colors.warmGray },
  selectedIndicator: { position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  subscribeBtn: { backgroundColor: Colors.accent, borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  subscribeBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
  disclaimer: { textAlign: 'center', fontSize: 11, color: Colors.warmGrayLight, marginTop: 12, lineHeight: 16 },
});
