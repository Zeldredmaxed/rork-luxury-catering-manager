import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, X, SlidersHorizontal, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { menuItems as mockMenuItems, categories } from '@/mocks/menu';
import { api } from '@/services/api';
import { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import MenuCard from '@/components/MenuCard';
import * as Haptics from 'expo-haptics';

const allCategories = [{ id: 'all', name: 'All' }, ...categories];

const categoryMap: Record<string, string> = {
  'MEAL_PREP': 'meal-prep',
  'FAMILY_MEALS': 'family-meals',
  'CATERING': 'catering',
};

function mapApiItem(item: any): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    category: (categoryMap[item.category] || item.category) as MenuItem['category'],
    tags: item.tags || [],
    calories: item.calories,
    prepTime: item.prepTime,
    servings: item.servings,
    featured: item.featured,
    popular: item.popular,
  };
}

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'all');
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  useEffect(() => {
    api.getMenuItems().then((data: any) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setMenuItems(data.map(mapApiItem));
      }
    }).catch(() => {});
  }, []);

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (selectedCategory !== 'all') {
      items = items.filter(i => i.category === selectedCategory);
    }
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query) ||
        i.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    return items;
  }, [selectedCategory, searchText, menuItems]);

  const toggleSearch = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = showSearch ? 0 : 1;
    setShowSearch(!showSearch);
    Animated.timing(searchAnim, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
    if (showSearch) setSearchText('');
  }, [showSearch, searchAnim]);

  const handleCategoryPress = useCallback((catId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(catId);
  }, []);

  const searchHeight = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} onPress={toggleSearch}>
            {showSearch ? <X size={20} color={Colors.text} /> : <Search size={20} color={Colors.text} />}
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => router.push('/cart')} testID="menu-cart-button">
            <ShoppingBag size={20} color={Colors.text} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.searchContainer, { height: searchHeight, overflow: 'hidden' }]}>
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.warmGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search meals, ingredients..."
            placeholderTextColor={Colors.warmGrayLight}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={showSearch}
          />
          {searchText ? (
            <Pressable onPress={() => setSearchText('')}>
              <X size={16} color={Colors.warmGray} />
            </Pressable>
          ) : null}
        </View>
      </Animated.View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {allCategories.map(cat => (
            <Pressable
              key={cat.id}
              style={[styles.categoryPill, selectedCategory === cat.id && styles.categoryPillActive]}
              onPress={() => handleCategoryPress(cat.id)}
              testID={`menu-cat-${cat.id}`}
            >
              <Text style={[styles.categoryPillText, selectedCategory === cat.id && styles.categoryPillTextActive]}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
      >
        <Text style={styles.resultCount}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </Text>
        {filteredItems.map(item => (
          <MenuCard
            key={item.id}
            item={item}
            variant="default"
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/meal/${item.id}`);
            }}
          />
        ))}
        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <SlidersHorizontal size={40} color={Colors.warmGrayLight} />
            <Text style={styles.emptyTitle}>No meals found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your filters or search</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.accent,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '700' as const,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  categoriesContainer: {
    marginBottom: 4,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  categoryPillTextActive: {
    color: Colors.white,
  },
  menuList: {
    paddingHorizontal: 20,
  },
  resultCount: {
    fontSize: 13,
    color: Colors.warmGray,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.warmGray,
  },
});
