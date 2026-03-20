import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { MapPin, Plus, Trash2, Star, X, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { Address } from '@/types';
import * as Haptics from 'expo-haptics';

const emptyAddress: Omit<Address, 'id'> = {
  label: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  isDefault: false,
};

export default function SavedAddressesScreen() {
  const { user, updateProfile } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);

  const handleSave = useCallback(() => {
    if (!form.label || !form.street || !form.city || !form.state || !form.zip) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const addresses = [...user.savedAddresses];
    if (editingId) {
      const idx = addresses.findIndex(a => a.id === editingId);
      if (idx >= 0) addresses[idx] = { ...form, id: editingId };
    } else {
      const newAddr: Address = { ...form, id: `addr_${Date.now()}` };
      if (newAddr.isDefault) {
        addresses.forEach(a => (a.isDefault = false));
      }
      addresses.push(newAddr);
    }

    if (form.isDefault) {
      addresses.forEach(a => {
        a.isDefault = a.id === (editingId || addresses[addresses.length - 1].id);
      });
    }

    updateProfile({ savedAddresses: addresses });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyAddress);
  }, [form, editingId, user.savedAddresses, updateProfile]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          const updated = user.savedAddresses.filter(a => a.id !== id);
          updateProfile({ savedAddresses: updated });
        },
      },
    ]);
  }, [user.savedAddresses, updateProfile]);

  const handleSetDefault = useCallback((id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = user.savedAddresses.map(a => ({ ...a, isDefault: a.id === id }));
    updateProfile({ savedAddresses: updated });
  }, [user.savedAddresses, updateProfile]);

  const handleEdit = useCallback((addr: Address) => {
    setEditingId(addr.id);
    setForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, isDefault: addr.isDefault });
    setShowForm(true);
  }, []);

  const renderAddress = useCallback(({ item }: { item: Address }) => (
    <Pressable style={styles.addressCard} onPress={() => handleEdit(item)}>
      <View style={styles.addressIcon}>
        <MapPin size={20} color={item.isDefault ? Colors.accent : Colors.warmGray} />
      </View>
      <View style={styles.addressInfo}>
        <View style={styles.addressLabelRow}>
          <Text style={styles.addressLabel}>{item.label}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressStreet}>{item.street}</Text>
        <Text style={styles.addressCity}>{item.city}, {item.state} {item.zip}</Text>
      </View>
      <View style={styles.addressActions}>
        {!item.isDefault && (
          <Pressable style={styles.setDefaultBtn} onPress={() => handleSetDefault(item.id)}>
            <Star size={16} color={Colors.warmGray} />
          </Pressable>
        )}
        <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Trash2 size={16} color={Colors.error} />
        </Pressable>
      </View>
    </Pressable>
  ), [handleEdit, handleSetDefault, handleDelete]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: 'Saved Addresses', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      {showForm ? (
        <View style={styles.formWrap}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>{editingId ? 'Edit Address' : 'New Address'}</Text>
            <Pressable onPress={() => { setShowForm(false); setEditingId(null); setForm(emptyAddress); }}>
              <X size={22} color={Colors.warmGray} />
            </Pressable>
          </View>
          <View style={styles.formFields}>
            <TextInput style={styles.input} placeholder="Label (e.g. Home, Work)" placeholderTextColor={Colors.warmGrayLight} value={form.label} onChangeText={v => setForm(p => ({ ...p, label: v }))} />
            <TextInput style={styles.input} placeholder="Street Address" placeholderTextColor={Colors.warmGrayLight} value={form.street} onChangeText={v => setForm(p => ({ ...p, street: v }))} />
            <View style={styles.inputRow}>
              <TextInput style={[styles.input, { flex: 2 }]} placeholder="City" placeholderTextColor={Colors.warmGrayLight} value={form.city} onChangeText={v => setForm(p => ({ ...p, city: v }))} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="State" placeholderTextColor={Colors.warmGrayLight} value={form.state} onChangeText={v => setForm(p => ({ ...p, state: v }))} />
            </View>
            <TextInput style={styles.input} placeholder="ZIP Code" placeholderTextColor={Colors.warmGrayLight} value={form.zip} onChangeText={v => setForm(p => ({ ...p, zip: v }))} keyboardType="number-pad" />
            <Pressable
              style={styles.defaultToggle}
              onPress={() => setForm(p => ({ ...p, isDefault: !p.isDefault }))}
            >
              <View style={[styles.checkbox, form.isDefault && styles.checkboxActive]}>
                {form.isDefault && <Check size={14} color={Colors.white} />}
              </View>
              <Text style={styles.defaultToggleText}>Set as default address</Text>
            </Pressable>
          </View>
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Address</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={user.savedAddresses}
            keyExtractor={item => item.id}
            renderItem={renderAddress}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MapPin size={48} color={Colors.warmGrayLight} />
                <Text style={styles.emptyTitle}>No saved addresses</Text>
                <Text style={styles.emptySubtitle}>Add an address for faster checkout</Text>
              </View>
            }
          />
          <View style={styles.bottomBar}>
            <Pressable
              style={styles.addBtn}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setForm(emptyAddress);
                setEditingId(null);
                setShowForm(true);
              }}
            >
              <Plus size={20} color={Colors.white} />
              <Text style={styles.addBtnText}>Add New Address</Text>
            </Pressable>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  defaultBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  addressStreet: {
    fontSize: 13,
    color: Colors.warmGray,
    marginTop: 2,
  },
  addressCity: {
    fontSize: 13,
    color: Colors.warmGray,
  },
  addressActions: {
    gap: 8,
  },
  setDefaultBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.beigeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.error + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: Colors.cream,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  formWrap: {
    flex: 1,
    padding: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  formFields: {
    gap: 12,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.warmGrayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  defaultToggleText: {
    fontSize: 14,
    color: Colors.text,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
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
