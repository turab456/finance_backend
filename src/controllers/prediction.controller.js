import { predictBalance } from "../services/prediction.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

export const getPredictionController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    console.log(token);

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.userId;

    const result = await predictBalance(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
};
