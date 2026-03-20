import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MenuItem } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import * as Haptics from 'expo-haptics';

interface MenuCardProps {
  item: MenuItem;
  onPress: () => void;
  variant?: 'default' | 'compact' | 'featured';
}

export default React.memo(function MenuCard({ item, onPress, variant = 'default' }: MenuCardProps) {
  const { isFavorite, toggleFavorite } = useUser();
  const { addItem } = useCart();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const favorite = isFavorite(item.id);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleFavorite = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(heartAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    void toggleFavorite(item.id);
  }, [heartAnim, toggleFavorite, item.id]);

  const handleQuickAdd = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem(item, 1, '');
  }, [addItem, item]);

  if (variant === 'featured') {
    return (
      <Animated.View style={[styles.featuredCard, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} testID={`featured-card-${item.id}`}>
          <Image source={{ uri: item.image }} style={styles.featuredImage} contentFit="cover" transition={300} />
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredContent}>
              <View style={styles.tagsRow}>
                {item.tags.slice(0, 2).map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.featuredName}>{item.name}</Text>
              <Text style={styles.featuredPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </View>
          <Pressable style={styles.heartButton} onPress={handleFavorite}>
            <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
              <Heart size={20} color={favorite ? Colors.accent : Colors.white} fill={favorite ? Colors.accent : 'transparent'} />
            </Animated.View>
          </Pressable>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === 'compact') {
    return (
      <Animated.View style={[styles.compactCard, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.compactInner} testID={`compact-card-${item.id}`}>
          <Image source={{ uri: item.image }} style={styles.compactImage} contentFit="cover" transition={300} />
          <View style={styles.compactContent}>
            <Text style={styles.compactName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.compactDesc} numberOfLines={1}>{item.description}</Text>
            <View style={styles.compactBottom}>
              <Text style={styles.compactPrice}>${item.price.toFixed(2)}</Text>
              {item.calories ? <Text style={styles.compactCal}>{item.calories} cal</Text> : null}
            </View>
          </View>
          <Pressable style={styles.quickAddButton} onPress={handleQuickAdd}>
            <Plus size={16} color={Colors.white} />
          </Pressable>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} testID={`menu-card-${item.id}`}>
        <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" transition={300} />
        <Pressable style={styles.heartButton} onPress={handleFavorite}>
          <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
            <Heart size={18} color={favorite ? Colors.accent : Colors.white} fill={favorite ? Colors.accent : 'transparent'} />
          </Animated.View>
        </Pressable>
        <View style={styles.cardContent}>
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 2).map(tag => (
              <View key={tag} style={styles.tagSmall}>
                <Text style={styles.tagSmallText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
            <Pressable style={styles.addButton} onPress={handleQuickAdd}>
              <Plus size={14} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 6,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '500' as const,
  },
  tagSmall: {
    backgroundColor: Colors.beigeLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagSmallText: {
    color: Colors.warmGrayDark,
    fontSize: 10,
    fontWeight: '500' as const,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  addButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCard: {
    width: 280,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  featuredContent: {
    padding: 16,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 2,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.accentLight,
  },
  compactCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  compactInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    margin: 8,
  },
  compactContent: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 50,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  compactDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  compactBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactPrice: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  compactCal: {
    fontSize: 11,
    color: Colors.warmGray,
  },
  quickAddButton: {
    position: 'absolute',
    right: 12,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
