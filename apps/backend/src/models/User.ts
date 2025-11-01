import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';
import bcrypt from 'bcryptjs';

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

interface UserAttributes {
  id: string;
  email: string;
  password?: string;
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
  totalRatingsAsTeacher: number;
  totalRatingsAsLearner: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  isActive: boolean;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password?: string;
  public firstName!: string;
  public lastName!: string;
  public displayName?: string;
  public bio?: string;
  public profilePhoto?: string;
  public phoneNumber?: string;
  public country?: string;
  public timeZone?: string;
  public language?: string;
  public role!: UserRole;
  public authProvider!: AuthProvider;
  public isEmailVerified!: boolean;
  public isPhoneVerified!: boolean;
  public isIdentityVerified!: boolean;
  public tokenBalance!: number;
  public totalTokensEarned!: number;
  public totalTokensSpent!: number;
  public totalLessonsTaught!: number;
  public totalLessonsAttended!: number;
  public totalLearningHours!: number;
  public totalTeachingHours!: number;
  public averageRatingAsTeacher!: number;
  public averageRatingAsLearner!: number;
  public totalRatingsAsTeacher!: number;
  public totalRatingsAsLearner!: number;
  public currentStreak!: number;
  public longestStreak!: number;
  public lastActiveDate?: Date;
  public isActive!: boolean;
  public isBlocked!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  }

  public toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timeZone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: UserRole.USER,
    },
    authProvider: {
      type: DataTypes.ENUM(...Object.values(AuthProvider)),
      defaultValue: AuthProvider.EMAIL,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isIdentityVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tokenBalance: {
      type: DataTypes.INTEGER,
      defaultValue: parseInt(process.env.INITIAL_USER_TOKENS || '100'),
    },
    totalTokensEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalTokensSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalLessonsTaught: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalLessonsAttended: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalLearningHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalTeachingHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    averageRatingAsTeacher: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    averageRatingAsLearner: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalRatingsAsTeacher: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalRatingsAsLearner: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    currentStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    longestStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastActiveDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        if (!user.displayName) {
          user.displayName = `${user.firstName} ${user.lastName}`;
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
