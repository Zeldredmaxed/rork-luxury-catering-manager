import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I place an order?',
    answer: 'Browse our menu, add items to your cart, select delivery or pickup, choose a date and time, and proceed to checkout. You can also use our AI assistant to help you place an order.',
  },
  {
    id: '2',
    question: 'What are your delivery areas?',
    answer: 'We currently deliver within a 15-mile radius of our kitchen. Enter your address at checkout to confirm availability in your area.',
  },
  {
    id: '3',
    question: 'How does the rewards program work?',
    answer: 'Earn 1 point for every $1 spent. Points can be redeemed for free items, discounts, and exclusive experiences. As you earn more points, you advance through Bronze, Silver, Gold, and VIP tiers with increasing benefits.',
  },
  {
    id: '4',
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled up to 2 hours before the scheduled delivery/pickup time. Contact us through the chat feature or call us directly.',
  },
  {
    id: '5',
    question: 'Do you accommodate dietary restrictions?',
    answer: 'Yes! Set your dietary preferences and allergies in your profile, and we will flag items accordingly. You can also add special instructions to individual items.',
  },
  {
    id: '6',
    question: 'How do subscription meal plans work?',
    answer: 'Choose a weekly plan (3, 5, or 7 meals), customize your preferences, and we deliver fresh meals to your door each week. Plans auto-renew and can be paused or cancelled anytime.',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = useCallback((id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedFaq(prev => prev === id ? null : id);
  }, []);

  const handleContact = useCallback((type: 'chat' | 'phone' | 'email') => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (type) {
      case 'chat':
        router.push('/(tabs)/chat');
        break;
      case 'phone':
        void Linking.openURL('tel:+18005551234');
        break;
      case 'email':
        void Linking.openURL('mailto:support@exquisitemeals.com');
        break;
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Help & Support', headerShown: true, headerStyle: { backgroundColor: Colors.cream }, headerTintColor: Colors.text }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need help? We're here for you.</Text>
          <View style={styles.contactCards}>
            <Pressable style={styles.contactCard} onPress={() => handleContact('chat')}>
              <View style={[styles.contactIcon, { backgroundColor: Colors.accent + '15' }]}>
                <MessageCircle size={22} color={Colors.accent} />
              </View>
              <Text style={styles.contactLabel}>Live Chat</Text>
              <Text style={styles.contactDesc}>Available 24/7</Text>
            </Pressable>
            <Pressable style={styles.contactCard} onPress={() => handleContact('phone')}>
              <View style={[styles.contactIcon, { backgroundColor: Colors.success + '15' }]}>
                <Phone size={22} color={Colors.success} />
              </View>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactDesc}>Mon-Sat, 9-8</Text>
            </Pressable>
            <Pressable style={styles.contactCard} onPress={() => handleContact('email')}>
              <View style={[styles.contactIcon, { backgroundColor: Colors.warning + '15' }]}>
                <Mail size={22} color={Colors.warning} />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactDesc}>Within 24hrs</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqs.map(faq => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <Pressable key={faq.id} style={styles.faqItem} onPress={() => toggleFaq(faq.id)}>
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    {isExpanded ? (
                      <ChevronUp size={18} color={Colors.accent} />
                    ) : (
                      <ChevronDown size={18} color={Colors.warmGray} />
                    )}
                  </View>
                  {isExpanded && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.linksSection}>
          <Pressable style={styles.linkRow} onPress={() => void Linking.openURL('https://exquisitemeals.com/terms')}>
            <FileText size={18} color={Colors.accent} />
            <Text style={styles.linkText}>Terms of Service</Text>
            <ExternalLink size={14} color={Colors.warmGrayLight} />
          </Pressable>
          <Pressable style={styles.linkRow} onPress={() => void Linking.openURL('https://exquisitemeals.com/privacy')}>
            <FileText size={18} color={Colors.accent} />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <ExternalLink size={14} color={Colors.warmGrayLight} />
          </Pressable>
        </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  contactSection: {
    marginBottom: 28,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  contactCards: {
    flexDirection: 'row',
    gap: 10,
  },
  contactCard: {
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
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  contactDesc: {
    fontSize: 11,
    color: Colors.warmGray,
    marginTop: 2,
  },
  faqSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warmGray,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  faqList: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.warmGray,
    lineHeight: 21,
    marginTop: 10,
    paddingRight: 20,
  },
  linksSection: {
    gap: 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
});
