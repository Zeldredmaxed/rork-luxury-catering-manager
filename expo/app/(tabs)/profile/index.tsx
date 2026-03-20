import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Heart,
  Clock,
  Settings,
  ChevronRight,
  LogOut,
  Shield,
  HelpCircle,
  Leaf,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { pastOrders } from '@/mocks/orders';
import * as Haptics from 'expo-haptics';

interface ProfileMenuItem {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const activeOrders = pastOrders.filter(o => o.status !== 'delivered');

  const handlePress = useCallback((label: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(label, 'This feature is coming soon!');
  }, []);

  const menuSections: { title: string; items: ProfileMenuItem[] }[] = [
    {
      title: 'Orders',
      items: [
        {
          icon: <Clock size={20} color={Colors.accent} />,
          label: 'Order History',
          subtitle: `${user.totalOrders} orders`,
          onPress: () => handlePress('Order History'),
        },
        {
          icon: <Heart size={20} color={Colors.accent} />,
          label: 'Favorites',
          onPress: () => handlePress('Favorites'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: <MapPin size={20} color={Colors.accent} />,
          label: 'Saved Addresses',
          subtitle: `${user.savedAddresses.length} addresses`,
          onPress: () => handlePress('Saved Addresses'),
        },
        {
          icon: <CreditCard size={20} color={Colors.accent} />,
          label: 'Payment Methods',
          onPress: () => handlePress('Payment Methods'),
        },
        {
          icon: <Leaf size={20} color={Colors.accent} />,
          label: 'Dietary Preferences',
          subtitle: user.dietaryPreferences.join(', ') || 'None set',
          onPress: () => handlePress('Dietary Preferences'),
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          icon: <Bell size={20} color={Colors.accent} />,
          label: 'Notifications',
          onPress: () => handlePress('Notifications'),
        },
        {
          icon: <Shield size={20} color={Colors.accent} />,
          label: 'Privacy & Security',
          onPress: () => handlePress('Privacy & Security'),
        },
        {
          icon: <HelpCircle size={20} color={Colors.accent} />,
          label: 'Help & Support',
          onPress: () => handlePress('Help & Support'),
        },
        {
          icon: <Settings size={20} color={Colors.accent} />,
          label: 'App Settings',
          onPress: () => handlePress('App Settings'),
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <User size={28} color={Colors.white} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => handlePress('Edit Profile')}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        {activeOrders.length > 0 && (
          <View style={styles.activeOrderCard}>
            <View style={styles.activeOrderHeader}>
              <Text style={styles.activeOrderTitle}>Active Order</Text>
              <View style={styles.activeOrderBadge}>
                <Text style={styles.activeOrderBadgeText}>
                  {activeOrders[0].status.charAt(0).toUpperCase() + activeOrders[0].status.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.activeOrderId}>{activeOrders[0].id}</Text>
            <Text style={styles.activeOrderItems}>
              {activeOrders[0].items.map(i => i.menuItem.name).join(', ')}
            </Text>
            <View style={styles.activeOrderFooter}>
              <Text style={styles.activeOrderTotal}>${activeOrders[0].total.toFixed(2)}</Text>
              <Text style={styles.activeOrderTime}>
                {activeOrders[0].deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} · {activeOrders[0].scheduledTime}
              </Text>
            </View>
          </View>
        )}

        {menuSections.map(section => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  style={[styles.menuRow, i < section.items.length - 1 && styles.menuRowBorder]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuRowIcon}>{item.icon}</View>
                  <View style={styles.menuRowContent}>
                    <Text style={styles.menuRowLabel}>{item.label}</Text>
                    {item.subtitle && <Text style={styles.menuRowSubtitle}>{item.subtitle}</Text>}
                  </View>
                  <ChevronRight size={18} color={Colors.warmGrayLight} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable
          style={styles.logoutButton}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert('Sign Out', 'Are you sure you want to sign out?');
          }}
        >
          <LogOut size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>Exquisite Meals v1.0.0</Text>
        <View style={{ height: 30 }} />
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
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    letterSpacing: -0.5,
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrap: {},
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.warmGray,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 13,
    color: Colors.warmGray,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.beigeLight,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  activeOrderCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeOrderTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.accentLight,
  },
  activeOrderBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeOrderBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  activeOrderId: {
    fontSize: 12,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  activeOrderItems: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.white,
    marginBottom: 10,
  },
  activeOrderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 10,
  },
  activeOrderTotal: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.accentLight,
  },
  activeOrderTime: {
    fontSize: 13,
    color: Colors.warmGray,
  },
  menuSection: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  menuSectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warmGray,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuRowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuRowContent: {
    flex: 1,
  },
  menuRowLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  menuRowSubtitle: {
    fontSize: 12,
    color: Colors.warmGray,
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.white,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.warmGrayLight,
    marginTop: 16,
  },
});
