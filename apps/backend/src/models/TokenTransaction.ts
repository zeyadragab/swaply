import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

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

interface TokenTransactionAttributes {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description: string;
  referenceId?: string;
  referenceType?: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TokenTransactionCreationAttributes extends Optional<TokenTransactionAttributes, 'id'> {}

class TokenTransaction extends Model<TokenTransactionAttributes, TokenTransactionCreationAttributes> implements TokenTransactionAttributes {
  public id!: string;
  public userId!: string;
  public amount!: number;
  public type!: TransactionType;
  public description!: string;
  public referenceId?: string;
  public referenceType?: string;
  public balanceBefore!: number;
  public balanceAfter!: number;
  public metadata?: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TokenTransaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    referenceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balanceBefore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'token_transactions',
    modelName: 'TokenTransaction',
  }
);

export default TokenTransaction;
