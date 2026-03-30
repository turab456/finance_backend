import { Transaction } from '../models/index.js';
import { Op, fn, col } from 'sequelize';

export const getAvgDailySpend = async (userId) => {
  // Step 1: Get daily totals
  const dailyData = await Transaction.findAll({
    where: {
      user_id: userId,
      type: 'debit'
    },
    attributes: [
      [fn('DATE', col('transaction_date')), 'date'],
      [fn('SUM', col('amount')), 'daily_total']
    ],
    group: [fn('DATE', col('transaction_date'))],
    raw: true
  });

  if (!dailyData.length) return 0;

  // Step 2: Calculate average in JS
  const total = dailyData.reduce((sum, d) => sum + parseFloat(d.daily_total), 0);

  return total / dailyData.length;
};