import { parseSmsText } from "../utils/regex.js";
import { categorizeMerchant } from "./category.service.js";
import { Transaction, User } from "../models/index.js";
import crypto from "crypto";

export const processSms = async (userId, smsText) => {
  console.log(smsText, "smsText");

  try {
    if (!smsText || typeof smsText !== "string") {
      throw new Error("Invalid SMS text");
    }

    // 🔥 STEP 1: Generate SMS hash
    const normalizedText = smsText
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const sms_hash = crypto
      .createHash("sha256")
      .update(normalizedText)
      .digest("hex");

    // ✅ Ensure user exists
    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({
        id: userId,
        phone: `+9100000000${userId}`,
        current_balance: 0,
      });
    }

    // 🔥 STEP 2: DUPLICATE CHECK USING HASH (FIXED)
    const existing = await Transaction.findOne({
      where: { sms_hash },
    });

    if (existing) {
      console.log("Duplicate transaction skipped");
      return existing;
    }

    // ✅ Parse SMS
    const parsed = parseSmsText(smsText);
    let { amount, merchant, type, transaction_date } = parsed;

    console.log(parsed, "parsed");

    // ❗ Amount fallback
    if (!amount) {
      console.warn("Amount not detected:", smsText);
      return null;
    }

    // 🔥 FIX: Type detection fallback
    if (!type) {
      if (/credited|received|deposit|deposited/i.test(smsText)) {
        type = "credit";
      } else if (/debited|spent|paid|withdrawn/i.test(smsText)) {
        type = "debit";
      } else {
        type = "debit";
      }
    }

    // ❗ Merchant fallback
    if (!merchant || merchant === "Unknown") {
      merchant = "others";
    }

    // ✅ Normalize merchant
    merchant = merchant.toLowerCase().replace(/[^a-z0-9]/g, "");

    // ✅ Categorize
    const category = categorizeMerchant(merchant);

    // ✅ Date fallback
    if (!transaction_date || isNaN(new Date(transaction_date))) {
      transaction_date = new Date();
    }

    // 🔥 STEP 3: Save transaction WITH sms_hash
    const transaction = await Transaction.create({
      user_id: user.id,
      amount,
      merchant,
      category,
      type,
      raw_text: smsText,
      sms_hash, // 🔥 IMPORTANT
      transaction_date,
    });

    // 🔥 STEP 4: Update balance
    if (type === "credit") {
      user.current_balance = (user.current_balance || 0) + amount;
    } else {
      user.current_balance = (user.current_balance || 0) - amount;
    }

    await user.save();

    console.log("Updated Balance:", user.current_balance);

    return transaction;

  } catch (error) {
    console.error("processSms error:", error.message);
    throw error;
  }
};