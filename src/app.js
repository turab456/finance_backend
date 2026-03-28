import express from 'express';
import { sequelize } from './models/index.js';
import transactionRoutes from './routes/transaction.routes.js';
import insightRoutes from './routes/insight.routes.js';
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/transactions', transactionRoutes);
app.use('/insights', insightRoutes);

// HTTP server
const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// attach io globally
app.set("io", io);

// socket events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId.toString());
    console.log("joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// DB + Server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    await sequelize.sync({ alter: true });
    console.log('DB synced');

    // 🔥 IMPORTANT FIX HERE
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('DB error:', error);
  }
};

startServer();