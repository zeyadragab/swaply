export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export enum SkillCategory {
  MUSIC = 'music',
  LANGUAGES = 'languages',
  ARTS = 'arts',
  TECHNOLOGY = 'technology',
  SPORTS = 'sports',
  COOKING = 'cooking',
  BUSINESS = 'business',
  PHOTOGRAPHY = 'photography',
  WRITING = 'writing',
  CRAFTS = 'crafts',
  OTHER = 'other',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum SkillType {
  CAN_TEACH = 'can_teach',
  WANT_TO_LEARN = 'want_to_learn',
}

export enum SessionType {
  SKILL_SWAP = 'skill_swap',
  PAID_LESSON = 'paid_lesson',
  GROUP_WORKSHOP = 'group_workshop',
}

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum TransactionType {
  EARNED_TEACHING = 'earned_teaching',
  SPENT_LEARNING = 'spent_learning',
  EARNED_REFERRAL = 'earned_referral',
  EARNED_CHALLENGE = 'earned_challenge',
  EARNED_STREAK = 'earned_streak',
  PURCHASED = 'purchased',
  ADMIN_CREDIT = 'admin_credit',
  ADMIN_DEBIT = 'admin_debit',
  REFUND = 'refund',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  profilePhoto?: string;
  phoneNumber?: string;
  country?: string;
  timeZone?: string;
  language?: string;
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  tokenBalance: number;
  totalTokensEarned: number;
  totalTokensSpent: number;
  totalLessonsTaught: number;
  totalLessonsAttended: number;
  totalLearningHours: number;
  totalTeachingHours: number;
  averageRatingAsTeacher: number;
  averageRatingAsLearner: number;
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
  totalUsers: number;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skillType: SkillType;
  level: SkillLevel;
  yearsOfExperience?: number;
  description?: string;
  skill?: Skill;
}

export interface Session {
  id: string;
  teacherId: string;
  learnerId: string;
  skillId: string;
  sessionType: SessionType;
  status: SessionStatus;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  durationMinutes: number;
  tokenCost: number;
  title: string;
  description?: string;
  roomId?: string;
  teacher?: User;
  learner?: User;
  skill?: Skill;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: any[];
}
