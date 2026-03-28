import { parseSmsText } from '../utils/regex.js';
import { categorizeMerchant } from './category.service.js';
import { Transaction, User } from '../models/index.js';

export const processSms = async (userId, smsText) => {
  console.log(smsText,"smsText")
  try {
    if (!smsText || typeof smsText !== "string") {
      throw new Error("Invalid SMS text");
    }

    // ✅ Ensure user exists
    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({
        id: userId,
        phone: `+9100000000${userId}`,
      });
    }

    // ✅ Parse SMS
    const parsed = parseSmsText(smsText);

    let { amount, merchant, type, transaction_date } = parsed;
    console.log(parsed,"parsed")

    // ❗ Fallbacks (IMPORTANT for messy SMS)
    if (!amount) {
      console.warn("Amount not detected:", smsText);
      return null; // skip invalid transaction
    }

    if (!merchant || merchant === "Unknown") {
      merchant = "others";
    }

    // ✅ Clean merchant (normalize)
    merchant = merchant.toLowerCase().replace(/[^a-z0-9]/g, "");

    // ✅ Categorize
    const category = categorizeMerchant(merchant);

    // ✅ Date fallback
    if (!transaction_date || isNaN(new Date(transaction_date))) {
      transaction_date = new Date();
    }

    // ✅ Prevent duplicates (basic check)
    const existing = await Transaction.findOne({
      where: {
        user_id: user.id,
        amount,
        merchant,
        transaction_date,
      },
    });

    if (existing) {
      console.log("Duplicate transaction skipped");
      return existing;
    }

    // ✅ Save transaction
    const transaction = await Transaction.create({
      user_id: user.id,
      amount,
      merchant,
      category,
      type: type || "debit",
      raw_text: smsText,
      transaction_date,
    });

    return transaction;
  } catch (error) {
    console.error("processSms error:", error.message);
    throw error;
  }
};