const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.accessToken);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Orders
  async getOrders(status?: string) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/orders/admin${params}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getOrderStats() {
    return this.request('/orders/stats');
  }

  // Menu
  async getMenuItems() {
    return this.request('/menu');
  }

  async createMenuItem(data: any) {
    return this.request('/menu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(id: string, data: any) {
    return this.request(`/menu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(id: string) {
    return this.request(`/menu/${id}`, { method: 'DELETE' });
  }

  // Chat
  async getConversations() {
    return this.request('/chat/conversations/admin');
  }

  async getMessages(conversationId: string) {
    return this.request(`/chat/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, text: string) {
    return this.request(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, sender: 'ADMIN' }),
    });
  }

  async getAiSuggestion(message: string) {
    return this.request('/ai/suggest-reply', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Rewards
  async getRewardsCatalog() {
    return this.request('/rewards/tiers');
  }

  async createReward(data: any) {
    return this.request('/rewards/catalog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async broadcast(title: string, body: string, segment?: any) {
    return this.request('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify({ title, body, segment }),
    });
  }
}

export const api = new ApiClient();
