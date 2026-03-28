import { Transaction, User } from '../models/index.js';
import sequelize from '../config/db.js';
import { generateAIInsight } from "../services/aiInsights.js";

export const generateInsights = async (userId) => {
  const user = await User.findByPk(userId);

  const transactions = await Transaction.findAll({
    where: { user_id: userId, type: 'debit' },
    attributes: [
      'category',
      [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
    ],
    group: ['category'],
    raw: true,
  });

  if (!transactions.length) {
    return {
      total_spend: 0,
      breakdown: [],
      top_category: null,
      message: "No spending data available yet. Add transactions to get insights."
    };
  }

  let total_spend = 0;
  let maxSpend = 0;
  let top_category = null;

  const breakdown = transactions.map(t => {
    const amount = parseFloat(t.total_amount);
    total_spend += amount;

    if (amount > maxSpend) {
      maxSpend = amount;
      top_category = t.category;
    }

    return {
      category: t.category,
      amount
    };
  });

  const categoryCount = breakdown.length;

  const topCategoryPercentage = total_spend > 0
    ? Math.round((maxSpend / total_spend) * 100)
    : 0;

  // =========================
  // ✅ STEP 1: RULE-BASED MESSAGE (fallback)
  // =========================
  let message;

  if (total_spend < 500 && categoryCount <= 1) {
    message = "Add a few more transactions to unlock meaningful insights.";
  } else if (categoryCount === 1) {
    message = `Most of your spending so far is on ${top_category}.`;
  } else if (topCategoryPercentage >= 90) {
    message = `A large portion of your spending is on ${top_category}. Consider reviewing it.`;
  } else {
    message = `You spent ${topCategoryPercentage}% on ${top_category}. Try optimizing it.`;
  }

  // Income-based addition
  if (user?.monthly_income && total_spend > 0) {
    const incomePercent = Math.round((total_spend / user.monthly_income) * 100);

    if (incomePercent > 80) {
      message += ` You're spending ${incomePercent}% of your income — quite high.`;
    } else if (incomePercent < 30) {
      message += ` Good job! You're only spending ${incomePercent}% of your income.`;
    }
  }

  // =========================
  // ✅ STEP 2: PREPARE AI INPUT
  // =========================
  const insightData = {
    total_spend,
    top_category,
    top_percentage: topCategoryPercentage,
    category_count: categoryCount,
    income: user?.monthly_income || null
  };

  // =========================
  // ✅ STEP 3: AI CALL
  // =========================
  let aiMessage = await generateAIInsight(insightData);

  // =========================
  // ✅ STEP 4: FALLBACK SAFETY
  // =========================
  if (!aiMessage) {
    aiMessage = message;
  }

  // =========================
  // ✅ FINAL RESPONSE
  // =========================
  return {
    total_spend,
    breakdown,
    top_category,
    message: aiMessage
  };
};