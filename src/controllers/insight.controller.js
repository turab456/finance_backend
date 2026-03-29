import { generateInsights } from '../services/insight.service.js';
import jwt from 'jsonwebtoken';

export const getInsightsController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId missing in token' });
    }

    const insights = await generateInsights(userId);

    res.status(200).json(insights);

  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Internal server error while getting insights' });
  }
};