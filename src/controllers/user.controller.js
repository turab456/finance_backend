import { User } from '../models/index.js';

export const createUserController = async (req, res) => {
  try {
    const { phone, monthly_income } = req.body;

    const user = await User.create({
      phone,
      monthly_income
    });

    res.status(201).json(user);
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