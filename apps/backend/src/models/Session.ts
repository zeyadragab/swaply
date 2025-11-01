import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

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

interface SessionAttributes {
  id: string;
  teacherId: string;
  learnerId: string;
  skillId: string;
  sessionType: SessionType;
  status: SessionStatus;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  durationMinutes: number;
  tokenCost: number;
  title: string;
  description?: string;
  roomId?: string;
  agoraToken?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: string;
  public teacherId!: string;
  public learnerId!: string;
  public skillId!: string;
  public sessionType!: SessionType;
  public status!: SessionStatus;
  public scheduledStartTime!: Date;
  public scheduledEndTime!: Date;
  public actualStartTime?: Date;
  public actualEndTime?: Date;
  public durationMinutes!: number;
  public tokenCost!: number;
  public title!: string;
  public description?: string;
  public roomId?: string;
  public agoraToken?: string;
  public notes?: string;
  public cancellationReason?: string;
  public cancelledBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    learnerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    skillId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'skills',
        key: 'id',
      },
    },
    sessionType: {
      type: DataTypes.ENUM(...Object.values(SessionType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SessionStatus)),
      defaultValue: SessionStatus.SCHEDULED,
    },
    scheduledStartTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    scheduledEndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualStartTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualEndTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tokenCost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agoraToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancelledBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    modelName: 'Session',
  }
);

export default Session;
