import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface RatingAttributes {
  id: string;
  sessionId: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  comment?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface RatingCreationAttributes extends Optional<RatingAttributes, 'id'> {}

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
  public id!: string;
  public sessionId!: string;
  public raterId!: string;
  public ratedUserId!: string;
  public rating!: number;
  public comment?: string;
  public tags?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    raterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    ratedUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'ratings',
    modelName: 'Rating',
    indexes: [
      {
        unique: true,
        fields: ['session_id', 'rater_id'],
      },
    ],
  }
);

export default Rating;
