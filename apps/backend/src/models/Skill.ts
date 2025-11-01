import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

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

interface SkillAttributes {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
  totalUsers: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SkillCreationAttributes extends Optional<SkillAttributes, 'id'> {}

class Skill extends Model<SkillAttributes, SkillCreationAttributes> implements SkillAttributes {
  public id!: string;
  public name!: string;
  public category!: SkillCategory;
  public description?: string;
  public iconUrl?: string;
  public isActive!: boolean;
  public totalUsers!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Skill.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(SkillCategory)),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    totalUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'skills',
    modelName: 'Skill',
  }
);

export default Skill;
