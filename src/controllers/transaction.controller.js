import { processSms } from '../services/parser.service.js';
import { Transaction } from '../models/index.js';

export const parseSmsController = async (req, res) => {
  try {
    const { user_id, sms } = req.body;

    if (!user_id || !sms) {
      return res.status(400).json({ error: "user_id and sms are required" });
    }

    const transaction = await processSms(user_id, sms);

    if (!transaction) {
      return res.status(200).json({ message: "Ignored SMS" });
    }

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");

    io.to(user_id.toString()).emit("new_transaction", transaction);

    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Error parsing SMS:", error);
    return res.status(500).json({ error: "Internal server error while parsing SMS" });
  }
};

export const getTransactionsController = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const transactions = await Transaction.findAll({
      where: { user_id },
      order: [['transaction_date', 'DESC']]
    });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error while fetching transactions' });
  }
};
