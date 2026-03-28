import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Connect to Supabase PostgreSQL database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;
