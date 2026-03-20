import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Package, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { pastOrders } from '@/mocks/orders';
import { Order, OrderStatus } from '@/types';
import * as Haptics from 'expo-haptics';

const statusColors: Record<OrderStatus, string> = {
  confirmed: Colors.warning,
  preparing: Colors.accent,
  ready: Colors.success,
  delivered: Colors.warmGray,
};

const statusLabels: Record<OrderStatus, string> = {
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
};

type FilterType = 'all' | 'active' | 'delivered';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredOrders = pastOrders.filter(order => {
    if (filter === 'active') return order.status !== 'delivered';
    if (filter === 'delivered') return order.status === 'delivered';
    return true;
  });

  const handleReorder = useCallback((_order: Order) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/cart');
  }, [router]);

  const renderOrder = useCallback(({ item }: { item: Order }) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <Pressable
        style={styles.orderCard}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({ pathname: '/active-order', params: { orderId: item.id } } as any);
        }}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{formattedDate}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] }]} />
            <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
              {statusLabels[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.itemsList}>
          {item.items.map((cartItem, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Image source={{ uri: cartItem.menuItem.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{cartItem.menuItem.name}</Text>
                <Text style={styles.itemQty}>Qty: {cartItem.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${(cartItem.menuItem.price * cartItem.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
          </View>
          <View style={styles.orderActions}>
            <Text style={styles.deliveryType}>
              {item.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} · {item.scheduledTime}
            </Text>
            {item.status === 'delivered' && (
              <Pressable style={styles.reorderBtn} onPress={() => handleReorder(item)}>
                <RotateCcw size={14} color={Colors.accent} />
                <Text style={styles.reorderText}>Reorder</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    );
  }, [router, handleReorder]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Order History', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <View style={styles.filterRow}>
        {(['all', 'active', 'delivered'] as FilterType[]).map(f => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter(f);
            }}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package size={48} color={Colors.warmGrayLight} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.warmGray,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.warmGray,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  itemsList: {
    gap: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.beigeLight,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  itemQty: {
    fontSize: 12,
    color: Colors.warmGray,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  orderFooter: {
    paddingTop: 12,
    gap: 8,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.warmGray,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryType: {
    fontSize: 12,
    color: Colors.warmGray,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.beigeLight,
  },
  reorderText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.accent,
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
});
