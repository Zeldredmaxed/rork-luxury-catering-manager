import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = __DEV__
  ? 'http://localhost:3001'  // Dev: local backend
  : 'https://api.exquisitemeals.com'; // Production: deployed backend

class ApiClient {
  private token: string | null = null;
  private tokenLoaded = false;

  async getToken(): Promise<string | null> {
    if (!this.tokenLoaded) {
      this.token = await AsyncStorage.getItem('auth_token');
      this.tokenLoaded = true;
    }
    return this.token;
  }

  async setToken(token: string | null) {
    this.token = token;
    this.tokenLoaded = true;
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      if (res.status === 401) {
        await this.setToken(null);
        throw new Error('Unauthorized');
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'API Error');
      }
      return res.json();
    } catch (error: any) {
      if (error.message === 'Network request failed') {
        console.log('API offline, using local data');
        return null;
      }
      throw error;
    }
  }

  // ── Auth ──────────────────────────
  async register(data: { email: string; password: string; name: string; phone?: string }) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result?.accessToken) await this.setToken(result.accessToken);
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result?.accessToken) await this.setToken(result.accessToken);
    return result;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    await this.setToken(null);
  }

  // ── Users ─────────────────────────
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(data: any) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async toggleFavorite(menuItemId: string) {
    return this.request(`/users/me/favorites/${menuItemId}`, { method: 'POST' });
  }

  async getFavorites() {
    return this.request('/users/me/favorites');
  }

  // ── Menu ──────────────────────────
  async getMenuItems(filters?: { category?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    const qs = params.toString();
    return this.request(`/menu${qs ? `?${qs}` : ''}`);
  }

  async getMenuItem(id: string) {
    return this.request(`/menu/${id}`);
  }

  async getPromotions() {
    return this.request('/menu/promotions');
  }

  // ── Orders ────────────────────────
  async createOrder(data: {
    items: { menuItemId: string; quantity: number; notes?: string }[];
    deliveryType: string;
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    addressId?: string;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(status?: string) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/orders${params}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  // ── Rewards ───────────────────────
  async getRewardsInfo() {
    return this.request('/rewards');
  }

  async redeemReward(rewardId: string) {
    return this.request(`/rewards/redeem/${rewardId}`, { method: 'POST' });
  }

  async getTierBenefits() {
    return this.request('/rewards/tiers');
  }

  // ── Chat / AI ─────────────────────
  async getOrCreateConversation(orderId?: string) {
    return this.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async getConversationMessages(conversationId: string) {
    return this.request(`/chat/conversations/${conversationId}/messages`);
  }

  async sendChatMessage(conversationId: string, text: string, sender: 'USER' | 'ADMIN' = 'USER') {
    return this.request(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, sender }),
    });
  }

  async chatWithAI(message: string, history: { role: string; content: string }[] = []) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory: history }),
    });
  }

  // ── Payments / Checkout ────────────
  async checkout(data: {
    items: { menuItemId: string; quantity: number; notes?: string }[];
    deliveryType: string;
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    addressId?: string;
    tipAmount?: number;
  }) {
    return this.request('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmPayment(orderId: string, paymentIntentId: string) {
    return this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentIntentId }),
    });
  }

  async createPaymentIntent(amount: number) {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async createCateringDeposit(totalAmount: number, depositPercentage?: number) {
    return this.request('/payments/catering-deposit', {
      method: 'POST',
      body: JSON.stringify({ totalAmount, depositPercentage }),
    });
  }

  // ── Subscriptions ─────────────────
  async getSubscriptions() {
    return this.request('/payments/subscriptions');
  }

  async createSubscription(plan: string) {
    return this.request('/payments/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async pauseSubscription(subscriptionId: string) {
    return this.request(`/payments/subscriptions/${subscriptionId}/pause`, { method: 'PATCH' });
  }

  async resumeSubscription(subscriptionId: string) {
    return this.request(`/payments/subscriptions/${subscriptionId}/resume`, { method: 'PATCH' });
  }

  async cancelSubscription(subscriptionId: string) {
    return this.request(`/payments/subscriptions/${subscriptionId}`, { method: 'DELETE' });
  }

  // ── Referrals ─────────────────────
  async getReferralInfo() {
    return this.request('/referrals');
  }

  async applyReferralCode(code: string) {
    return this.request('/referrals/apply', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // ── Catering ──────────────────────
  async submitCateringInquiry(data: {
    eventType: string;
    eventDate: string;
    eventTime: string;
    guestCount: number;
    venue: string;
    venueAddress?: string;
    dietaryRequirements?: string[];
    cuisinePreference?: string;
    budgetRange?: string;
    specialRequests?: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  }) {
    return this.request('/catering/inquiry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSmartReorderSuggestions() {
    return this.request('/catering/reorder');
  }

  // ── Notifications ─────────────────
  async registerPushToken(token: string, platform: string) {
    return this.request('/notifications/register', {
      method: 'POST',
      body: JSON.stringify({ token, platform }),
    });
  }
}

export const api = new ApiClient();
