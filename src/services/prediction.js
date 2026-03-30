import dayjs from 'dayjs';
import { User, Transaction } from '../models/index.js'; // 🔥 added Transaction
import { getAvgDailySpend } from './stats.js';

export const predictBalance = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) throw new Error("User not found");

  let balance;

  // ✅ CASE 1: Use real balance if available
  if (user.current_balance !== null && user.current_balance !== undefined) {
    balance = user.current_balance;
  } 
  // ⚠️ CASE 2: Estimate balance from transactions
  else {
    const credits = await Transaction.sum('amount', {
      where: { user_id: userId, type: 'credit' }
    });

    const debits = await Transaction.sum('amount', {
      where: { user_id: userId, type: 'debit' }
    });

    balance = (credits || 0) - (debits || 0);
  }

  const avgDailySpend = await getAvgDailySpend(userId);

  let predictions = [];

  for (let i = 1; i <= 30; i++) {
    const date = dayjs().add(i, 'day');

    // Salary on 1st
    if (date.date() === 1 && user.monthly_income) {
      balance += user.monthly_income;
    }

    balance -= avgDailySpend;

    predictions.push({
      date: date.format('YYYY-MM-DD'),
      balance: Math.round(balance)
    });
  }

  return {
    predictions,
    is_estimated: user.current_balance == null // 🔥 important
  };
};