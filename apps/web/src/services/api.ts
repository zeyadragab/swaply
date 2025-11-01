import axios from 'axios';
import type { ApiResponse, User, Skill, UserSkill, Session, TokenTransaction } from '@swaply/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>('/auth/login', data),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ token: string; refreshToken: string }>>('/auth/refresh-token', { refreshToken }),
};

// User API
export const userApi = {
  getMe: () => api.get<ApiResponse<{ user: User }>>('/users/me'),

  updateMe: (data: Partial<User>) => api.patch<ApiResponse<{ user: User }>>('/users/me', data),

  getUserById: (id: string) => api.get<ApiResponse<{ user: User }>>(`/users/${id}`),

  searchUsers: (params: { query?: string; skillId?: string; country?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ users: User[]; pagination: any }>>('/users/search', { params }),
};

// Skill API
export const skillApi = {
  getAllSkills: (params?: { category?: string; search?: string }) =>
    api.get<ApiResponse<{ skills: Skill[] }>>('/skills', { params }),

  getMySkills: () => api.get<ApiResponse<{ canTeach: UserSkill[]; wantToLearn: UserSkill[] }>>('/skills/my-skills'),

  addUserSkill: (data: Omit<UserSkill, 'id'>) =>
    api.post<ApiResponse<{ userSkill: UserSkill }>>('/skills/my-skills', data),

  removeUserSkill: (id: string) => api.delete(`/skills/my-skills/${id}`),

  findMatches: (limit?: number) =>
    api.get<ApiResponse<{ matches: User[] }>>('/skills/matches', { params: { limit } }),
};

// Session API
export const sessionApi = {
  createSession: (data: any) => api.post<ApiResponse<{ session: Session }>>('/sessions', data),

  getMySessions: (params?: { status?: string; type?: string; upcoming?: boolean }) =>
    api.get<ApiResponse<{ sessions: Session[] }>>('/sessions', { params }),

  getSessionById: (id: string) => api.get<ApiResponse<{ session: Session }>>(`/sessions/${id}`),

  startSession: (id: string) =>
    api.post<ApiResponse<{ session: Session; agoraToken: string; appId: string }>>(`/sessions/${id}/start`),

  endSession: (id: string) => api.post<ApiResponse<{ session: Session }>>(`/sessions/${id}/end`),

  cancelSession: (id: string, reason: string) =>
    api.post<ApiResponse<{ session: Session }>>(`/sessions/${id}/cancel`, { reason }),
};

// Token API
export const tokenApi = {
  getBalance: () =>
    api.get<ApiResponse<{ balance: number; totalEarned: number; totalSpent: number }>>('/tokens/balance'),

  getTransactions: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get<ApiResponse<{ transactions: TokenTransaction[]; pagination: any }>>('/tokens/transactions', { params }),

  createPurchase: (amount: number) =>
    api.post<ApiResponse<{ clientSecret: string; amount: number; price: number }>>('/tokens/purchase', { amount }),

  claimDailyChallenge: () =>
    api.post<ApiResponse<{ tokensEarned: number; newBalance: number }>>('/tokens/daily-challenge'),
};

export default api;
