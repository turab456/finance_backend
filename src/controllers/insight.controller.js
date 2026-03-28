import { generateInsights } from '../services/insight.service.js';

export const getInsightsController = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const insights = await generateInsights(user_id);
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Internal server error while getting insights' });
  }
};
