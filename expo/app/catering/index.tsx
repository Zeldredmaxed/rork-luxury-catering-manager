import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Users, MapPin, ChefHat, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 'Holiday Gathering', 'Other'];
const budgetRanges = ['Under $1,000', '$1,000–$3,000', '$3,000–$5,000', '$5,000–$10,000', '$10,000+'];
const cuisines = ['American', 'Italian', 'Mediterranean', 'Asian Fusion', 'French', 'Custom Menu'];

export default function CateringInquiryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    eventType: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    venue: '',
    venueAddress: '',
    cuisinePreference: '',
    budgetRange: '',
    dietaryRequirements: [] as string[],
    specialRequests: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Inquiry Submitted! 🎉',
      'Our catering team will review your request and contact you within 24 hours with a custom proposal.',
      [{ text: 'Perfect!', onPress: () => router.back() }]
    );
  };

  const steps = [
    // Step 0: Event Details
    <View key="event" style={styles.stepContent}>
      <Text style={styles.stepTitle}>What's the occasion?</Text>
      <View style={styles.chipGrid}>
        {eventTypes.map(type => (
          <Pressable
            key={type}
            onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateForm('eventType', type); }}
            style={[styles.chip, form.eventType === type && styles.chipActive]}
          >
            <Text style={[styles.chipText, form.eventType === type && styles.chipTextActive]}>{type}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.inputGroup}>
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>Date</Text>
            <View style={styles.inputWrap}>
              <Calendar size={16} color={Colors.warmGray} />
              <TextInput style={styles.input} placeholder="MM/DD/YYYY" placeholderTextColor={Colors.warmGrayLight} value={form.eventDate} onChangeText={v => updateForm('eventDate', v)} />
            </View>
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>Time</Text>
            <TextInput style={[styles.inputWrap, styles.input]} placeholder="6:00 PM" placeholderTextColor={Colors.warmGrayLight} value={form.eventTime} onChangeText={v => updateForm('eventTime', v)} />
          </View>
        </View>
        <Text style={styles.inputLabel}>Expected Guests</Text>
        <View style={styles.inputWrap}>
          <Users size={16} color={Colors.warmGray} />
          <TextInput style={styles.input} placeholder="50" keyboardType="number-pad" placeholderTextColor={Colors.warmGrayLight} value={form.guestCount} onChangeText={v => updateForm('guestCount', v)} />
        </View>
      </View>
    </View>,

    // Step 1: Venue & Menu
    <View key="venue" style={styles.stepContent}>
      <Text style={styles.stepTitle}>Venue & Menu</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Venue Name</Text>
        <View style={styles.inputWrap}>
          <MapPin size={16} color={Colors.warmGray} />
          <TextInput style={styles.input} placeholder="Grand Ballroom, Central Park..." placeholderTextColor={Colors.warmGrayLight} value={form.venue} onChangeText={v => updateForm('venue', v)} />
        </View>
        <Text style={styles.inputLabel}>Venue Address</Text>
        <TextInput style={[styles.inputWrap, styles.input]} placeholder="123 Event St, New York, NY" placeholderTextColor={Colors.warmGrayLight} value={form.venueAddress} onChangeText={v => updateForm('venueAddress', v)} />
      </View>

      <Text style={styles.inputLabel}>Cuisine Preference</Text>
      <View style={styles.chipGrid}>
        {cuisines.map(c => (
          <Pressable
            key={c}
            onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateForm('cuisinePreference', c); }}
            style={[styles.chip, form.cuisinePreference === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, form.cuisinePreference === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.inputLabel}>Budget Range</Text>
      <View style={styles.chipGrid}>
        {budgetRanges.map(b => (
          <Pressable
            key={b}
            onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateForm('budgetRange', b); }}
            style={[styles.chip, form.budgetRange === b && styles.chipActive]}
          >
            <Text style={[styles.chipText, form.budgetRange === b && styles.chipTextActive]}>{b}</Text>
          </Pressable>
        ))}
      </View>
    </View>,

    // Step 2: Contact & Submit
    <View key="contact" style={styles.stepContent}>
      <Text style={styles.stepTitle}>Contact & Special Requests</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput style={[styles.inputWrap, styles.input]} placeholder="Alexandra Chen" placeholderTextColor={Colors.warmGrayLight} value={form.contactName} onChangeText={v => updateForm('contactName', v)} />

        <Text style={styles.inputLabel}>Phone</Text>
        <TextInput style={[styles.inputWrap, styles.input]} placeholder="+1 (555) 123-4567" keyboardType="phone-pad" placeholderTextColor={Colors.warmGrayLight} value={form.contactPhone} onChangeText={v => updateForm('contactPhone', v)} />

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={[styles.inputWrap, styles.input]} placeholder="alex@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.warmGrayLight} value={form.contactEmail} onChangeText={v => updateForm('contactEmail', v)} />

        <Text style={styles.inputLabel}>Special Requests (optional)</Text>
        <TextInput
          style={[styles.inputWrap, styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
          placeholder="Dietary restrictions, theme, decor preferences..."
          placeholderTextColor={Colors.warmGrayLight}
          multiline
          value={form.specialRequests}
          onChangeText={v => updateForm('specialRequests', v)}
        />
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Inquiry Summary</Text>
        {form.eventType ? <Text style={styles.summaryItem}>🎉 {form.eventType}</Text> : null}
        {form.eventDate ? <Text style={styles.summaryItem}>📅 {form.eventDate} at {form.eventTime}</Text> : null}
        {form.guestCount ? <Text style={styles.summaryItem}>👥 {form.guestCount} guests</Text> : null}
        {form.venue ? <Text style={styles.summaryItem}>📍 {form.venue}</Text> : null}
        {form.cuisinePreference ? <Text style={styles.summaryItem}>🍽️ {form.cuisinePreference}</Text> : null}
        {form.budgetRange ? <Text style={styles.summaryItem}>💰 {form.budgetRange}</Text> : null}
      </View>
    </View>,
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => (step > 0 ? setStep(step - 1) : router.back())} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Catering Inquiry</Text>
          <Text style={styles.headerSub}>Step {step + 1} of 3</Text>
        </View>
        <ChefHat size={24} color={Colors.accent} />
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {steps[step]}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {step < 2 ? (
          <Pressable
            onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setStep(step + 1); }}
            style={styles.nextBtn}
          >
            <Text style={styles.nextBtnText}>Continue</Text>
          </Pressable>
        ) : (
          <Pressable onPress={handleSubmit} style={[styles.nextBtn, { backgroundColor: '#2E7D32' }]}>
            <Send size={18} color="#FFF" />
            <Text style={styles.nextBtnText}>Submit Inquiry</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  headerSub: { fontSize: 12, color: Colors.warmGray, marginTop: 2 },
  progress: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 8 },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.accent },
  stepContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 16 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.warmGray },
  chipTextActive: { color: '#FFF' },
  inputGroup: { gap: 12 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.textLight, marginBottom: 4, marginTop: 8 },
  inputRow: { flexDirection: 'row', gap: 12 },
  inputHalf: { flex: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, height: 48, gap: 10, borderWidth: 1, borderColor: Colors.border },
  input: { flex: 1, fontSize: 14, color: Colors.text },
  summary: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: Colors.border },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  summaryItem: { fontSize: 13, color: Colors.warmGray, marginBottom: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.cream },
  nextBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: Colors.accent, borderRadius: 16, height: 56 },
  nextBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
