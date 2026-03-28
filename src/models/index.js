import sequelize from '../config/db.js';
import User from './user.model.js';
import Transaction from './transaction.model.js';

// Setup associations
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

export {
  sequelize,
  User,
  Transaction
};
