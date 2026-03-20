import { useState, useCallback, useEffect, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';

const defaultUser: UserProfile = {
  id: 'user-1',
  name: 'Alexandra Chen',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  dietaryPreferences: ['gluten-free'],
  allergies: [],
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: '123 Park Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      isDefault: true,
    },
  ],
  rewardsPoints: 2450,
  rewardsTier: 'silver',
  totalOrders: 24,
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Failed to load favorites:', e);
      } finally {
        setIsLoading(false);
      }
    };
    void loadFavorites();
  }, []);

  const toggleFavorite = useCallback(async (menuItemId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(menuItemId)
        ? prev.filter(id => id !== menuItemId)
        : [...prev, menuItemId];
      void AsyncStorage.setItem('favorites', JSON.stringify(updated)).catch(e =>
        console.log('Failed to save favorites:', e)
      );
      return updated;
    });
  }, []);

  const isFavorite = useCallback((menuItemId: string) => {
    return favorites.includes(menuItemId);
  }, [favorites]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return useMemo(() => ({
    user,
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    updateProfile,
  }), [user, favorites, isLoading, toggleFavorite, isFavorite, updateProfile]);
});
