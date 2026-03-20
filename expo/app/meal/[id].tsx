import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Minus, Plus, Clock, Flame, Users, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { menuItems } from '@/mocks/menu';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useUser();

  const item = menuItems.find(m => m.id === id);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  const handleAddToCart = useCallback(() => {
    if (!item) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    addItem(item, quantity, notes);
    setTimeout(() => router.back(), 300);
  }, [item, quantity, notes, addItem, router, scaleAnim]);

  const handleFavorite = useCallback(() => {
    if (!item) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(heartAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    void toggleFavorite(item.id);
  }, [item, heartAnim, toggleFavorite]);

  const handleQuantityChange = useCallback((delta: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(prev => Math.max(1, prev + delta));
  }, []);

  if (!item) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Meal not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const favorite = isFavorite(item.id);
  const totalPrice = item.price * quantity;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.heroImage} contentFit="cover" transition={300} />
          <View style={styles.imageOverlay} />
          <View style={[styles.imageActions, { top: insets.top + 8 }]}>
            <Pressable style={styles.actionButton} onPress={() => router.back()} testID="back-button">
              <ArrowLeft size={20} color={Colors.white} />
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleFavorite} testID="fav-button">
              <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
                <Heart size={20} color={favorite ? Colors.accent : Colors.white} fill={favorite ? Colors.accent : 'transparent'} />
              </Animated.View>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.tagsRow}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.category === 'catering' && (
              <View style={[styles.tag, styles.cateringTag]}>
                <Text style={[styles.tagText, styles.cateringTagText]}>catering</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.infoRow}>
            {item.calories ? (
              <View style={styles.infoItem}>
                <Flame size={16} color={Colors.accent} />
                <Text style={styles.infoText}>{item.calories} cal</Text>
              </View>
            ) : null}
            {item.prepTime ? (
              <View style={styles.infoItem}>
                <Clock size={16} color={Colors.accent} />
                <Text style={styles.infoText}>{item.prepTime}</Text>
              </View>
            ) : null}
            {item.servings ? (
              <View style={styles.infoItem}>
                <Users size={16} color={Colors.accent} />
                <Text style={styles.infoText}>Serves {item.servings}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionLabel}>Special Instructions</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any dietary needs or preferences..."
            placeholderTextColor={Colors.warmGrayLight}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            testID="notes-input"
          />

          <View style={styles.quantitySection}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.quantityControl}>
              <Pressable
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus size={18} color={quantity <= 1 ? Colors.warmGrayLight : Colors.text} />
              </Pressable>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Pressable style={styles.quantityButton} onPress={() => handleQuantityChange(1)}>
                <Plus size={18} color={Colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <Pressable style={styles.addToCartButton} onPress={handleAddToCart} testID="add-to-cart">
            <ShoppingBag size={18} color={Colors.white} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 60,
  },
  backLink: {
    fontSize: 16,
    color: Colors.accent,
    textAlign: 'center',
    marginTop: 12,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  imageActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.beigeLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.warmGrayDark,
    textTransform: 'capitalize' as const,
  },
  cateringTag: {
    backgroundColor: Colors.accent + '20',
  },
  cateringTagText: {
    color: Colors.accent,
  },
  name: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.warmGrayDark,
    fontWeight: '500' as const,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 10,
  },
  notesInput: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quantityButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.beigeLight,
  },
  quantityButtonDisabled: {
    opacity: 0.4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    minWidth: 28,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.warmGray,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  addToCartButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
