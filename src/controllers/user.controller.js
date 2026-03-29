import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export const createUserController = async (req, res) => {
  try {
    const { phone, monthly_income } = req.body;

    // Check if user already exists (optional, but good practice)
    let user = await User.findOne({ where: { phone } });
    
    if (!user) {
      user = await User.create({
        phone,
        monthly_income
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error while creating user' });
  }
};

export const getUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error while fetching user' });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, monthly_income } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      phone,
      monthly_income
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error while updating user' });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error while deleting user' });
  }
};

export const loginController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    let user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ error: 'User with this phone number not found' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const getMeController = async (req, res) => {
  try {
    // Auth middleware attaches the user to req.user
    const user = req.user;

    res.status(200).json({
      id: user.id,
      phone: user.phone,
      monthly_income: user.monthly_income,
    });
  } catch (error) {
    console.error('Error in getMeController:', error);
    res.status(500).json({ error: 'Internal server error while fetching current user' });
  }
};