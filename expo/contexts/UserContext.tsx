import { useState, useCallback, useEffect, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';
import { api } from '@/services/api';

const guestUser: UserProfile = {
  id: 'guest',
  name: 'Guest',
  email: '',
  phone: '',
  dietaryPreferences: [],
  allergies: [],
  savedAddresses: [],
  rewardsPoints: 0,
  rewardsTier: 'bronze',
  totalOrders: 0,
};

const tierMap: Record<string, string> = {
  'BRONZE': 'bronze',
  'SILVER': 'silver',
  'GOLD': 'gold',
  'VIP': 'vip',
};

function mapApiUser(data: any): UserProfile {
  return {
    id: data.id,
    name: data.name || 'User',
    email: data.email || '',
    phone: data.phone || '',
    dietaryPreferences: data.dietaryPreferences || [],
    allergies: data.allergies || [],
    savedAddresses: (data.addresses || []).map((a: any) => ({
      id: a.id,
      label: a.label,
      street: a.street,
      city: a.city,
      state: a.state,
      zip: a.zip,
      isDefault: a.isDefault,
    })),
    rewardsPoints: data.rewardsPoints || 0,
    rewardsTier: (tierMap[data.rewardsTier] || data.rewardsTier || 'bronze') as UserProfile['rewardsTier'],
    totalOrders: data.totalOrders || 0,
  };
}

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<UserProfile>(guestUser);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from API if logged in
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          const data = await api.getProfile();
          if (data) {
            setUser(mapApiUser(data));
          }
        }
      } catch (e) {
        console.log('Failed to load profile:', e);
      }

      // Load favorites
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
    void loadProfile();
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await api.getProfile();
      if (data) {
        setUser(mapApiUser(data));
      }
    } catch (e) {
      console.log('Failed to refresh profile:', e);
    }
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
    refreshProfile,
  }), [user, favorites, isLoading, toggleFavorite, isFavorite, updateProfile, refreshProfile]);
});
