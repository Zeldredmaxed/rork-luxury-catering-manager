import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
  cardholderName: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/27', isDefault: true, cardholderName: 'John Doe' },
  { id: '2', type: 'mastercard', last4: '8888', expiry: '06/28', isDefault: false, cardholderName: 'John Doe' },
];

const cardColors: Record<string, string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#006FCF',
};

const cardLabels: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
};

export default function PaymentMethodsScreen() {
  const [methods, setMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Remove Card', 'Are you sure you want to remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setMethods(prev => prev.filter(m => m.id !== id));
        },
      },
    ]);
  }, []);

  const handleSetDefault = useCallback((id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  }, []);

  const renderCard = useCallback(({ item }: { item: PaymentMethod }) => (
    <View style={styles.cardWrap}>
      <View style={[styles.cardVisual, { backgroundColor: cardColors[item.type] || Colors.primary }]}>
        <View style={styles.cardVisualHeader}>
          <Text style={styles.cardType}>{cardLabels[item.type]}</Text>
          {item.isDefault && (
            <View style={styles.defaultChip}>
              <Text style={styles.defaultChipText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
        <View style={styles.cardVisualFooter}>
          <View>
            <Text style={styles.cardFooterLabel}>Cardholder</Text>
            <Text style={styles.cardFooterValue}>{item.cardholderName}</Text>
          </View>
          <View>
            <Text style={styles.cardFooterLabel}>Expires</Text>
            <Text style={styles.cardFooterValue}>{item.expiry}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardActionsRow}>
        {!item.isDefault && (
          <Pressable style={styles.actionBtn} onPress={() => handleSetDefault(item.id)}>
            <Star size={16} color={Colors.accent} />
            <Text style={styles.actionBtnText}>Set Default</Text>
          </Pressable>
        )}
        <Pressable style={[styles.actionBtn, styles.deleteActionBtn]} onPress={() => handleDelete(item.id)}>
          <Trash2 size={16} color={Colors.error} />
          <Text style={[styles.actionBtnText, { color: Colors.error }]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  ), [handleSetDefault, handleDelete]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Payment Methods', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <FlatList
        data={methods}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CreditCard size={48} color={Colors.warmGrayLight} />
            <Text style={styles.emptyTitle}>No payment methods</Text>
            <Text style={styles.emptySubtitle}>Add a card to speed up checkout</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.securityNote}>
            <Text style={styles.securityNoteText}>
              Your payment information is encrypted and securely stored via Stripe. We never store your full card number.
            </Text>
          </View>
        }
      />
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Add Card', 'Stripe payment form will be integrated here for secure card entry.');
          }}
        >
          <Plus size={20} color={Colors.white} />
          <Text style={styles.addBtnText}>Add Payment Method</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  cardWrap: {
    marginBottom: 16,
  },
  cardVisual: {
    borderRadius: 18,
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  cardVisualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    letterSpacing: 1,
  },
  defaultChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultChipText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.white,
    letterSpacing: 2,
    marginTop: 20,
  },
  cardVisualFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardFooterLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  cardFooterValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  deleteActionBtn: {
    backgroundColor: Colors.error + '08',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.accent,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
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
  securityNote: {
    backgroundColor: Colors.beigeLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  securityNoteText: {
    fontSize: 12,
    color: Colors.warmGray,
    lineHeight: 18,
    textAlign: 'center',
  },
});
