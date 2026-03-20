import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Leaf, AlertTriangle, Check, Plus, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import * as Haptics from 'expo-haptics';

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
  'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher',
  'Pescatarian', 'Nut-Free', 'Low-Sodium',
];

const commonAllergens = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs',
  'Wheat', 'Soy', 'Fish', 'Shellfish',
  'Sesame', 'Mustard', 'Celery', 'Lupin',
];

export default function DietaryPreferencesScreen() {
  const { user, updateProfile } = useUser();
  const [preferences, setPreferences] = useState<string[]>(user.dietaryPreferences);
  const [allergies, setAllergies] = useState<string[]>(user.allergies);
  const [customAllergy, setCustomAllergy] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const togglePreference = useCallback((pref: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreferences(prev => {
      const updated = prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref];
      setHasChanges(true);
      return updated;
    });
  }, []);

  const toggleAllergy = useCallback((allergy: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAllergies(prev => {
      const updated = prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy];
      setHasChanges(true);
      return updated;
    });
  }, []);

  const addCustomAllergy = useCallback(() => {
    const trimmed = customAllergy.trim();
    if (!trimmed) return;
    if (allergies.includes(trimmed)) {
      setCustomAllergy('');
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAllergies(prev => [...prev, trimmed]);
    setCustomAllergy('');
    setHasChanges(true);
  }, [customAllergy, allergies]);

  const handleSave = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateProfile({ dietaryPreferences: preferences, allergies });
    setHasChanges(false);
    Alert.alert('Saved', 'Your dietary preferences have been updated.');
  }, [preferences, allergies, updateProfile]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Dietary Preferences', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Leaf size={20} color={Colors.success} />
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Select all that apply to help us recommend the right meals</Text>
          <View style={styles.chipsWrap}>
            {dietaryOptions.map(opt => {
              const selected = preferences.includes(opt);
              return (
                <Pressable
                  key={opt}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => togglePreference(opt)}
                >
                  {selected && <Check size={14} color={Colors.white} />}
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={20} color={Colors.warning} />
            <Text style={styles.sectionTitle}>Allergies & Intolerances</Text>
          </View>
          <Text style={styles.sectionSubtitle}>We'll flag items containing these ingredients</Text>
          <View style={styles.chipsWrap}>
            {commonAllergens.map(allergen => {
              const selected = allergies.includes(allergen);
              return (
                <Pressable
                  key={allergen}
                  style={[styles.chip, selected && styles.chipAllergySelected]}
                  onPress={() => toggleAllergy(allergen)}
                >
                  {selected && <Check size={14} color={Colors.white} />}
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{allergen}</Text>
                </Pressable>
              );
            })}
          </View>

          {allergies.filter(a => !commonAllergens.includes(a)).length > 0 && (
            <View style={styles.customAllergies}>
              <Text style={styles.customLabel}>Custom allergies:</Text>
              <View style={styles.chipsWrap}>
                {allergies.filter(a => !commonAllergens.includes(a)).map(a => (
                  <Pressable key={a} style={[styles.chip, styles.chipAllergySelected]} onPress={() => toggleAllergy(a)}>
                    <Text style={[styles.chipText, styles.chipTextSelected]}>{a}</Text>
                    <X size={12} color={Colors.white} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.addAllergyRow}>
            <TextInput
              style={styles.allergyInput}
              placeholder="Add custom allergy..."
              placeholderTextColor={Colors.warmGrayLight}
              value={customAllergy}
              onChangeText={setCustomAllergy}
              onSubmitEditing={addCustomAllergy}
              returnKeyType="done"
            />
            <Pressable style={styles.addAllergyBtn} onPress={addCustomAllergy}>
              <Plus size={18} color={Colors.white} />
            </Pressable>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {hasChanges && (
        <View style={styles.bottomBar}>
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Preferences</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.warmGray,
    marginBottom: 14,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipSelected: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  chipAllergySelected: {
    backgroundColor: Colors.warning,
    borderColor: Colors.warning,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.white,
  },
  customAllergies: {
    marginTop: 14,
  },
  customLabel: {
    fontSize: 12,
    color: Colors.warmGray,
    marginBottom: 8,
  },
  addAllergyRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  allergyInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  addAllergyBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.accent,
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
  saveBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
});
