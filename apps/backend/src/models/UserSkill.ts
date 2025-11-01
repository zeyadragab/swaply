import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';
import { SkillLevel } from './Skill';

export enum SkillType {
  CAN_TEACH = 'can_teach',
  WANT_TO_LEARN = 'want_to_learn',
}

interface UserSkillAttributes {
  id: string;
  userId: string;
  skillId: string;
  skillType: SkillType;
  level: SkillLevel;
  yearsOfExperience?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserSkillCreationAttributes extends Optional<UserSkillAttributes, 'id'> {}

class UserSkill extends Model<UserSkillAttributes, UserSkillCreationAttributes> implements UserSkillAttributes {
  public id!: string;
  public userId!: string;
  public skillId!: string;
  public skillType!: SkillType;
  public level!: SkillLevel;
  public yearsOfExperience?: number;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserSkill.init(
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
    skillId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'skills',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    skillType: {
      type: DataTypes.ENUM(...Object.values(SkillType)),
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM(...Object.values(SkillLevel)),
      allowNull: false,
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_skills',
    modelName: 'UserSkill',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'skill_id', 'skill_type'],
      },
    ],
  }
);

export default UserSkill;
