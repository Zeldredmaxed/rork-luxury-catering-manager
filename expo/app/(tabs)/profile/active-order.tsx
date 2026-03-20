import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Package, Truck, CheckCircle, Phone, MessageCircle, ChefHat } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { pastOrders } from '@/mocks/orders';
import { OrderStatus } from '@/types';
import * as Haptics from 'expo-haptics';

const steps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={20} color={Colors.white} /> },
  { status: 'preparing', label: 'Preparing', icon: <ChefHat size={20} color={Colors.white} /> },
  { status: 'ready', label: 'Ready', icon: <Package size={20} color={Colors.white} /> },
  { status: 'delivered', label: 'Delivered', icon: <Truck size={20} color={Colors.white} /> },
];

const statusIndex: Record<OrderStatus, number> = {
  confirmed: 0,
  preparing: 1,
  ready: 2,
  delivered: 3,
};

export default function ActiveOrderScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const order = pastOrders.find(o => o.id === orderId) || pastOrders.find(o => o.status !== 'delivered');

  useEffect(() => {
    if (!order) return;
    const currentIdx = statusIndex[order.status];
    if (currentIdx < 3) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [order, pulseAnim]);

  if (!order) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Order Details', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />
        <View style={styles.emptyState}>
          <Package size={48} color={Colors.warmGrayLight} />
          <Text style={styles.emptyTitle}>No active orders</Text>
          <Text style={styles.emptySubtitle}>Your next order details will appear here</Text>
          <Pressable style={styles.browseBtn} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentStepIdx = statusIndex[order.status];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order ${order.id}`, headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            {order.status === 'delivered' ? 'Order Delivered!' : 'Order in Progress'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {order.deliveryType === 'delivery' ? 'Estimated Delivery' : 'Pickup Time'}: {order.scheduledTime}
          </Text>

          <View style={styles.timeline}>
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <View key={step.status} style={styles.timelineStep}>
                  <View style={styles.timelineLeft}>
                    {isCurrent && currentStepIdx < 3 ? (
                      <Animated.View style={[styles.stepCircle, styles.stepCircleActive, { transform: [{ scale: pulseAnim }] }]}>
                        {step.icon}
                      </Animated.View>
                    ) : (
                      <View style={[styles.stepCircle, isCompleted ? styles.stepCircleCompleted : styles.stepCircleInactive]}>
                        {isCompleted ? step.icon : <View style={styles.stepDot} />}
                      </View>
                    )}
                    {idx < steps.length - 1 && (
                      <View style={[styles.stepLine, isCompleted ? styles.stepLineCompleted : styles.stepLineInactive]} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepLabel, isCompleted && styles.stepLabelActive]}>{step.label}</Text>
                    {isCurrent && (
                      <Text style={styles.stepTime}>Now</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsCard}>
            {order.items.map((item, idx) => (
              <View key={idx} style={[styles.itemRow, idx < order.items.length - 1 && styles.itemBorder]}>
                <Image source={{ uri: item.menuItem.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.menuItem.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                  {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
                </View>
                <Text style={styles.itemPrice}>${(item.menuItem.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>{order.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Scheduled</Text>
              <Text style={styles.detailValue}>{order.scheduledDate} at {order.scheduledTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactRow}>
          <Pressable
            style={styles.contactBtn}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/chat');
            }}
          >
            <MessageCircle size={18} color={Colors.accent} />
            <Text style={styles.contactBtnText}>Chat with Us</Text>
          </Pressable>
          <Pressable
            style={[styles.contactBtn, styles.contactBtnPhone]}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Phone size={18} color={Colors.white} />
            <Text style={[styles.contactBtnText, { color: Colors.white }]}>Call</Text>
          </Pressable>
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
    padding: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.warmGray,
    marginBottom: 24,
  },
  timeline: {
    gap: 0,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.accent,
  },
  stepCircleCompleted: {
    backgroundColor: Colors.success,
  },
  stepCircleInactive: {
    backgroundColor: Colors.primaryLight,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warmGray,
  },
  stepLine: {
    width: 2,
    height: 24,
  },
  stepLineCompleted: {
    backgroundColor: Colors.success,
  },
  stepLineInactive: {
    backgroundColor: Colors.primaryLight,
  },
  stepContent: {
    paddingBottom: 24,
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.warmGray,
  },
  stepLabelActive: {
    color: Colors.white,
  },
  stepTime: {
    fontSize: 12,
    color: Colors.accent,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warmGray,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  itemsCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    alignItems: 'center',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.beigeLight,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  itemQty: {
    fontSize: 12,
    color: Colors.warmGray,
    marginTop: 2,
  },
  itemNotes: {
    fontSize: 11,
    color: Colors.accent,
    fontStyle: 'italic' as const,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.warmGray,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.warmGray,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  contactBtnPhone: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  contactBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.warmGray,
  },
  browseBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  browseBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
  },
});
