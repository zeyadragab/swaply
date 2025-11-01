import User from './User';
import Skill from './Skill';
import UserSkill from './UserSkill';
import Session from './Session';
import TokenTransaction from './TokenTransaction';
import Rating from './Rating';

// Define associations
User.hasMany(UserSkill, { foreignKey: 'userId', as: 'userSkills' });
UserSkill.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Skill.hasMany(UserSkill, { foreignKey: 'skillId', as: 'userSkills' });
UserSkill.belongsTo(Skill, { foreignKey: 'skillId', as: 'skill' });

User.hasMany(Session, { foreignKey: 'teacherId', as: 'taughtSessions' });
User.hasMany(Session, { foreignKey: 'learnerId', as: 'learnedSessions' });
Session.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
Session.belongsTo(User, { foreignKey: 'learnerId', as: 'learner' });
Session.belongsTo(Skill, { foreignKey: 'skillId', as: 'skill' });

User.hasMany(TokenTransaction, { foreignKey: 'userId', as: 'tokenTransactions' });
TokenTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Session.hasMany(Rating, { foreignKey: 'sessionId', as: 'ratings' });
Rating.belongsTo(Session, { foreignKey: 'sessionId', as: 'session' });
Rating.belongsTo(User, { foreignKey: 'raterId', as: 'rater' });
Rating.belongsTo(User, { foreignKey: 'ratedUserId', as: 'ratedUser' });

export {
  User,
  Skill,
  UserSkill,
  Session,
  TokenTransaction,
  Rating,
};
