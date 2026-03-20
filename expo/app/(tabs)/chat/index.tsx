import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Bot, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ChatMessage } from '@/types';
import * as Haptics from 'expo-haptics';

const quickReplies = [
  "What's on the menu today?",
  'Recommend something healthy',
  'Do you have vegan options?',
  'Help me plan a dinner party',
];

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: "Welcome to Exquisite Meals! I'm your personal culinary concierge. How can I help you today?",
    sender: 'assistant',
    timestamp: new Date().toISOString(),
  },
];

const aiResponses: Record<string, string> = {
  menu: "Today's specials include our Herb-Crusted Salmon ($28.99) and Truffle Mushroom Risotto ($24.99). Both are chef's picks! Would you like to add either to your cart?",
  healthy: "I'd recommend our Mediterranean Grain Bowl — it's packed with quinoa, farro, roasted chickpeas, and a delicious tahini dressing. Only 480 calories! It's vegan and dairy-free too.",
  vegan: "Absolutely! Our Mediterranean Grain Bowl is fully vegan and dairy-free. We also have several meal prep options that can be customized to be plant-based. Want me to show you the full vegan-friendly menu?",
  party: "I'd love to help with that! For dinner parties, our Elegant Cocktail Reception package ($899.99 for up to 50 guests) is a popular choice. It includes canapés, charcuterie, artisan cheeses, and seasonal crostini. Shall I help you customize a menu?",
  default: "That's a great question! Let me help you with that. Our team specializes in creating memorable dining experiences. Could you tell me more about what you're looking for?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('menu') || lower.includes('today')) return aiResponses.menu;
  if (lower.includes('healthy') || lower.includes('recommend')) return aiResponses.healthy;
  if (lower.includes('vegan') || lower.includes('vegetarian') || lower.includes('plant')) return aiResponses.vegan;
  if (lower.includes('party') || lower.includes('dinner') || lower.includes('event') || lower.includes('catering')) return aiResponses.party;
  return aiResponses.default;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping, typingAnim]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  }, []);

  const handleQuickReply = useCallback((text: string) => {
    sendMessage(text);
  }, [sendMessage]);

  const handleSend = useCallback(() => {
    sendMessage(inputText);
  }, [inputText, sendMessage]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Bot size={20} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Culinary Concierge</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Always available</Text>
            </View>
          </View>
        </View>
        <Sparkles size={20} color={Colors.accent} />
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageBubbleWrap,
                msg.sender === 'user' ? styles.userBubbleWrap : styles.assistantBubbleWrap,
              ]}
            >
              {msg.sender === 'assistant' && (
                <View style={styles.smallAvatar}>
                  <Bot size={12} color={Colors.white} />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userMessageText : styles.assistantMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubbleWrap, styles.assistantBubbleWrap]}>
              <View style={styles.smallAvatar}>
                <Bot size={12} color={Colors.white} />
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble, styles.typingBubble]}>
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
              </View>
            </View>
          )}
        </ScrollView>

        {messages.length <= 1 && (
          <View style={styles.quickReplies}>
            {quickReplies.map((reply, i) => (
              <Pressable key={i} style={styles.quickReplyPill} onPress={() => handleQuickReply(reply)}>
                <Text style={styles.quickReplyText}>{reply}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor={Colors.warmGrayLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              testID="chat-input"
            />
            <Pressable
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
              testID="send-button"
            >
              <Send size={18} color={inputText.trim() ? Colors.white : Colors.warmGrayLight} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 12,
    color: Colors.warmGray,
  },
  chatArea: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
  },
  userBubbleWrap: {
    alignSelf: 'flex-end',
  },
  assistantBubbleWrap: {
    alignSelf: 'flex-start',
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: Colors.white,
  },
  assistantMessageText: {
    color: Colors.text,
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.warmGray,
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  quickReplyPill: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickReplyText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '500' as const,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.beigeLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.beigeLight,
  },
});
