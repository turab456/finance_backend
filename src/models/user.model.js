import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  monthly_income: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  current_balance: {
  type: DataTypes.FLOAT,
  defaultValue: 0
}
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default User;
