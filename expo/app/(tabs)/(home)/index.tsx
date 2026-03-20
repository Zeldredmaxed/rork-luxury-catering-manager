import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShoppingBag, ChevronRight, Sparkles, Crown, Home as HomeIcon, UtensilsCrossed } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { menuItems, categories, promotions } from '@/mocks/menu';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import MenuCard from '@/components/MenuCard';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const categoryIcons: Record<string, React.ReactNode> = {
  'meal-prep': <UtensilsCrossed size={22} color={Colors.accent} />,
  'family-meals': <HomeIcon size={22} color={Colors.accent} />,
  'catering': <Crown size={22} color={Colors.accent} />,
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const { totalItems } = useCart();
  const scrollX = useRef(new Animated.Value(0)).current;

  const featuredItems = menuItems.filter(item => item.featured);
  const popularItems = menuItems.filter(item => item.popular);

  const handleMealPress = useCallback((id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/meal/${id}`);
  }, [router]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/menu', params: { category: categoryId } });
  }, [router]);

  const handleCartPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/cart');
  }, [router]);

  const tierColors: Record<string, string> = {
    bronze: Colors.tierBronze,
    silver: Colors.tierSilver,
    gold: Colors.tierGold,
    vip: Colors.tierVIP,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening,</Text>
            <Text style={styles.userName}>{user.name.split(' ')[0]}</Text>
          </View>
          <Pressable style={styles.cartButton} onPress={handleCartPress} testID="cart-button">
            <ShoppingBag size={22} color={Colors.text} />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.rewardsBanner}>
          <View style={styles.rewardsBannerLeft}>
            <View style={[styles.tierBadge, { backgroundColor: tierColors[user.rewardsTier] + '20' }]}>
              <Sparkles size={14} color={tierColors[user.rewardsTier]} />
              <Text style={[styles.tierText, { color: tierColors[user.rewardsTier] }]}>
                {user.rewardsTier.charAt(0).toUpperCase() + user.rewardsTier.slice(1)} Member
              </Text>
            </View>
            <Text style={styles.pointsText}>{user.rewardsPoints.toLocaleString()} pts</Text>
          </View>
          <Pressable onPress={() => router.push('/rewards')}>
            <ChevronRight size={20} color={Colors.warmGray} />
          </Pressable>
        </View>

        {promotions.length > 0 && (
          <View style={styles.promoSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoScroll}>
              {promotions.map(promo => (
                <Pressable key={promo.id} style={styles.promoCard}>
                  <Image source={{ uri: promo.image }} style={styles.promoImage} contentFit="cover" transition={300} />
                  <View style={styles.promoOverlay}>
                    {promo.discount && (
                      <View style={styles.promoBadge}>
                        <Text style={styles.promoBadgeText}>{promo.discount}</Text>
                      </View>
                    )}
                    <Text style={styles.promoTitle}>{promo.title}</Text>
                    <Text style={styles.promoDesc}>{promo.description}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(cat => (
              <Pressable
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(cat.id)}
                testID={`category-${cat.id}`}
              >
                <View style={styles.categoryIcon}>
                  {categoryIcons[cat.id]}
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryDesc}>{cat.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chef's Picks</Text>
            <Pressable onPress={() => router.push('/menu')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          >
            {featuredItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                variant="featured"
                onPress={() => handleMealPress(item.id)}
              />
            ))}
          </Animated.ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <Pressable onPress={() => router.push('/menu')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          {popularItems.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              variant="compact"
              onPress={() => handleMealPress(item.id)}
            />
          ))}
        </View>

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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: Colors.warmGray,
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700' as const,
  },
  rewardsBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  rewardsBannerLeft: {
    gap: 6,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  promoSection: {
    marginBottom: 24,
  },
  promoScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  promoCard: {
    width: SCREEN_WIDTH - 60,
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  promoBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 2,
  },
  promoDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600' as const,
  },
  categoriesGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  categoryDesc: {
    fontSize: 10,
    color: Colors.warmGray,
    textAlign: 'center',
  },
  featuredScroll: {
    paddingHorizontal: 20,
  },
});
