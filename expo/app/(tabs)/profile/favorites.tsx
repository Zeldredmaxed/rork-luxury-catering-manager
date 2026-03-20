import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Heart, ShoppingCart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import { menuItems } from '@/mocks/menu';
import { MenuItem } from '@/types';
import * as Haptics from 'expo-haptics';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useUser();
  const { addItem } = useCart();

  const favoriteItems = menuItems.filter(item => favorites.includes(item.id));

  const handleRemoveFavorite = useCallback((itemId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    void toggleFavorite(itemId);
  }, [toggleFavorite]);

  const handleAddToCart = useCallback((item: MenuItem) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem(item);
  }, [addItem]);

  const renderItem = useCallback(({ item }: { item: MenuItem }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: '/meal/[id]', params: { id: item.id } })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 2).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.cardActions}>
          <Pressable style={styles.heartBtn} onPress={() => handleRemoveFavorite(item.id)}>
            <Heart size={18} color={Colors.error} fill={Colors.error} />
          </Pressable>
          <Pressable style={styles.cartBtn} onPress={() => handleAddToCart(item)}>
            <ShoppingCart size={16} color={Colors.white} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  ), [router, handleRemoveFavorite, handleAddToCart]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Favorites', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <FlatList
        data={favoriteItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Heart size={48} color={Colors.warmGrayLight} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>Save meals you love to quickly find them here</Text>
            <Pressable style={styles.browseBtn} onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.browseBtnText}>Browse Menu</Text>
            </Pressable>
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
  list: {
    padding: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.beigeLight,
  },
  cardContent: {
    padding: 14,
    flexDirection: 'row',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  desc: {
    fontSize: 13,
    color: Colors.warmGray,
    marginTop: 4,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.beigeLight,
  },
  tagText: {
    fontSize: 11,
    color: Colors.accentDark,
    fontWeight: '500' as const,
  },
  price: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.accent,
    marginTop: 8,
  },
  cardActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  heartBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    paddingHorizontal: 40,
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
