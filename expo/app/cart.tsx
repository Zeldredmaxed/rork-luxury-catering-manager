import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Minus, Plus, Trash2, MapPin, Clock, CreditCard, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { user } = useUser();
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;

  const deliveryFee = deliveryType === 'delivery' ? 5.99 : 0;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + deliveryFee + tax;

  const handleRemoveItem = useCallback((menuItemId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeItem(menuItemId);
  }, [removeItem]);

  const handleUpdateQuantity = useCallback((menuItemId: string, delta: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const item = items.find(i => i.menuItem.id === menuItemId);
    if (item) {
      updateQuantity(menuItemId, item.quantity + delta);
    }
  }, [items, updateQuantity]);

  const handlePlaceOrder = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setOrderPlaced(true);
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      clearCart();
      router.back();
    }, 2500);
  }, [clearCart, router, successAnim]);

  if (orderPlaced) {
    return (
      <View style={[styles.successContainer, { paddingBottom: insets.bottom }]}>
        <Animated.View
          style={[
            styles.successContent,
            {
              opacity: successAnim,
              transform: [
                {
                  scale: successAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.successIcon}>
            <CheckCircle size={56} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successMessage}>
            Your order has been confirmed. We'll notify you when it's being prepared.
          </Text>
          <Text style={styles.successTotal}>${grandTotal.toFixed(2)}</Text>
        </Animated.View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🍽️</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyDesc}>Browse our menu to add exquisite meals</Text>
        <Pressable style={styles.browseButton} onPress={() => router.back()}>
          <Text style={styles.browseButtonText}>Browse Menu</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.map(cartItem => (
          <View key={cartItem.menuItem.id} style={styles.cartItem}>
            <Image source={{ uri: cartItem.menuItem.image }} style={styles.itemImage} contentFit="cover" transition={200} />
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName} numberOfLines={1}>{cartItem.menuItem.name}</Text>
                <Pressable onPress={() => handleRemoveItem(cartItem.menuItem.id)} hitSlop={8}>
                  <Trash2 size={16} color={Colors.error} />
                </Pressable>
              </View>
              {cartItem.notes ? (
                <Text style={styles.itemNotes} numberOfLines={1}>Note: {cartItem.notes}</Text>
              ) : null}
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>${(cartItem.menuItem.price * cartItem.quantity).toFixed(2)}</Text>
                <View style={styles.quantityControl}>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() => handleUpdateQuantity(cartItem.menuItem.id, -1)}
                  >
                    <Minus size={14} color={Colors.text} />
                  </Pressable>
                  <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() => handleUpdateQuantity(cartItem.menuItem.id, 1)}
                  >
                    <Plus size={14} color={Colors.text} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.deliverySection}>
          <Text style={styles.sectionLabel}>Delivery Method</Text>
          <View style={styles.deliveryOptions}>
            <Pressable
              style={[styles.deliveryOption, deliveryType === 'delivery' && styles.deliveryOptionActive]}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDeliveryType('delivery');
              }}
            >
              <MapPin size={18} color={deliveryType === 'delivery' ? Colors.accent : Colors.warmGray} />
              <Text style={[styles.deliveryOptionText, deliveryType === 'delivery' && styles.deliveryOptionTextActive]}>
                Delivery
              </Text>
              <Text style={styles.deliveryFee}>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</Text>
            </Pressable>
            <Pressable
              style={[styles.deliveryOption, deliveryType === 'pickup' && styles.deliveryOptionActive]}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDeliveryType('pickup');
              }}
            >
              <Clock size={18} color={deliveryType === 'pickup' ? Colors.accent : Colors.warmGray} />
              <Text style={[styles.deliveryOptionText, deliveryType === 'pickup' && styles.deliveryOptionTextActive]}>
                Pickup
              </Text>
              <Text style={styles.deliveryFee}>Free</Text>
            </Pressable>
          </View>
        </View>

        {deliveryType === 'delivery' && user.savedAddresses.length > 0 && (
          <View style={styles.addressCard}>
            <MapPin size={18} color={Colors.accent} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>{user.savedAddresses[0].label}</Text>
              <Text style={styles.addressText}>
                {user.savedAddresses[0].street}, {user.savedAddresses[0].city}
              </Text>
            </View>
            <Pressable>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.summarySection}>
          <Text style={styles.sectionLabel}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>
                {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.pointsEarned}>
          <Text style={styles.pointsEarnedText}>
            You'll earn <Text style={styles.pointsHighlight}>{Math.floor(grandTotal * 10)} points</Text> with this order
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.checkoutButton} onPress={handlePlaceOrder} testID="checkout-button">
          <CreditCard size={18} color={Colors.white} />
          <Text style={styles.checkoutText}>Place Order · ${grandTotal.toFixed(2)}</Text>
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
  scrollContent: {
    padding: 20,
  },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 15,
    color: Colors.warmGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  successTotal: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 15,
    color: Colors.warmGray,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 90,
    height: 90,
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  itemNotes: {
    fontSize: 11,
    color: Colors.warmGray,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.beigeLight,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    minWidth: 18,
    textAlign: 'center',
  },
  deliverySection: {
    marginTop: 12,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  deliveryOption: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  deliveryOptionActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '08',
  },
  deliveryOptionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.warmGray,
  },
  deliveryOptionTextActive: {
    color: Colors.accent,
  },
  deliveryFee: {
    fontSize: 12,
    color: Colors.warmGray,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  addressText: {
    fontSize: 12,
    color: Colors.warmGray,
    marginTop: 2,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.warmGray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
    marginBottom: 0,
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
  pointsEarned: {
    backgroundColor: Colors.accent + '10',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  pointsEarnedText: {
    fontSize: 13,
    color: Colors.warmGrayDark,
  },
  pointsHighlight: {
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  checkoutText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
